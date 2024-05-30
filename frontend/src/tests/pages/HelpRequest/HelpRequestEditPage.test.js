import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequestForm-requesterEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
                "id": 17,
                "requesterEmail": "gracefeng@ucsb.edu",
                "teamId": "s24-4pm-3",
                "tableOrBreakoutRoom": "table 3",
                "requestTime": "2024-05-07T22:51",
                "explanation": "Dokku deployment issues",
                "solved": false
            });
            axiosMock.onPut('/api/helprequests').reply(200, {
                "id": 17,
                "requesterEmail": "gracefeng@ucsb.edu",
                "teamId": "s24-4pm-4",
                "tableOrBreakoutRoom": "table 4",
                "requestTime": "2024-05-07T22:52",
                "explanation": "Dokku deployment issues",
                "solved": true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");

            expect(requesterEmailField).toHaveValue("gracefeng@ucsb.edu")
            expect(teamIdField).toHaveValue("s24-4pm-3")
            expect(tableOrBreakoutRoomField).toHaveValue("table 3")
            expect(requestTimeField).toHaveValue("2024-05-07T22:51")
            expect(explanationField).toHaveValue("Dokku deployment issues")
            expect(solvedField).not.toBeChecked();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requesterEmail");

            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");

            expect(requesterEmailField).toHaveValue("gracefeng@ucsb.edu")
            expect(teamIdField).toHaveValue("s24-4pm-3")
            expect(tableOrBreakoutRoomField).toHaveValue("table 3")
            expect(requestTimeField).toHaveValue("2024-05-07T22:51")
            expect(explanationField).toHaveValue("Dokku deployment issues")
            expect(solvedField).not.toBeChecked();

            const submitButton = screen.getByTestId("HelpRequestForm-submit");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'gracefeng@ucsb.edu' } });
            fireEvent.change(teamIdField, { target: { value: 's24-4pm-4' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: 'table 4' } });
            fireEvent.change(requestTimeField, { target: { value: '2024-05-07T22:52' } });
            fireEvent.change(explanationField, { target: { value: 'Dokku deployment issues' } });
            fireEvent.click(solvedField);

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                "requesterEmail": "gracefeng@ucsb.edu",
                "teamId": "s24-4pm-4",
                "tableOrBreakoutRoom": "table 4",
                "requestTime": "2024-05-07T22:52",
                "explanation": "Dokku deployment issues",
                "solved": true
            })); // posted object

        });
    });
});
