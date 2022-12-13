import "./SearchHeader.pcss";
import { Route, Router } from 'react-router-dom'
import React from "react";
import Helpers from "../../../../utils/Helpers";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AccountInfo = function ({
    userId,
    groupId,
    sessionId,
    username,
    isManager,
}) {
    console.log("ACCOUNTINFO:", username);
    return (
        <div className="AccountInfo">
            <p>
                User ID: {userId}
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
                <br />
                Status: {isManager ? "Manager" : "User"}
                <br />
                Session ID: {sessionId ? sessionId : "Session ID Not Found."}
                <br />
                Username: {username ? username : "User not log in" }
            </p>
        </div>
    );
};

export default AccountInfo;
