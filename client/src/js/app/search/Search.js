import "./Search.pcss";
import React from "react";

import { log } from "../../utils/Logger";
import { LoggerEventTypes } from "../../utils/LoggerEventTypes";
import PropTypes from "prop-types";
import SearchHeaderContainer from "./header/SearchHeaderContainer";
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import NotepadContainer from "./features/notepad/NotepadContainer";
import SearchResultsAggregationContainer from "./results/SearchResultsAggregationContainer";
import Chat from "./features/chat/Chat";
import config from "../../config";
import LoginStore from "../../stores/LoginStore";
import "../static/logui.bundle.js";
import "../static/driver.js";

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isManager: LoginStore.getAuth(),
        };

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    // componentDidMount() {
    // }

    // componentWillUnmount() {
    //     if (this.props.lastSession && config.interface.chat && this.props.collaborative) {
    //         const messages = document.querySelector(".chat-content").innerHTML;
    //         log(LoggerEventTypes.CHAT_ARCHIVE, {
    //             messages: messages
    //         });

    //         const element = document.querySelector("#conversejs");
    //         element.parentElement.removeChild(element);
    //     };
    //     document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    // }

    componentDidMount() {
        LoginStore.on("change", () => {
            this.setState({
                isManager: LoginStore.isManager,
            });
        });
        console.log("Search", this.props);
        // document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    render() {
        console.log("rendering SEARCH2");
        return (
            <div className="Search">
                <SearchHeaderContainer
                    timer={this.props.timer}
                    statusbar={this.props.statusbar}
                    showAccountInfo={this.props.showAccountInfo}
                    isManager={this.state.isManager}
                />

                <div className="Content">
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer />
                        </div>
                    </div>

                    <div className="Side">
                        <SearchResultsAggregationContainer />
                        <QueryHistoryContainer
                            collaborative={this.props.collaborative}
                        />
                        {/* <NotepadContainer /> */}
                        {/* <BookmarkContainer collaborative={this.props.collaborative}/> */}
                    </div>

                    {/* {this.props.taskDescription && (
                        <div className="Side">
                            {this.props.taskDescription}
                        </div>
                    )} */}
                </div>
                <div className="text-center">
                    <p className="Footer">
                        About{" "}
                        <a href="/about" target="_blank">
                            SearchX
                        </a>
                        .
                    </p>
                </div>

                {/* <script src="../static/logui.bundle.js"></script> */}
                {/* <script src="../static/driver.js"></script> */}
            </div>
        );
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.props.onSwitchPage();
        }
    }
}
Search.propTypes = {
    onSwitchPage: PropTypes.func,
};

Search.defaultProps = {
    collaborative: true,
    showAccountInfo: true,
    firstSession: true,
    lastSession: true,
    onSwitchPage: () => {},
};

export default Search;
