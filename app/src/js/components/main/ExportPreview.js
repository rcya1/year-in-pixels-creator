/* TODO
We can add sliders on the right for the padding between the columns and the position of the colors block
We also need to fix the centering of the title. It should be centered over the board, and should not include the labels
 */

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class ExportPreview extends React.Component {

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col className="text-center">
                        <div style={{float: "right"}}>
                            { this.props.title }
                            { this.props.board }
                        </div>
                    </Col>
                    <Col className="text-center">
                        <div style={{marginTop: "30%", float: "left"}}>
                            { this.props.colorSchemeList }
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}