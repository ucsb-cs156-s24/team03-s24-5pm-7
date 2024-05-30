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
        await screen.findByText(/Team Id/);
        await screen.findByText(/Table or Breakout Room/);
        await screen.findByText(/Request Time \(iso format\)/);
        await screen.findByText(/Explanation/);
        await screen.findByText(/Solved/);
        await screen.findByText(/Create/);

        expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        expect(screen.getByTestId("HelpRequestForm-teamId")).toBeInTheDocument();
        expect(screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom")).toBeInTheDocument();
        expect(screen.getByTestId("HelpRequestForm-requestTime")).toBeInTheDocument();
        expect(screen.getByTestId("HelpRequestForm-explanation")).toBeInTheDocument();
        expect(screen.getByTestId("HelpRequestForm-solved")).toBeInTheDocument();
        
    });


    test("renders correctly when passing in a HelpRequest", async () => {

        render(
            <Router  >
                <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
            </Router>
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/^Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");
        const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(emailField, { target: { value: 'bad-input' } });
        fireEvent.change(requestTimeField, { target: { value: 'bad-input' } });
        console.log("requestTimeField", requestTimeField.value);
        fireEvent.click(submitButton);

        await screen.findByText(/Must be a valid email address/);
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
        expect(screen.getByText(/Team Id is required/)).toBeInTheDocument();
        expect(screen.getByText(/Table or breakout room is required/)).toBeInTheDocument();
        expect(screen.getByText(/Request time is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();

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
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: helpRequestFixtures.oneHelpRequest.requesterEmail } });
        fireEvent.change(teamIdField, { target: { value: helpRequestFixtures.oneHelpRequest.teamId } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: helpRequestFixtures.oneHelpRequest.tableOrBreakoutRoom } });
        fireEvent.change(requestTimeField, { target: { value: helpRequestFixtures.oneHelpRequest.requestTime } });
        fireEvent.change(explanationField, { target: { value: helpRequestFixtures.oneHelpRequest.explanation } });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Must be a valid email address/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Request time must be in ISO format/)).not.toBeInTheDocument();

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