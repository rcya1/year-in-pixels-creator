import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';
import Select from 'react-select'

import SBSView from './sbs/SBSView'
import { SBSConfig, SBSExternalData, SBSControls } from './sbs/SBSControls'

import StackedView from './stacked/StackedView'
import { StackedConfig, StackedExternalData, StackedControls } from './stacked/StackedControls'

const { jsPDF } = require("jspdf");

// TODO Fix the bug where when we first load in, the limits for the sliders aren't calculated until we click
// b/c the state is not updated, so it never rerenders and recomputes. Need to somehow trigger a state
// update (not sure how to force update to fire tho)

const LAYOUT_OPTIONS = Object.freeze({
    SBS: "Side by Side",
    STACKED: "Stacked"
});

const EXPORT_OPTIONS = Object.freeze({
    SVG: "SVG (Best Quality)",
    PNG: "PNG",
    PDF: "PDF"
});

export default class ExportPreview extends React.Component {

    constructor(props) {
        super(props);

        let config = {};
        let data = {};

        config[LAYOUT_OPTIONS.SBS] = new SBSConfig();
        data[LAYOUT_OPTIONS.SBS]   = new SBSExternalData();
        
        config[LAYOUT_OPTIONS.STACKED] = new StackedConfig();
        data[LAYOUT_OPTIONS.STACKED]   = new StackedExternalData();

        this.state = {
            config: config,
            data: data,

            layout: LAYOUT_OPTIONS.SBS,
            fileType: EXPORT_OPTIONS.SVG
        };

        this.viewRefs = {};
        
        for(let layout of Object.values(LAYOUT_OPTIONS)) {
            this.viewRefs[layout] = React.createRef();
        }
    }

    updateConfig = (key, value) => {
        let copy = this.state.config[this.state.layout].clone();
        copy[key] = value;

        let clone = { ...this.state.config };
        clone[this.state.layout] = copy;
        this.setState({
            config: clone
        });
    }

    onChangeLayout = (option) => {
        this.setState({
            layout: option.value
        });
    }

    onChangeFileType = (option) => {
        this.setState({
            fileType: option.value
        });
    }

    exportImage = () => {
        let node = this.viewRefs[this.state.layout].current;

        let loadingMessage = this.props.createLoadingMessage("Generating Image");
        loadingMessage.add();

        switch(this.state.fileType) {
            case EXPORT_OPTIONS.SVG:
                domtoimage.toSvg(node, {filter: (elem) => elem.tagName !== 'i'})
                    .then(function (dataUrl) {
                        dataUrl = dataUrl.replace("data:image/svg+xml;charset=utf-8,", "");
                        let blob = new Blob([dataUrl], {type: "image/svg+xml"});
                        FileSaver.saveAs(blob, "board.json");
                    }).catch(function(error) {
                        console.log(error);
                    }).finally(function() {
                        loadingMessage.remove();
                    });
                break;
            case EXPORT_OPTIONS.PNG:
                domtoimage.toBlob(node).then(function (blob) {
                        window.saveAs(blob, 'board.png');
                    }).catch(function(error) {
                        console.log(error);
                    }).finally(function() {
                        loadingMessage.remove();
                    });
                break;
            case EXPORT_OPTIONS.PDF:
                let rect = node.getBoundingClientRect();
                let padding = 50;

                domtoimage.toPng(node)
                    .then(function (dataUrl) {
                        let doc = new jsPDF({
                            orientation: 'landscape',
                            unit: 'px',
                            format: [rect.width + padding * 2, rect.height + padding * 2],
                            hotfixes: ["px_scaling"]
                        });
                        doc.addImage(dataUrl, 'PNG', padding, padding, rect.width, rect.height);
                        doc.save('board.pdf');
                    }).catch(function(error) {
                        console.log(error);
                    }).finally(function() {
                        loadingMessage.remove();
                    });
                break;
            default:
                break;
        }
    }

    render() {
        let colorSchemeListProps = {
            ...this.props.colorSchemeListProps
        }
        
        colorSchemeListProps.className = "";

        let layoutSelect = (<Select
            value={{
                value: this.state.layout,
                label: this.state.layout
            }}
            onChange={this.onChangeLayout}
            options={Object.values(LAYOUT_OPTIONS).map(x => {
                return {
                    value: x,
                    label: x
                };
            })}
            className="mt-2 mb-3"
            style={{maxWidth: "200px"}}
        />);
        
        let exportSelect = (<Select
            value={{
                value: this.state.fileType,
                label: this.state.fileType
            }}
            onChange={this.onChangeFileType}
            options={Object.values(EXPORT_OPTIONS).map(x => {
                return {
                    value: x,
                    label: x
                };
            })}
            className="mt-3 mb-2"
            style={{maxWidth: "200px"}}
        />);

        let config = this.state.config[this.state.layout];
        let data = this.state.data[this.state.layout];

        let layoutView = null;
        switch(this.state.layout) {
            case LAYOUT_OPTIONS.SBS:
                layoutView = (<SBSView
                    title={this.props.title}
                    board={this.props.board}
                    colorSchemeListProps={colorSchemeListProps}
                    config={config}
                    data={data}
                    ref={this.viewRefs[LAYOUT_OPTIONS.SBS]}
                />);
                break;
            case LAYOUT_OPTIONS.STACKED:
                layoutView = (<StackedView
                    title={this.props.title}
                    board={this.props.board}
                    colorSchemeListProps={colorSchemeListProps}
                    config={config}
                    data={data}
                    ref={this.viewRefs[LAYOUT_OPTIONS.STACKED]}
                />);
                break;
            default:
                break;
        }

        let layoutControls = null;
        switch(this.state.layout) {
            case LAYOUT_OPTIONS.SBS:
                layoutControls = (<SBSControls
                    config={config}
                    updateConfig={this.updateConfig}
                    data={data}
                />);
                break;
            case LAYOUT_OPTIONS.STACKED:
                layoutControls = (<StackedControls
                    config={config}
                    updateConfig={this.updateConfig}
                    data={data}
                />);
                break;
            default:
                break;
        }
        
        return (
            <Container fluid>
                <Row>
                    <Col>
                        {layoutView}
                    </Col>
                    <Col lg={3}>
                        <Card className="mt-5 mr-3 text-center shadow-sm" style={{
                            position: "sticky",
                            top: "40px"
                        }}>
                            <Card.Header>
                                <h3 className="text-center">Configure Image</h3>
                            </Card.Header>
                            <Card.Body>
                                {layoutSelect}
                                <hr/>
                                {layoutControls}
                                <hr/>
                                {exportSelect}
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-around">
                                <Button variant="danger" onClick={this.props.cancel}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.exportImage}>
                                    Export Image
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}