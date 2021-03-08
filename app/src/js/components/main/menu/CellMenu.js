import React from 'react';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

import { inLg } from '../../../util/BootstrapUtils';
import { FULL_MONTH_NAMES } from '../Constants'
import { getOrdinalEnding } from '../../../util/DateUtils';

let selectStyles = require('./SelectStyle').selectStyles;

// TODO Look into: https://stackoverflow.com/questions/8328886/sticky-top-div-with-absolute-positioning
// and other position: sticky things
export default class CellMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            comment: ""
        };

        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value || prevProps.comment !== this.props.comment || 
            prevProps.day !== this.props.day || prevProps.month !== this.props.month) {
                
            this.setState({
                value: this.props.value,
                comment: this.props.comment
            });
        }

        if(inLg()) {
            // TODO Look into IntersectionObserver instead of this
            if(prevProps.xPos !== this.props.xPos || prevProps.yPos !== this.props.yPos) {
                let rect = this.ref.current.getBoundingClientRect();
                this.props.updateMenuOffset(rect.top, rect.bottom);
            }
        }
    }

    onChangeValue = (newValue) => {
        this.setState({
            value: newValue.value
        })
    }

    onChangeComment = (e) => {
        this.setState({
            comment: e.target.value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.closeMenu();
        this.props.updateBoardData(this.props.month, this.props.day, this.state.value, this.state.comment);
    }

    handleClick = (e) => {
        e.stopPropagation();
    }

    render() {
        if(this.props.visible) {
            let title = FULL_MONTH_NAMES[this.props.month] + " " + (this.props.day + 1) + 
                getOrdinalEnding(this.props.day + 1);

            let top = this.props.yPos + document.documentElement.scrollTop;
            let left = this.props.xPos;

            let options = this.props.options.map((option, index) => {
                return {
                    value: index + 1,
                    label: option[3],
                    color: "rgb(" + option[0] + "," + option[1] + "," + option[2] + ")"
                };
            });

            options.unshift({
                value: 0,
                label: "Unselected",
                color: "#FFF"
            });

            let value = this.state.value;
            if(this.state.value > options.length) {
                value = 0;
            }

            let bodyContent = (
                <Form>
                    <Container>
                        <Row className="mb-2">
                            <Col>
                                <Select
                                    value={options[value]}
                                    options={options}
                                    onChange={this.onChangeValue}
                                    styles={selectStyles}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <FormControl
                                    placeholder="Comment"
                                    size="sm"
                                    value={this.state.comment}
                                    onChange={this.onChangeComment}
                                    as="textarea"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="danger" block className="" onClick={this.props.closeMenu}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="primary" block style={{float: "right"}} onClick={this.handleSubmit}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            );

            if(inLg()) {
                return (
                    <div className="menu"
                        style={{
                            position: "absolute",
                            top: top,
                            left: left,
                            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)",
                            whiteSpace: "nowrap",
                            flexWrap: "nowrap"
                        }}
                        ref={this.ref}
                        onClick={this.handleClick}
                    >

                        <Card>
                            <Card.Header className="text-center py-2" as="h4">
                                {title}
                            </Card.Header>
                            <Card.Body>
                                { bodyContent }
                            </Card.Body>
                        </Card>
                    </div>
                )
            }
            else {
                return (
                    <Modal
                        show={this.props.visible} 
                        onHide={this.props.closeMenu}
                        size="md"
                        onClick={this.handleClick}
                    >
                        <Modal.Header>
                            <Modal.Title className="text-center w-100">{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            { bodyContent }
                        </Modal.Body>
                    </Modal>
                )
            }
        }
        else {
            return null;
        }
    }
}