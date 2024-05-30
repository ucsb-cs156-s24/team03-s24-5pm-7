const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "gracefeng@ucsb.edu",
        "teamId": "s24-4pm-3",
        "tableOrBreakoutRoom": "table 3",
        "requestTime": "2024-05-07T22:51:00",
        "explanation": "I lost my glasses",
        "solved": false
    },
    threeHelpRequests: [
        {
            "id": 1,
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamId": "s24-4pm-3",
            "tableOrBreakoutRoom": "table 3",
            "requestTime": "2024-05-07T22:51:00",
            "explanation": "I lost my glasses",
            "solved": false
        },
        {
            "id": 2,
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamId": "s24-4pm-3",
            "tableOrBreakoutRoom": "table 3",
            "requestTime": "2024-04-07T22:51:00",
            "explanation": "I found my glasses",
            "solved": true
        },
        {
            "id": 3,
            "requesterEmail": "pconrad@ucsb.edu",
            "teamId": "s24-4pm-4",
            "tableOrBreakoutRoom": "breakout room 4",
            "requestTime": "2024-07-07T22:51:00",
            "explanation": "How to exit vim",
            "solved": false
        }
    ]
}

export { helpRequestFixtures };