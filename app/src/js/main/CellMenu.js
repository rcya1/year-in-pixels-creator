import React from 'react';
import Select from 'react-select'
import chroma from 'chroma-js';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import BootstrapUtils from '../BootstrapUtils';

import Constants from './Constants'
import DateUtils from './DateUtils';

import '../../css/CellMenu.css';
import Col from 'react-bootstrap/esm/Col';

// TODO Add it so that if you click off the cell menu while it is active, then it will close the menu
// Maybe when the main receives a click event, check to see if it originated from cell menu? not sure if that will work
export default class CellMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            comment: ""
        };

        this.ref = React.createRef();

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value || prevProps.comment !== this.props.comment || 
            prevProps.day !== this.props.day || prevProps.month !== this.props.month) {
                
            this.setState({
                value: this.props.value,
                comment: this.props.comment
            });
        }

        if(BootstrapUtils.inLg()) {
            // TODO Look into IntersectionObserver instead of this
            if(prevProps.xPos !== this.props.xPos || prevProps.yPos !== this.props.yPos) {
                let rect = this.ref.current.getBoundingClientRect();
                this.props.updateMenuOffset(rect.top, rect.bottom);
            }
        }
    }

    onChangeValue(newValue) {
        this.setState({
            value: newValue.value
        })
    }

    onChangeComment(e) {
        this.setState({
            comment: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.props.handleMenuClose();
        this.props.handleMenuSubmit(this.props.month, this.props.day, this.state.value, this.state.comment);
    }

    render() {
        if(this.props.visible) {
            let title = Constants.fullMonthNames[this.props.month] + " " + (this.props.day + 1) + 
                DateUtils.getOrdinalEnding(this.props.day + 1);

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

            const dot = (color = '#ccc') => {
                if(chroma(color).css() !== chroma("#FFF").css()) return {
                    alignItems: 'center',
                    display: 'flex',
                
                    ':before': {
                        backgroundColor: color,
                        border: '1px solid rgba(80, 80, 80, 10)',
                        borderRadius: 10,
                        content: '" "',
                        display: 'block',
                        marginRight: 8,
                        height: 10,
                        width: 10,
                    },
                }
                return null;    
            };
              
            const colourStyles = {
                control: styles => ({ 
                    ...styles,
                    backgroundColor: 'white',
                    fontSize: '.875rem'
                }),
                option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                    const color = chroma(data.color);
                    let backgroundColor = chroma('#FFF').css();
                    if(color.css() === chroma('#FFF').css()) {
                        if(isFocused) {
                            backgroundColor = chroma('#DDD').css();
                        }
                    }
                    else {
                        if(isSelected) {
                            backgroundColor = color.css();
                        }
                        else if(isFocused) {
                            backgroundColor = color.alpha(0.6).css();
                        }
                    }
                    return {
                        ...styles,
                        ...dot(data.color),
                        backgroundColor: backgroundColor,
                        color: 'black',
                        fontSize: '.875rem',
                
                        ':active': {
                            ...styles[':active'],
                            backgroundColor: isSelected ? data.color : color.alpha(0.3).css(),
                        },
                    };
                },
                input: styles => ({ ...styles, ...dot('#FFF') }),
                placeholder: styles => ({ ...styles, ...dot('#FFF ') }),
                singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
            };

            let bodyContent = (
                <Form>
                    <Container>
                        <Row className="mb-2">
                            <Col>
                                <Select
                                    value={options[this.state.value]}
                                    options={options}
                                    onChange={this.onChangeValue}
                                    styles={colourStyles}
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
                                <Button variant="danger" block className="" onClick={this.props.handleMenuClose}>
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

            if(BootstrapUtils.inLg()) {
                return (
                    <div className="menu"
                        style={{
                            top: top,
                            left: left
                        }}
                        ref={this.ref}
                    >

                        <Card>
                            <Card.Header className="menu-title py-2" as="h4">
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
                        onHide={this.props.handleMenuClose}
                        size="md"
                    >
                        <Modal.Header>
                            <Modal.Title className="menu-title w-100">{title}</Modal.Title>
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