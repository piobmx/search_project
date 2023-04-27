import React, { useState } from "react";
import Popup from "reactjs-popup";
import UserStore from "../stores/UserStore";
import "./Popup.css";

const contentStyle = {
    maxWidth: "500px",
    width: "100%",
};

const ControlledPopup = () => {
    const fromQualtrics = UserStore.fromQualtrics;
    // console.log("fromProlific:", fromProlific);
    let showPopup = false;
    if (!fromQualtrics) {
        showPopup = true;
    } 

    const [open, setOpen] = useState(true);
    // const [open, setOpen] = useState(showPopup);
    const closeModal = () => setOpen(false);

    return (
        <div className="example-warper">
            <Popup
                open={open}
                // trigger={<button className="button"> Show study info </button>}
                modal
                onClose={closeModal}
                contentStyle={contentStyle}
            >
                <div className="modal">
                    {/* <a className="close" onClick={close}>
                        &times;
                    </a> */}
                    <div className="header">
                        {fromQualtrics ? <>Notice</> : <>Attention!</>}
                    </div>
                    <div className="pcontent">
                        {showPopup ? (
                            <p>
                                {" "}
                                We failed to identify your Qualtrics ID, did you
                                access this page via {" "}
                                <a href="https://www.prolific.co/">Prolific</a>?
                            </p>
                        ) : (
                            <div>
                                {" "}
                                Your Qualtrics ID: {UserStore.getQualtricsID()}
                                <br />
                                Title of this Study :
                                <br />
                                <br />
                                <p>
                                    Hi there, welcome! Based on the answers you
                                    provided, we assigned [TOPIC] to you. Please
                                    feel free to make query about this topic as
                                    you would in a general search engine.
                                    <br />
                                    <b style={{ color: "#cc2111" }}>
                                        Please be sure to always include the string [TOPIC] in your query!
                                    </b>
                                </p>
                                <br />
                                <br />
                                <b>Do you want to start this study?</b>
                            </div>
                        )}
                    </div>

                    <div className="actions">
                        {!fromQualtrics ? (
                            <>
                                <a
                                    className="button"
                                    href="https://www.prolific.co"
                                >
                                    Redirect to Prolific
                                </a>
                                <button className="button" onClick={closeModal}>
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    className="button"
                                    href="https://www.prolific.co"
                                    style={{ color: "red" }}
                                >
                                    Reject
                                </a>
                                <button className="button" onClick={closeModal}>
                                    Start User Study
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Popup>
        </div>
    );
};


export default ControlledPopup;
