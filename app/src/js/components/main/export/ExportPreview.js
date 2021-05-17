import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import domtoimage from 'dom-to-image';
import Select from 'react-select'

import SBSView from './sbs/SBSView'
import { SBSConfig, SBSExternalData, SBSControls } from './sbs/SBSControls'

// TODO Add the stacked layout
// TODO Add PDF support

// TODO Fix the bug where when elements such as width are updated or when we first load in,
// the sliders values are not correct
// I think the above is b/c the state is not updated, so it never rerenders and recomputes. Need to somehow trigger a state
// update (probably attach a couple of event handlers and move the calculation logic?)

const EXPORT_OPTIONS = Object.freeze({
    PNG: "PNG",
    PDF: "PDF"
});

export default class ExportPreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: new SBSConfig(),
            data: new SBSExternalData(),

            fileType: EXPORT_OPTIONS.PNG
        };

        this.sbsRef = React.createRef();
    }

    updateConfig = (key, value) => {
        let copy = this.state.config.clone();
        copy[key] = value;
        this.setState({
            config: copy
        });
    }

    onChangeFileType = (option) => {
        this.setState({
            fileType: option.value
        });
    }

    exportImage = async () => {
        let node = this.sbsRef.current;

        let loadingMessage = this.props.createLoadingMessage("Generating Image");
        loadingMessage.add();

        switch(this.state.fileType) {
            case EXPORT_OPTIONS.PNG:
                domtoimage.toBlob(node)
                    .then(function (blob) {
                        window.saveAs(blob, 'board.png');
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                    .finally(function() {
                        loadingMessage.remove();
                    });
                break;
            case EXPORT_OPTIONS.PDF:

                break;
        }
    }

    render() {
        let colorSchemeListProps = {
            ...this.props.colorSchemeListProps
        }
        
        colorSchemeListProps.className = "";
        
        let select = (<Select
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
            style={{maxWidth: "250px"}}
        />);
        
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <SBSView
                            title={this.props.title}
                            board={this.props.board}
                            colorSchemeListProps={colorSchemeListProps}
                            config={this.state.config}
                            data={this.state.data}
                            ref={this.sbsRef}
                        />
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
                                <SBSControls
                                    config={this.state.config}
                                    updateConfig={this.updateConfig}
                                    data={this.state.data}
                                />
                                {select}
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