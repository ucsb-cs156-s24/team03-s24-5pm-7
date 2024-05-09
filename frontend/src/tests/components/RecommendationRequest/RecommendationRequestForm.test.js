import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("UCSBRecommendationRequest tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Professor Email/);
        await screen.findByText(/Explanation/);
        await screen.findByText(/Date Requested/);
        await screen.findByText(/Date Needed/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a UCSBRecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: '' } });
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email must be a correct email for use./);
        await screen.findByText(/Professor Email must be a valid email./);
        await screen.findByText(/Explanation is required./);
        await screen.findByText(/Date Requested is required for submission./);
        await screen.findByText(/Date Needed is required for submission./);
        await screen.findByText(/Requester Email must be a correct email for use./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Professor Email is required./);
        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested is required for submission./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed is required for submission./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-professorEmail");

        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const DateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const DateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(professorEmailField, { target: { value: 'pconrad@ucsb.edu' } });
        fireEvent.change(requesterEmailField, { target: { value: 'adil@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'please' } });
        fireEvent.change(DateRequestedField, { target: { value: '2022-01-01T11:00' } });
        fireEvent.change(DateNeededField, { target: { value: '2022-01-01T13:00' } });
        fireEvent.click(doneField, { target: { value: 'false' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester Email must be a correct email for use./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor Email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Requested is required in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Needed is required in ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/done must be a boolean./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


