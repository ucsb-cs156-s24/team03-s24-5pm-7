const ucsbRecommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "adilahmed@ucsb.edu",
        "professorEmail": "pconrad@ucsb.edu",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-01-02T13:00:00",
        "done": false
    },
    threeDates: [
        {
            "id": 2,
            "requesterEmail": "adilahmed1@ucsb.edu",
            "professorEmail": "pconrad1@ucsb.edu",
            "dateRequested": "2022-01-02T14:00:00",
            "dateNeeded": "2022-01-02T15:00:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "adilahmed2@ucsb.edu",
            "professorEmail": "pconrad2@ucsb.edu",
            "dateRequested": "2022-01-02T15:00:00",
            "dateNeeded": "2022-01-02T16:00:00",
            "done": true
        },
        {
            "id": 4,
            "requesterEmail": "adilahmed3@ucsb.edu",
            "professorEmail": "pconrad3@ucsb.edu",
            "dateRequested": "2022-01-02T16:00:00",
            "dateNeeded": "2022-01-02T17:00:00",
            "done": false
        }
    ]
};


export { ucsbRecommendationRequestFixtures };