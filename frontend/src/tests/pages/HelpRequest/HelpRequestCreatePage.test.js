import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";

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

    const axiosMock = new AxiosMockAdapter(axios);

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
        const helpRequestResponse = helpRequestFixtures.oneHelpRequest;
        const helpRequestInput = {
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamId": "s24-4pm-3",
            "tableOrBreakoutRoom": "table 3",
            "requestTime": "2024-05-07T22:51",
            "explanation": "I lost my glasses",
            "solved": false
        }

        axiosMock.onPost("/api/helprequests/post").reply( 202, helpRequestResponse );

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

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");

        fireEvent.change(requesterEmailField, { target: { value: helpRequestInput.requesterEmail } });
        fireEvent.change(teamIdField, { target: { value: helpRequestInput.teamId } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: helpRequestInput.tableOrBreakoutRoom } });
        fireEvent.change(requestTimeField, { target: { value: helpRequestInput.requestTime } });
        fireEvent.change(explanationField, { target: { value: helpRequestInput.explanation } });
        fireEvent.change(solvedField, { target: { value: helpRequestInput.solved } });

        const submitButton = screen.getByTestId("HelpRequestForm-submit");
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));


        expect(axiosMock.history.post[0].params).toEqual(helpRequestInput);

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});