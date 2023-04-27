import React, { Component } from "react";
// import { broadcastSearchState } from '../../../../../../../../server/app/api/controllers/socket/feature';
import UserStore from "../../../../../stores/UserStore";
import { log } from "../../../../../utils/Logger";
import { LoggerEventTypes } from "../../../../../utils/LoggerEventTypes";
////
class TextSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: props.result,
            name: "",
            source: "",
            text: "",
            btnLabel: "I'm aware of the risk of confirmation bias, show item.",
            warningMsg:
                "This search result might reinforce your opinion, select another search result if you want to minimize the risk of confirmation bias.",
        };
        this.metaInfo = {
            url: props.result.source,
            stance: props.result.prediction,
            index: props.index,
            page: props.searchState.page,
            query: props.searchState.query,
            vertical: props.searchState.vertical,
            topic: props.searchState.topic,
            viewpoint: props.searchState.viewpoint,
            biasType: props.searchState.biasType,
            qid: UserStore.getQualtricsID(),
            // query: broadcastSearchState.query
        };
        this.clickUrl = this.clickUrl.bind(this);
    }

    componentDidMount() {
        // console.log('METAS:', this.metaInfo);
        // console.log('PROPS:', this.props);
    }

    rightClickUrl = (event) => {
        event.preventDefault();
        const { target } = event;
        console.log("target.tagName", target);
        if (target.tagName === "A") {
            console.log("Hello world");
        }
        // console.log("right clicked");
        // log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, this.metaInfo);
    };

    mouseDownHandler = (event) => {
        if (event.button === 1) {
            console.log("midclick");
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, {
                mouse: "mid",
                ...this.metaInfo,
            });
        }
        if (event.button === 2) {
            this.metaInfo["mouse"] = "right";
            log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, {
                mouse: "right",
                ...this.metaInfo,
            });
        }
    };

    clickUrl = (e) => {
        console.log("clickE", e);

        // var doctext = this.state.result.text.split('\n').map((item, key) => {
        //     return <span key={key}>{item}<br/></span>
        // })
        // doctext.unshift(<h4> {this.state.result.source} <br/></h4>);
        // doctext.unshift(<h3> {this.state.result.name} <br/></h3>);
        // this.props.urlClickHandler(this.state.result.id, doctext);
        log(LoggerEventTypes.SEARCHRESULT_CLICK_URL, this.metaInfo);
    };

    viewUrl = (isVisible) => {
        this.metaInfo.isVisible = isVisible;
        log(LoggerEventTypes.SEARCHRESULT_VIEW_URL, this.metaInfo);
    };

    contextUrl = () => {
        log(LoggerEventTypes.SEARCHRESULT_CONTEXT_URL, this.metaInfo);
    };

    hoverEnterSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERENTER, this.metaInfo);
    };

    hoverLeaveSummary = () => {
        log(LoggerEventTypes.SEARCHRESULT_HOVERLEAVE, this.metaInfo);
    };

    ////
    render() {
        let text =
            this.state.result.text
                .slice(0, 500)
                .split(" ")
                .slice(0, 80)
                .join(" ") + "...";
        const stanceClassName = {
            "0": "againstItem",
            "1": "neutralItem",
            "2": "favorItem",
        };
        const stanceClass = stanceClassName[this.props.result.prediction];
        const className = `preview ${stanceClass}`;

        // if (this.state.result.viewpoint === "-2") {
        // console.log("THIS RESULT:", this.state.result)
        return (
            <div className={className}>
                <div className="inner02">{this.state.result.source}</div>
                <a
                    href={this.state.result.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.clickUrl}
                    // onContextMenu={this.rightClickUrl}
                    onMouseDown={this.mouseDownHandler}
                >
                    <div
                        className="inner01"
                        dangerouslySetInnerHTML={{
                            __html: this.state.result.title,
                        }}
                    />
                </a>
                {/* <div className="inner03">{this.state.result.text}</div> */}
                <div
                    className="inner03"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </div>
        );
    }
}

export default TextSearchResult;
