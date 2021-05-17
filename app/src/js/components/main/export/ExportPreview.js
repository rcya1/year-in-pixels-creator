import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import domtoimage from 'dom-to-image';

import SBSView from './sbs/SBSView'
import { SBSConfig, SBSExternalData, SBSControls } from './sbs/SBSControls'

// TODO Add the stacked layout
// TODO Add ability to select image type
// TODO Add loading indicator to exporting image

// TODO Fix the bug where when elements such as width are updated or when we first load in,
// the sliders values are not correct
// I think the above is b/c the state is not updated, so it never rerenders and recomputes. Need to somehow trigger a state
// update (probably attach a couple of event handlers and move the calculation logic?)

export default class ExportPreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: new SBSConfig(),
            data: new SBSExternalData()
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

    exportImage = async () => {
        let node = this.sbsRef.current;

        domtoimage.toBlob(node).then(function (blob) {
            window.saveAs(blob, 'my-node.png');
        });
    }

    render() {
        let colorSchemeListProps = {
            ...this.props.colorSchemeListProps
        }
        
        colorSchemeListProps.className = "";
        
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