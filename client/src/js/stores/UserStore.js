import { extendObservable } from "mobx";

// console.log("------ userStore ");
class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            isLoggedIn: false,
            fromQualtrics: false,
            QID: undefined,
            username: "",
            topic: "",

            getIsLoggedIn() {
                return this.isLoggedIn;
            },
            getUsername: function() {
                return this.username;
            },
            setFromQualtics(newBool) {
                this.fromQualtrics = newBool;
            },
            setQualtricsID(QID) {
                this.QID = QID;
                localStorage.setItem("qid", QID);
                window.sharedVariable = QID
                console.log('set', window.sharedVariable);
            },
            getQualtricsID(){
                return this.QID;
            },
            setLoading(newBool) {
                this.loading = newBool;
            },
            setIsLoggedIn(newBool) {
                this.isLoggedIn = newBool;
            },
            setUsername(newUserName) {
                this.username = newUserName;
                localStorage.setItem("username", newUserName);
            },
        });
    }
}

export default new UserStore();
