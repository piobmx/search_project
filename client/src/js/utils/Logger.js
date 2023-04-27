import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";
import request from "superagent";

export function log(event, meta) {
    const log = {
        event: event || "",
        userId: UserStore.getQualtricsID(),
        // sessionId: AccountStore.getSessionId() || "",
        // task: AccountStore.getTask() || "",
        meta: meta || {},
    };
    sendLog(log);
}

function sendLog(log) {
    // console.log("Sending Logs");
    const send = true;
    if (send) {
        request
            .post(
                `${
                    process.env.REACT_APP_SERVER_URL
                }/v1/users/${AccountStore.getUserId()}/logs`
            )
            .send({
                data: [log],
            })
            // retry sending event 3 times if it fails due to errors that could be network-related
            .retry(3)
            .end((err, res) => {});
    } else {
        return;
    }
}
