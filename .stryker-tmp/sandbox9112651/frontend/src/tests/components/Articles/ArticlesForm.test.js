import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("AticlesForm tests", () => {
    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByText(/Title/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a Articles", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-url");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const dateField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(urlField, { target: { value: 'bad-input' } });
        fireEvent.change(emailField, { target: { value: 'bad-input' } });
        fireEvent.change(dateField, { target: { value: '2022' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/Url must be in the correct format/);
        expect(screen.getByText(/Url must be in the correct format/)).toBeInTheDocument();
        expect(screen.getByText(/Email must be in the correct format/)).toBeInTheDocument();

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/Url is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");

        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const exField = screen.getByTestId("ArticlesForm-explanation");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const dateField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(titleField, { target: { value: 'a new title' } });
        fireEvent.change(urlField, { target: { value: 'https://anewwebadd.com' } });
        fireEvent.change(exField, { target: { value: 'a new explanation' } });
        fireEvent.change(dateField, { target: { value: '2022-03-21T12:00:00' } });
        fireEvent.change(emailField, { target: { value: 'anewemail@gmail.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Url must be in the correct format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email must be in the correct format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateAdded must be in the correct format/)).not.toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});

