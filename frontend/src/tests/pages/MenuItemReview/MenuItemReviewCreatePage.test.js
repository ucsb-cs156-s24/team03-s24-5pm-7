import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {

        const queryClient = new QueryClient();
        const review = {
            id: 3,
            itemId: "37",
            reviewerEmail: "koraykondakci@ucsb.edu",
            stars: "4",
            dateReviewed: "2024-05-08T20:15",
            comments: "pretty good"
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply(202, review);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '37' } })
        fireEvent.change(reviewerEmailField, { target: { value: 'koraykondakci@ucsb.edu' } })
        fireEvent.change(starsField, { target: { value: '4' } })
        fireEvent.change(dateReviewedField, { target: { value: '2024-05-08T20:15' } })
        fireEvent.change(commentsField, { target: { value: 'pretty good' } })

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            "itemId": "37",
            "reviewerEmail": "koraykondakci@ucsb.edu",
            "stars": "4",
            "dateReviewed": "2024-05-08T20:15",
            "comments": "pretty good"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New review Created - id: 3 itemId: 37");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

    });

});


