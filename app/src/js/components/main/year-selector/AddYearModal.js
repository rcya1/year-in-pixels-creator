import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsFillCalendarFill } from 'react-icons/bs';

import 'css/Form.css'

export default class AddColorSchemeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getResetState();

        this.formRef = React.createRef();
    }

    getResetState = () => {
        return {
            validated: false,
            year: "",
            yearAlreadyExists: false
        }
    }

    onChangeYear = async (e) => {
        let year = e.target.value;
        let yearInvalid = await this.props.checkYearExists(year);
        if(year < 1000 || year > 9999) {
            yearInvalid = true;
        }

        this.setState({
            year: year,
            yearInvalid: yearInvalid
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(this.state.yearInvalid) return;

        this.setState({
            validated: true
        });

        if(this.formRef.current.checkValidity() === true) {
            this.props.addYear(this.state.year);
            this.props.closeModal();

            this.setState(this.getResetState());
        }
    }

    render() {
        return (
            <Modal 
                show={this.props.visible} 
                onHide={this.props.closeModal}
                size="md"
            >
                <Modal.Header>
                    <Modal.Title>Add Year</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form noValidate validated={this.state.validated} ref={this.formRef}>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <BsFillCalendarFill></BsFillCalendarFill>
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Year"
                                        type="number"
                                        required
                                        isInvalid={this.state.yearInvalid}
                                        value={this.state.year}
                                        onChange={this.onChangeYear}
                                    />

                                    <FormControl.Feedback type="invalid">
                                        Year already exists / is invalid
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="mr-auto" onClick={this.props.closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
