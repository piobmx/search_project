import "./SearchHeader.pcss";
// import { Route, Router } from 'react-router-dom'
import React from "react";
// import Helpers from "../../../../utils/Helpers";
import { Button } from "react-bootstrap";
// import { Link } from "react-router-dom";

const AccountInfo = function ({
    userId,
    groupId,
    sessionId,
    username,
    isManager,
    searchTopic,
    searchBias,
	userView,
    QID,
}) {
    return (
        <div className="AccountInfo">
            <p>
                {/* User ID: {userId} */}
                {isManager ? (
                    <Button
                        variant="light"
                        className="resetGroupButton"
                        bssize="xs"
                        href={
                            process.env.REACT_APP_PUBLIC_URL + "/loguiData/!#"
                        }>
                        LogUI
                    </Button>
                ) : (
                    ""
                )}
                {/* Status: {isManager ? "Manager" : "User"} */}
                Qualtrics ResponseID: {QID ? QID : "Qualtrics Response ID not Found."}
                <br />
                User Viewpoint: <b>{userView ? userView: "User Viewpoints Unknown"}</b>
                <br />
                Assigned Topic: <b>{searchTopic ? searchTopic : "Topic not assigned"}</b>
                <br />
                Assigned Bias: <b>{searchBias ? searchBias : "Bias not assigned"}</b>
            </p>
        </div>
    );
};

export default AccountInfo;
