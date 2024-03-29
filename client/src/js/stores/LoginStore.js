import { EventEmitter } from "events";
import request from "superagent";
import AccountStore from "./AccountStore";
const CHANGE_EVENT = "change";

class LoginStore extends EventEmitter {
    constructor() {
        super();
        this.isManager = false;
    }

    getAuth() {
        // console.log("getting Auths");
        request
            .get(
                process.env.REACT_APP_SERVER_URL +
                    "/v1/login/text" +
                    "?userId=" +
                    AccountStore.getUserId() +
                    "&sessionId=" +
                    AccountStore.getSessionId()
            )
            .end((err, res) => {
                // console.log("getAuth result:", err, res);
                if (err || !res.body || res.body.error) {
                    // console.log("Auth Err", err);
                    this.isManager = false;
                } else {
                    this.isManager = res.body.auth;
                }

                this.emit(CHANGE_EVENT);
            });
    }
}

const loginStore = new LoginStore();
window.loginStore = loginStore;
export default loginStore;
