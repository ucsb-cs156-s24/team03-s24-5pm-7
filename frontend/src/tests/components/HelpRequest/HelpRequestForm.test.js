import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Help Request", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );

        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIDField = screen.getByTestId("HelpRequestForm-teamID");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(teamIDField, { target: { value: 'bad-input' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(solvedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester email must be in the format name@ucsb.edu, e.g. cgaucho@ucsb.edu/);
        expect(screen.getByText(/The input should be true or false/)).toBeInTheDocument();
    });

    test("Error message on invalid email pattern", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        // Change the value to an invalid email pattern
        fireEvent.change(requesterEmailField, { target: { value: 'invalid_email' } });
        // Fire other events to trigger validation if needed
        // ...
        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        fireEvent.click(submitButton);
        // Assert that the pattern-related error message is displayed
        expect(screen.getByText(/Requester email must be in the format name@ucsb.edu, e.g. cgaucho@ucsb.edu/)).toBeInTheDocument();
    });

    test("Error message when requesterEmail error is null or undefined", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>
        );
        // Don't change the value of requesterEmailField
        // Fire other events to trigger validation if needed
        // ...
        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        fireEvent.click(submitButton);
        // Assert that the error message is displayed
        expect(screen.getByText(/Requester email must be in the format name@ucsb.edu, e.g. cgaucho@ucsb.edu/)).toBeInTheDocument();
    });
    
    test("Error message when requesterEmail type is not 'pattern'", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>
        );
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        // Change the value to trigger a validation error, but ensure type is not 'pattern'
        fireEvent.change(requesterEmailField, { target: { value: 'invalid_email' } });
        // Fire other events to trigger validation if needed
        // ...
        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        fireEvent.click(submitButton);
        // Assert that the error message is displayed
        expect(screen.getByText(/Requester email must be in the format name@ucsb.edu, e.g. cgaucho@ucsb.edu/)).toBeInTheDocument();
    });    

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester email is required/);
        expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
        expect(screen.getByText(/Table or breakout room is required/)).toBeInTheDocument();
        expect(screen.getByText(/Request time is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Solved is required/)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIDField = screen.getByTestId("HelpRequestForm-teamID");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'kittygrace101@gmail.com' } });
        fireEvent.change(teamIDField, { target: { value: '15' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanationField, { target: { value: 'GitHub pages setup issue' } });
        fireEvent.change(solvedField, { target: { value: 'true' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Team ID is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Table or breakout room is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Request time is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Solved is required/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});