import "./Search.pcss";
import React from "react";

// import { log } from "../../utils/Logger";
// import { LoggerEventTypes } from "../../utils/LoggerEventTypes";
import PropTypes from "prop-types";
import SearchHeaderContainer from "./header/SearchHeaderContainer";
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
// import BookmarkContainer from "./features/bookmark/BookmarkContainer";
// import NotepadContainer from "./features/notepad/NotepadContainer";
import SearchResultsAggregationContainer from "./results/SearchResultsAggregationContainer";
// import Chat from "./features/chat/Chat";
// import config from "../../config";
// import LoginStore from "../../stores/LoginStore";
import SearchStore from "./SearchStore";

class Search extends React.Component {
    constructor(props) {
        super(props);
        // console.log("propos", props);
        this.state = {
            // isManager: LoginStore.getAuth(),
            isManager: false,
            searchTopic: SearchStore.getTopic(),
            searchBias: SearchStore.getBias(),
            userView: SearchStore.getUserView(),
        };
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.src = "./static/llogui.bundle.js";
        script.async = true;
        document.body.appendChild(script);

        window.addEventListener("beforeunload", (ev) => 
        {  
            ev.preventDefault();
            return ev.returnValue = 'Are you sure you want to close this survey?';
        });
        // LoginStore.on("change", () => {
        //     this.setState({
        //         isManager: LoginStore.isManager,
        //     });
        // });
        // SearchStore.addChangeListener(this._onChangeTopic);
        // console.log("Search", this.props);
        // document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    _onChangeTopic(event) {
        const topic = event.target.value;
        this.setState({
            searchTopic: topic,
        });
        // console.log("new topic to be set: ", topic);
        SearchStore.setTopic(topic, true);
    }

    _onChangeBias(event) {
        const bias = event.target.value;
        this.setState({
            searchBias: bias,
        });
        // console.log("new bias set:", bias);
        SearchStore.setBias(bias, true);
    }

    _onChangeView(event) {
        const view = event.target.value;
        this.setState({
            userView: view,
        });
        SearchStore.setUserView(view, true);
    }

    render() {
        // console.log("rendering SEARCH without 2");
        return (
            <div className="Search">
                <SearchHeaderContainer
                    timer={this.props.timer}
                    statusbar={this.props.statusbar}
                    showAccountInfo={this.props.showAccountInfo}
                    isManager={this.state.isManager}
                    showSearchHints={true}
                />

                {process.env.DISPLAY === "development" ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "right",
                            padding: "5px 30px 0px ",
                        }}
                    >
                        (For testing) Please select a viewpoint:
                        <select
                            id="biasSelect"
                            onChange={this._onChangeView.bind(this)}
                        >
                            <option key="n" value="na">
                                None
                            </option>
                            <option key="b1" value="vp0">
                                Strongly Against {this.state.searchTopic}
                            </option>
                            <option key="b2" value="vp2">
                                Strongly Favor {this.state.searchTopic}
                            </option>
                        </select>
                    </div>
                ) : null}

                {process.env.DISPLAY === "development" ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "right",
                            padding: "5px 30px 0px ",
                        }}
                    >
                        (For testing) Please select a bias condition:
                        <select
                            id="biasSelect"
                            onChange={this._onChangeBias.bind(this)}
                        >
                            <option key="n" value="na">
                                None
                            </option>
                            <option key="b1" value="balanced">
                                Balanced
                            </option>
                            <option key="b2" value="biased">
                                Biased
                            </option>
                        </select>
                    </div>
                ) : null}
                {process.env.DISPLAY === "development" ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "right",
                            alignItems: "right",
                            padding: "5px 30px 0px ",
                        }}
                    >
                        (For testing) Please select a topic:
                        <select
                            id="topicSelect"
                            onChange={this._onChangeTopic.bind(this)}
                        >
                            <option key="n" value="na">
                                None
                            </option>
                            <option key="a1" value="ath">
                                Atheism
                            </option>
                            <option
                                key="i2"
                                value="ipr"
                            >
                                Intellectial Property Right
                            </option>
                            <option key="s3" value="su">
                                School Uniform
                            </option>
                        </select>
                    </div>
                ) : null}

                <div className="Content">
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer />
                        </div>
                    </div>

                    <div className="Side">
                        <SearchResultsAggregationContainer />
                        {process.env.DISPLAY === "development" ? (
                            <QueryHistoryContainer
                                collaborative={this.props.collaborative}
                            />
                        ) : (
                            <></>
                        )}
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
                        About {/* <a href="/about" target="_blank"> */}
                        SEPP.
                    </p>
                </div>
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
    showAccountInfo: process.env.DISPLAY === "development" ? true : false,
    firstSession: true,
    lastSession: true,
    onSwitchPage: () => {},
};

export default Search;
