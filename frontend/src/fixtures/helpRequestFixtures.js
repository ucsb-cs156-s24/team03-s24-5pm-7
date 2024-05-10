const helpRequestFixtures = {
    oneHelpRequest: {
        "id": "1",
        "requesterEmail": "gracefeng@ucsb.edu",
        "teamID": "15",
        "tableOrBreakoutRoom": "7",
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "Dokku deployment issues.",
        "solved": true
    },
    threeHelpRequests: [
        {
            "id": "1",
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamID": "15",
            "tableOrBreakoutRoom": "7",
            "requestTime": "2022-01-02T12:00:00",
            "explanation": "Dokku deployment issues.",
            "solved": "true"
        },
        {
            "id": "2",
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamID": "16",
            "tableOrBreakoutRoom": "8",
            "requestTime": "2022-04-03T12:00:00",
            "explanation": "Dokku deployment issues.",
            "solved": "true"
        },
        {
            "id": "3",
            "requesterEmail": "gracefeng@ucsb.edu",
            "teamID": "17",
            "tableOrBreakoutRoom": "9",
            "requestTime": "2022-07-04T12:00:00",
            "explanation": "Dokku deployment issues.",
            "solved": "false"
        },
    ]
};


export { helpRequestFixtures };