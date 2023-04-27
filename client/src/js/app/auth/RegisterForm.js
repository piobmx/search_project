import React from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButtion";
import LoginStore from "../../stores/LoginStore";
import UserStore from "../../stores/UserStore";
import AccountStore from "../../stores/AccountStore";

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            passwordConfirm: "",
            isManager: LoginStore.getAuth(),
            buttonDisabled: false,
            error_msg: "",
            userID: AccountStore.getUserId(),
            sessionID: AccountStore.getSessionId(),
        };
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 12) {
            return;
        }
        this.setState({
            [property]: val,
        });
    }

    resetForm() {
        this.setState({
            username: "",
            password: "",
            passwordConfirm: "",
            buttonDisabled: false,
        });
    }

    async doRegister() {
        console.log("Registering");
        if (!this.state.username) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        try {
            let res = await fetch(process.env.REACT_APP_SERVER_URL + "/v1/register", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    passwordConfirm: this.state.passwordConfirm,
                    isManager: LoginStore.isManager,
                    userID: this.state.userID,
                    sessionID: this.state.sessionID,
                }),
            });

            let result = await res.json();
            console.log("result:", result);

            if (result && result.success) {
                // UserStore.isLoggedIn = true;
                UserStore.setIsLoggedIn(true);
                this.forceUpdate();
                // go to login page
                this.props.history.push("/");
            } else if (result && result.success === false) {
                this.resetForm();
                // show error msg
                this.setState({
                    error_msg: result["message"],
                });
            }
        } catch (e) {
            console.log("register error:", e);
            this.resetForm();
        }

        this.setState({
            buttonDisabled: true,
        });
        console.log("buttonDisabled:", this.state.buttonDisabled);
    }

    render() {
        return (
            <div className="loginForm">
                <div className="loginTitle">SEPP Register</div>
                <InputField
                    type="text"
                    placeholder="Username"
                    value={this.state.username ? this.state.username : ""}
                    onChange={(val) => this.setInputValue("username", val)}
                />

                <InputField
                    type="password"
                    placeholder="Password"
                    value={this.state.password ? this.state.password : ""}
                    onChange={(val) => this.setInputValue("password", val)}
                />

                <InputField
                    type="password"
                    placeholder="Password comfirm"
                    value={
                        this.state.passwordConfirm
                            ? this.state.passwordConfirm
                            : ""
                    }
                    onChange={(val) =>
                        this.setInputValue("passwordConfirm", val)
                    }
                />

                <SubmitButton
                    text={"Register"}
                    // disabled={this.state.buttonDisabled}
                    onClick={() => this.doRegister()}
                />
                <br />
                <label className="msg">{this.state.error_msg}</label>
            </div>
        );
    }
}

export default RegisterForm;
