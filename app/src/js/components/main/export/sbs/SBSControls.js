import React from "react"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactBootstrapSlider from 'react-bootstrap-slider'

export class SBSConfig {
    constructor() {
        this.colorsTopMargin = 100;
        this.colorsLeftMargin = 0;
        this.colorsWidth = 100;
        this.boardPercentage = 50;
    }

    clone = () => {
        let config = new SBSConfig();
        config.colorsTopMargin = this.colorsTopMargin;
        config.colorsLeftMargin = this.colorsLeftMargin;
        config.colorsWidth = this.colorsWidth;
        config.boardPercentage = this.boardPercentage;
        return config;
    }
}

export class SBSExternalData {
    constructor() {
        this.colorsRef = React.createRef();
        this.colRef = React.createRef();
    }
}

export class SBSControls extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            forceUpdate: 0
        };
    }

    // force a rerender to get the sliders aligned (super dirty hack)
    componentDidMount = () => {
        this.setState({
            forceUpdate: this.state.forceUpdate + 1
        });
    }
    
    changeColorSchemeTopMargin = (e) => {
        this.props.updateConfig("colorsTopMargin", e.target.value);
    }
    
    changeGutterWidth = (e) => {
        this.props.updateConfig("colorsLeftMargin", e.target.value);
    }
    
    changeColorSchemeWidth = (e) => {
        this.props.updateConfig("colorsWidth", e.target.value);
    }
    
    changeBoardPercentage = (e) => {
        this.props.updateConfig("boardPercentage", e.target.value);
    }

    render() {
        let maxGutterWidth = 250;
        let maxTopMargin = 250;
        let maxWidth = 100;

        if(this.props.data.colorsRef.current != null && this.props.data.colRef.current != null) {
            let colorRect = this.props.data.colorsRef.current.getBoundingClientRect();
            let colRect = this.props.data.colRef.current.getBoundingClientRect();
            maxGutterWidth = Math.floor(colRect.width - colorRect.width - 50);
            maxTopMargin = Math.floor(colRect.height - colorRect.height - 20);
            maxWidth = Math.floor((colRect.width - this.props.config.colorsLeftMargin) * 100.0 / colRect.width);
        }

        return <React.Fragment>
            <Form.Group>
                <Form.Label as="h5">
                    Colors Top Margin (px)
                </Form.Label>
                <InputGroup className="justify-content-center mt-3">
                    <ReactBootstrapSlider
                        value={this.props.config.colorsTopMargin}
                        change={this.changeColorSchemeTopMargin}
                        step={1}
                        max={maxTopMargin}
                        min={0}
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label as="h5">
                    Colors Left Margin (px)
                </Form.Label>
                <InputGroup className="justify-content-center mt-3">
                    <ReactBootstrapSlider
                        value={this.props.config.colorsLeftMargin}
                        change={this.changeGutterWidth}
                        step={1}
                        max={maxGutterWidth}
                        min={0}
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label as="h5">
                    Colors Width (%)
                </Form.Label>
                <InputGroup className="justify-content-center mt-3">
                    <ReactBootstrapSlider
                        value={this.props.config.colorsWidth}
                        change={this.changeColorSchemeWidth}
                        step={1}
                        max={maxWidth}
                        min={5}
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label as="h5">
                    Board Width (%)
                </Form.Label>
                <InputGroup className="justify-content-center mt-3">
                    <ReactBootstrapSlider
                        value={this.props.config.boardPercentage}
                        change={this.changeBoardPercentage}
                        step={1}
                        max={75}
                        min={25}
                    />
                </InputGroup>
            </Form.Group>
        </React.Fragment>
    }
}