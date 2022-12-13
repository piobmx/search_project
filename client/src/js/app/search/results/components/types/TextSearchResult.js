import React, { Component } from 'react';

////
class TextSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: props.result,
            name: "",
            source: "",
            text: "",
            btnLabel: 'I\'m aware of the risk of confirmation bias, show item.',
            warningMsg: 'This search result might reinforce your opinion, select another search result if you want to minimize the risk of confirmation bias.'
        };
    }

    ////
    render() {
        // if (this.state.result.viewpoint === "-2") {
        if (this.state.result.viewpoint === "-20") {
            return (<div className="preview">
                <div style={{ color: "red" }}>Caution!</div>
                <div style={{ color: "red" }}>{this.state.warningMsg}</div>

                <div className="inner01">{this.state.name}</div>
                <div className="inner02">{this.state.source}</div>
                <div className="inner03">{this.state.text}</div>
                <button className='b01 btnMe' onClick={() => {
                    if (this.state.source === "") {
                        this.state.name = this.state.result.name;
                        this.state.source = this.state.result.source;
                        this.state.text = this.state.result.text;
                    } else {
                        this.state.name = "";
                        this.state.source = "";
                        this.state.text = "";
                    }
                    this.forceUpdate();
                }}>{this.state.btnLabel}</button>
            </div>)
        } else {
            return (<div className="preview">
                {/* <div className="inner01">{this.state.result.name}</div> */}
                <a href={this.state.result.source} target="_blank" rel="noopener noreferrer">
                    <div className="inner01" dangerouslySetInnerHTML={{__html: this.state.result.title}}/>
                </a>
                <div className="inner02">{this.state.result.source}</div>
                {/* <div className="inner03">{this.state.result.text}</div> */}
                <div className="inner03" dangerouslySetInnerHTML={{ __html: this.state.result.text }} />

            </div>)
        }
    }
}

export default TextSearchResult;
