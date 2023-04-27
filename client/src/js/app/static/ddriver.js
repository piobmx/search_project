var USER_ID = 123; // Sample data to use for app-specific data.

var myInterval = null;

function myTimer() {
    // Adds an event listener to form submission (to do the DOM manipulation for the demo page)
    let formElement = document.querySelector("#input-box");
    if (formElement == null) {
        return;
    }
    clearInterval(myInterval);

    formElement.addEventListener("submit", submitForm);

    // LogUI control code
    startLogUIClient();
}

document.addEventListener("DOMContentLoaded", function() {
    myInterval = setInterval(myTimer, 10000);
});

/*
    Handle a fake form submission.
    This simply does some DOM manipulation by creating new elements.
*/
function submitForm(e) {
    e.preventDefault();

    document.querySelector("#submit-button").disabled = true;

    setTimeout(() => {
        let queryString = document.querySelector("#input-box").value;

        if (queryString.length == 0) {
            alert("Please don't submit a blank query!");
            return;
        }

        let queryTextElement = document.querySelector("#query-text");
        queryTextElement.innerHTML = queryString;

        document.querySelector("#left-rail-results").innerHTML = "";
        document.querySelector("#entity-card").style.display = "block";

        //addFakeResults();
        document.querySelector("#submit-button").disabled = false;

        document.querySelector("#landing-instructions").style.display = "none";
        document.querySelector(".results-stats").style.display = "block";
    }, 350);
}

/*
    Adds five fake results to the DOM.
*/
function addFakeResults() {
    let fakeResults = [
    ];

    for (let result of fakeResults) {
        appendFakeResult(result);
    }
}

function appendFakeResult(markupString) {
    let resultsContainer = document.querySelector("#left-rail-results");

    let tempContainer = document.createElement("div");
    tempContainer.innerHTML = markupString.trim();

    resultsContainer.appendChild(tempContainer.firstChild);
}

/*
    A sample function that shows you how to control the LogUI library -- specifically, starting it.
*/
function startLogUIClient() {
    if (window.LogUI) {
        // Here, LogUI is present, so we can attempt to instantiate it.
        let configurationObject = {
            logUIConfiguration: {
                // endpoint: 'ws://linuxvm:8000/ws/endpoint/',
                endpoint: "ws://logui.ewi.tudelft.nl/ws/endpoint/",
                authorisationToken:
                    "eyJ0eXBlIjoibG9nVUktYXV0aG9yaXNhdGlvbi1vYmplY3QiLCJhcHBsaWNhdGlvbklEIjoiYmRlM2Q2ZTgtMTBmZC00ODAyLWFjMGItZWM5OWQxMDM2OTMyIiwiZmxpZ2h0SUQiOiJlZDI5MjRhYS02NGQ5LTQ0OTYtOTkwZS05Y2E0NmJiZmMzNjAifQ:1mmOnX:h0YvXnbihBZNgjxVL4exZnXra9PuvOuvRJp8ALo50Ts",
                verbose: true,
                browserEvents: {
                    blockEventBubbling: true,
                    eventsWhileScrolling: true,
                    URLChanges: true,
                    contextMenu: true,
                    pageFocus: true,
                    trackCursor: true,
                    cursorUpdateFrequency: 4000,
                    cursorLeavingPage: true,
                },
            },
            applicationSpecificData: {
                userID: USER_ID,
            },
            trackingConfiguration: {
                "querybox-focus": {
                    selector: "#input-box",
                    event: "focus",
                    name: "QUERYBOX_FOCUS",
                },
                "querybox-losefocus": {
                    selector: "#input-box",
                    event: "blur",
                    name: "QUERYBOX_BLUR",
                },
                "querybox-change": {
                    selector: "#input-box",
                    event: "keyup",
                    name: "QUERYBOX_CHANGE",
                    metadata: [
                        {
                            nameForLog: "value",
                            sourcer: "elementProperty",
                            lookFor: "value",
                        },
                    ],
                },
                "query-submission": {
                    selector: "#search-form",
                    event: "formSubmission",
                    name: "QUERY_SUBMITTED",
                    properties: {
                        includeValues: [
                            {
                                nameForLog: "completeQuery",
                                sourcer: "elementProperty",
                                selector: "#input-box",
                                lookFor: "value",
                            },
                        ],
                    },
                },
                "left-rail-item-mousemovements": {
                    selector: "#left-rail-results li",
                    event: "mouseHover",
                    properties: {
                        mouseenter: {
                            name: "LEFT_RAIL_RESULT_HOVER_IN",
                        },
                        mouseleave: {
                            name: "LEFT_RAIL_RESULT_HOVER_OUT",
                        },
                    },
                    metadata: [
                        {
                            nameForLog: "resultRank",
                            sourcer: "elementAttribute",
                            lookFor: "data-rank",
                        },
                    ],
                },
                "left-rail-item-mouseclick": {
                    selector: "#left-rail-results li span.title a",
                    event: "contextmenu",
                },
                "entity-mousemovements": {
                    selector: "#entity-card",
                    event: "mouseHover",
                    properties: {
                        mouseenter: {
                            name: "ENTITY_CARD_HOVER_IN",
                        },
                        mouseleave: {
                            name: "ENTITY_CARD_HOVER_OUT",
                        },
                    },
                },
            },
        };
        console.log("inside driver");
        if (window.hasOwnProperty("LogUI")) {
            LogUI.init(configurationObject);
        }
        return;
    }

    throw Error(
        "We can't find the LogUI client library. Did you include the logui.bundle.js file in the static directory?"
    );
}
