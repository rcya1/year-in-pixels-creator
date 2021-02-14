import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export let OverrideOption = Object.freeze({
    REPLACE_CURRENT: "REPLACE_CURRENT",
    REPLACE_ONLINE: "REPLACE_ONLINE",
    
    MERGE_CURRENT: "MERGE_CURRENT",
    MERGE_ONLINE: "MERGE_ONLINE"
});

export class OverrideDataPrompt extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <Modal 
                show={this.props.visible} 
                backdrop="static"
                size="md"
            >
                <Modal.Header>
                    <Modal.Title className="w-100 text-center">Override Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Header as="h5" className="text-center">
                            Replace Data
                        </Card.Header>
                        <Card.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <Button
                                            className="mx-auto d-block"
                                            onClick={
                                                () => {
                                                    this.props.handleSubmit(OverrideOption.REPLACE_CURRENT);
                                                }
                                            }
                                        >
                                            Use Current Data
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            className="mx-auto d-block"
                                            onClick={
                                                () => {
                                                    this.props.handleSubmit(OverrideOption.REPLACE_ONLINE);
                                                }
                                            }
                                        >
                                            Use Online Data
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                    <hr></hr>
                    <Card>
                        <Card.Header as="h5" className="text-center">
                            Merge Data
                        </Card.Header>
                        <Card.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <Button
                                            className="mx-auto d-block"
                                            onClick={
                                                () => {
                                                    this.props.handleSubmit(OverrideOption.MERGE_CURRENT);
                                                }
                                            }
                                        >
                                            Prioritize Current Data
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            className="mx-auto d-block"
                                            onClick={
                                                () => {
                                                    this.props.handleSubmit(OverrideOption.MERGE_ONLINE);
                                                }
                                            }
                                        >
                                            Prioritize Online Data
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}