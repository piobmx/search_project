import React, { Component } from "react";

const stanceValue = {
    0: "Against",
    1: "Neutral",
    2: "Favor",
};
class TextSaliencySearchResult extends Component {
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
        const text = this.state.result.text;
        console.log("this result rendered", text);
        const clearText = text.replace(/(<([^>]+)>)/gi, "");

        await fetch(`http://localhost:4999/svm/${clearText}`, {
            method: "GET",
        })
            .then((res) => {
                let result = res.json();
                return result;
                // console.log("stance:", res[''])
            })
            .then((result) => {
                console.log(result);
                const predictedStance = result.predicted_stance;
                const saliencies = result.saliency;
                let textResult = this.state.result.text;
                for (const feature of saliencies) {
                    const word = feature[0];
                    const contribution = feature[1];

                    let color = Number(
                        parseInt(255 * contribution, 10)
                    ).toString(16);
                    if (contribution >= 0) {
                        color = Number(
                            parseInt(255 * contribution, 10)
                        ).toString(16);
                    } else {
                        color = Number(
                            // constrast colors
                            // parseInt(255 + 255 * contribution, 10)
                            // ignore nagetive or positive contribution
                            parseInt(255 * contribution, 10)
                        ).toString(16);
                    }

                    const taggedWord = `<i style="
                        background-color:#${color}eeaa;
                        color: #111222"
                      >${word}</i>`;
                    textResult = textResult.replace(word, taggedWord);
                }

                console.log(textResult);
                this.setState({
                    result: {
                        ...this.state.result,
                        text: textResult,
                    },
                    predictionLoaded: true,
                    predictedStance: predictedStance,
                    salientWords: saliencies,
                });
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
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
                {/* <div className={saliencyMapStyles.stanceValue}>
                    <b>
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
        fontWeight: "bold",
        color: "#123",
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

export default TextSaliencySearchResult;
