import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 4,
            requesterEmail: "gracefeng@ucsb.edu",
            teamId: "15",
            tableOrBreakoutRoom: "7",
            requestTime: "2022-02-02T00:00",
            explanation: "Dokku deployment issue.",
            solved: "true"
        };

        axiosMock.onPost("/api/helprequest/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("UCSBDateForm-requesterEmail");
        const teamIdField = screen.getByTestId("UCSBDateForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("UCSBDateForm-tableOrBreakoutRoomField");
        const requestTimeField = screen.getByTestId("UCSBDateForm-requestTime");
        const explanationField = screen.getByTestId("UCSBDateForm-explanation");
        const solvedField = screen.getByTestId("UCSBDateForm-solved");
        const submitButton = screen.getByTestId("UCSBDateForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'gracefeng@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: '15' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(explanationField, { target: { value: 'Dokku deployment issues.' } });
        fireEvent.change(solvedField, { target: { value: 'true' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail": "gracefeng@ucsb.edu",
                "teamId": "15",
                "tableOrBreakoutRoom": "7",
                "requestTime": "2022-02-02T00:00",
                "explanation": "Dokku deployment issues.",
                "solved": "true"
        });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 4 teamId: 15");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});