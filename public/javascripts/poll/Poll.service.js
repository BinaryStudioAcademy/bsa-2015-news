var app = require('../app');
app.factory("PollService", PollService);

function PollService() {
    return {
        getQuestionnaire: getQuestionnaire
    };

    function getQuestionnaire() {
        var questionnaire = {
            dispatch: {
                _id: "55d5711c8d01336030c3703a",
                text: "Dear User,<br /><br />I've invited you to provide your feedback about User as part of a 360 degree feedback assessment. We are conducting the assessment online.<br /><br /><br />You can provide your feedback here: link<br /><br /><br />If you have any questions or concerns, please don't hesitate to contact me.<br /><br /><br />Thanks in advance,<br />HR<br />",
                link: "http://localhost:4099/#/shared/questionnaire/",
                templateId: "55c098338590f0743c1c95a4",
                type: "questionnaire",
                sendDate: "20/08/2015",
                isViewed: false,
                isAcceptance: false,
                __v: 0,
                sender: {
                    name: "HR",
                    email: "hr",
                    role: "HR"
                },
                user: {
                    email: "goncharuk.m.n@gmail.com"
                }
            },
            template: {
                _id: "55c098338590f0743c1c95a4",
                date: "04/08/2015",
                userEmail: "hr",
                name: "This is a title",
                __v: 0,
                sections: [{
                    name: "Planning",
                    _id: "55c5b35605f3a7d8543cb45e",
                    questions: [{
                        own: "",
                        name: "Have you ever seen this person communicating the task/problem with his/her team members to ensure understanding and agreement?",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb467",
                        options: [{
                            text: "Yes",
                            _id: "55c5b35605f3a7d8543cb469"
                        }, {
                            text: "No",
                            _id: "55c5b35605f3a7d8543cb468"
                        }]
                    }, {
                        own: "",
                        name: "Breaks down tasks into manageable units",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb462",
                        options: [{
                            text: "Sometimes",
                            _id: "55c5b35605f3a7d8543cb466"
                        }, {
                            text: "Often",
                            _id: "55c5b35605f3a7d8543cb465"
                        }, {
                            text: "Very rarely",
                            _id: "55c5b35605f3a7d8543cb464"
                        }, {
                            text: "Never",
                            _id: "55c5b35605f3a7d8543cb463"
                        }]
                    }, {
                        own: "",
                        name: "Effective at managing their time, taking on an appropriate workload and providing sensible estimates.",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb45f",
                        options: [{
                            text: "Yes",
                            _id: "55c5b35605f3a7d8543cb461"
                        }, {
                            text: "No",
                            _id: "55c5b35605f3a7d8543cb460"
                        }]
                    }]
                }, {
                    name: "Delivering",
                    _id: "55c5b35605f3a7d8543cb45c",
                    questions: [{
                        own: "",
                        name: "Productive both when working alone and in groups?",
                        type: "text",
                        _id: "55c5b35605f3a7d8543cb45d",
                        options: []
                    }]
                }],
                testee: {
                    name: "User",
                    email: "user@mail.com",
                    userId: "558d3689d5d7f18c1185d9a3",
                    role: "User"
                }
            }
        };
        return questionnaire;
    }
}