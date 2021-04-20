import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import SBSView from './sbs/SBSView'
import { SBSConfig, SBSExternalData, SBSControls } from './sbs/SBSControls'

export default class ExportPreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            config: new SBSConfig(),
            data: new SBSExternalData()
        };
    }

    updateConfig = (key, value) => {
        let copy = this.state.config.clone();
        copy[key] = value;
        this.setState({
            config: copy
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
                    <SBSView
                        title={this.props.title}
                        board={this.props.board}
                        colorSchemeListProps={colorSchemeListProps}
                        config={this.state.config}
                        data={this.state.data}
                    />
                    <Col>
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
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}