import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();
    test("Renders with Create Button for admin user", async () => {
        // arrange
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Create MenuItemReview/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create MenuItemReview/);
        expect(button).toHaveAttribute("href", "/menuitemreviews/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("does not render Create Button for non-admin user", async () => {
        setupUserOnly();  
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => {
            expect(screen.queryByText(/Create MenuItemReview/)).not.toBeInTheDocument();
        });
    });

    test("renders three menu item reviews correctly for regular user", async () => {
        
        // arrange
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, menuItemReviewFixtures.threeMenuItemReviews);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        const createRestaurantButton = screen.queryByText("Create Restaurant");
        expect(createRestaurantButton).not.toBeInTheDocument();

        const itemId = screen.getByText("29");
        expect(itemId).toBeInTheDocument();

        const reviewerEmail = screen.getByText("koraykondakci@ucsb.edu");
        expect(reviewerEmail).toBeInTheDocument();

        const stars = screen.getByText("5");
        expect(stars).toBeInTheDocument();

        const dateReviewed = screen.getByText("2023-04-20T10:00:00");
        expect(dateReviewed).toBeInTheDocument();

        const comments = screen.getByText("best veggie pizza ever");
        expect(comments).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("RestaurantTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("RestaurantTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();

    });

    test("renders empty table when backend unavailable, user only", async () => {
        // arrange
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreviews/all").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/menuitemreviews/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        
        axiosMock.onGet("/api/menuitemreviews/all").reply(200, menuItemReviewFixtures.threeMenuItemReviews);
        axiosMock.onDelete("/api/menuitemreviews").reply(200, "MenuItemReview with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("MenuItemReview with id 1 was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreviews");
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreviews");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

    });
    

});


