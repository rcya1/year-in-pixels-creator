import React from "react"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactBootstrapSlider from 'react-bootstrap-slider'

export class SBSConfig {
    constructor() {
        this.colorsTopMargin = 100;
        this.colorsLeftMargin = 0;
    }

    clone = () => {
        let config = new SBSConfig();
        config.colorsTopMargin = this.colorsTopMargin;
        config.colorsLeftMargin = this.colorsLeftMargin;
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
    
    changeColorSchemeTopMargin = (e) => {
        this.props.updateConfig("colorsTopMargin", e.target.value);
    }
    
    changeGutterWidth = (e) => {
        this.props.updateConfig("colorsLeftMargin", e.target.value);
    }

    render() {
        let maxGutterWidth = 250;
        let maxTopMargin = 250;

        if(this.props.data.colorsRef.current != null && this.props.data.colRef.current != null) {
            let colorRect = this.props.data.colorsRef.current.getBoundingClientRect();
            let colRect = this.props.data.colRef.current.getBoundingClientRect();
            maxGutterWidth = colRect.width - colorRect.width - 50;
            maxTopMargin = colRect.height - colorRect.height - 20;
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
        </React.Fragment>
    }
}