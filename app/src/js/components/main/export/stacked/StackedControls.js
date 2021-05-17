import React from "react"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactBootstrapSlider from 'react-bootstrap-slider'

export class StackedConfig {
    constructor() {
        this.colorsTopMargin = 40;
        this.colorsWidth = 50;
    }

    clone = () => {
        let config = new StackedConfig();
        config.colorsTopMargin = this.colorsTopMargin;
        config.colorsWidth = this.colorsWidth;
        return config;
    }
}

export class StackedExternalData {
    constructor() {
        
    }
}

export class StackedControls extends React.Component {
    
    changeColorSchemeTopMargin = (e) => {
        this.props.updateConfig("colorsTopMargin", e.target.value);
    }
    
    changeColorSchemeWidth = (e) => {
        this.props.updateConfig("colorsWidth", e.target.value);
    }

    render() {
        let maxTopMargin = 250;

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
                    Colors Width (%)
                </Form.Label>
                <InputGroup className="justify-content-center mt-3">
                    <ReactBootstrapSlider
                        value={this.props.config.colorsWidth}
                        change={this.changeColorSchemeWidth}
                        step={1}
                        max={100}
                        min={5}
                    />
                </InputGroup>
            </Form.Group>
        </React.Fragment>
    }
}
