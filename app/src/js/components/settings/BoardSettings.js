import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Select from 'react-select'

import { InvalidCellsDisplayType, BoardDisplayType } from 'js/util/SettingsUtils';

export default class BoardSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showTodayMarker: this.props.boardSettings.showTodayMarker,
            invalidCellsDisplayType: this.props.boardSettings.invalidCellsDisplayType,
            boardDisplayType: this.props.boardSettings.boardDisplayType,
            showDayNumber: this.props.boardSettings.showDayNumber
        };
    }

    onChangeShowTodayMarker = (e) => {
        this.setState({
            showTodayMarker: !this.state.showTodayMarker
        });
    }

    onChangeInvalidCellsDisplayType = (option) => {
        this.setState({
            invalidCellsDisplayType: option.value
        });
    }

    onChangeBoardDisplayType = (option) => {
        this.setState({
            boardDisplayType: option.value
        });
    }

    onChangeShowDayNumber = (e) => {
        this.setState({
            showDayNumber: !this.state.showDayNumber
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.updateBoardSettings(this.state);
    }

    render() {
        let boardDisplayOptions = Object.values(BoardDisplayType).map((value) => {
            return {
                value: value,
                label: value
            };
        });
        
        let invalidCellsOptions = Object.values(InvalidCellsDisplayType).map((value) => {
            return {
                value: value,
                label: value,
            };
        });

        return (
            <Card className="bg-light">
                <Card.Header>
                    <h3 className="text-center">Board Settings</h3>
                </Card.Header>
                <Card.Body className="w-100 mx-auto">
                    <Container className="w-100 mw-100">
                        <Row className="equal">
                            <Col md={6}>
                                <Row className="w-75 mx-auto">
                                    <Col lg={6} className="d-flex px-0 mb-1">
                                        <p className="my-auto">Board Display Type: </p>
                                    </Col>
                                    <Col lg={6} className="px-0">
                                        <Select
                                            value={{value: this.state.boardDisplayType, 
                                                    label: this.state.boardDisplayType}}
                                            options={boardDisplayOptions}
                                            onChange={this.onChangeBoardDisplayType}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="switch"
                                    id="show-current-day-switch"
                                    label="Show Current Day Marker"
                                    checked={this.state.showTodayMarker}
                                    onChange={this.onChangeShowTodayMarker}
                                    className="w-75 mx-auto"
                                />
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <Col md={6}>
                                <Row className="w-75 mx-auto">
                                    <Col lg={6} className="d-flex px-0 mb-1">
                                        <p className="my-auto">Show Invalid Cells: </p>
                                    </Col>
                                    <Col lg={6} className="px-0">
                                        <Select
                                            value={{value: this.state.invalidCellsDisplayType, 
                                                    label: this.state.invalidCellsDisplayType}}
                                            options={invalidCellsOptions}
                                            onChange={this.onChangeInvalidCellsDisplayType}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="switch"
                                    id="show-day-number-switch"
                                    label="Show Day Number"
                                    checked={this.state.showDayNumber}
                                    onChange={this.onChangeShowDayNumber}
                                    className="w-75 mx-auto"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Button 
                                variant="primary"
                                onClick={this.handleSubmit}
                                className="mx-auto mt-3"
                            >
                                Update Board Settings
                            </Button>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }
}
