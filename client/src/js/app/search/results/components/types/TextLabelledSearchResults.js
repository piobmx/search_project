import React, { Component } from "react";

const stanceValue = {
    0: "Against",
    1: "Neutral",
    2: "Favor",
};

const stanceColors = {
    0: "#ac1111",
    1: "#444444",
    2: "#22ac22",
}
class TextLabelledSearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: props.result,
            name: "",
            source: "",
            text: "",
            predictionLoaded: false,
            showSaliencyInformation: false,
            offline: true,
        };
    }

    addSaliency(text) {
        if (!this.state.salientWords) {
            return;
        }
        for (const word of this.state.salientWords) {
            console.log("word:", word);
        }
    }

    async componentDidMount() {
        if (this.state.offline) {
            this.setState({
                result: {
                    ...this.state.result,
                },
                predictionLoaded: true,
                predictedStance: this.state.result.prediction,
                // salientWords: saliencies,
            });
            return;
        }
    }

    handleSalientMapInfoToggle = () =>
        this.setState({
            showSaliencyInformation: !this.state.showSaliencyInformation,
        });

    render() {
        return (
            <div className="preview">
                <div
                    className="inner01"
                    dangerouslySetInnerHTML={{
                        __html: this.state.result.title,
                    }}
                />
                <div className="inner02">{this.state.result.source}</div>
                {/* <div className="prediction" style={saliencyMapStyles.stanceValue}>
                    <b style={{ color: stanceColors[this.state.predictedStance] }}>
                        {this.state.predictionLoaded
                            ? "Stance Prediction: " +
                              stanceValue[this.state.predictedStance] +
                              " (Score: " +
                              this.state.predictedStance +
                              ")"
                            : "Predicting Stance..."}
                    </b>
                </div> */}
                {/* <div className="inner03">{this.state.result.text}</div> */}
                <div
                    className="inner03"
                    onMouseEnter={this.handleSalientMapInfoToggle}
                    onMouseLeave={this.handleSalientMapInfoToggle}
                    dangerouslySetInnerHTML={{
                        __html: this.state.result.text,
                    }}
                />
            </div>
        );
    }
}

const saliencyMapStyles = {
    stanceValue: {
        fontWeight: "regular",
        // color: "#123",
    },
    Favor: {
        color: "#333",
    },
    Neutral: {
        color: "#fea",
    },
    Against: {
        color: "#e27",
    },
};

export default TextLabelledSearchResults;
