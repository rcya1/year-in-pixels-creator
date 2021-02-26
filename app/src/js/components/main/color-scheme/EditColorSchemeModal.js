import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { MdLabel } from 'react-icons/md';
import { SketchPicker } from 'react-color';

import '../../../../css/ColorPicker.css'
import '../../../../css/Form.css'

// TODO Determine good character max on label / way to display it if it goes over
// TODO Maybe see if it goes over and then do ...
export default class EditColorSchemeModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            validated: false,
            label: "",
            color: "#dddddd"
        };

        this.formRef = React.createRef();

        this.onChangeLabel = this.onChangeLabel.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        let curr = this.props.colorScheme;
        let prev = prevProps.colorScheme;

        let diff = false;
        for(let i = 0; i < 4; i++) {
            if(curr[i] !== prev[i]) {
                diff = true;
                break;
            }
        }

        if(diff) {
            this.setState({
                validated: false,
                label: curr[3],
                color: "#" + curr[0].toString(16) + 
                    curr[1].toString(16) + 
                    curr[2].toString(16)
            });
        }
    }

    onChangeLabel(e) {
        this.setState({
            label: e.target.value
        });
    }

    onChangeColor(color) {
        this.setState({
            color: color.hex
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            validated: true
        });

        if(this.formRef.current.checkValidity() === true) {
            this.props.handleSubmit(this.props.colorScheme[3], this.state.label, this.state.color);
            this.props.handleClose();
        }
    }

    render() {
        return (
            <Modal 
                show={this.props.visible} 
                onHide={this.props.handleClose}
                backdrop="static"
                size="md"
            >
                <Modal.Header>
                    <Modal.Title>Edit Color Scheme</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form noValidate validated={this.state.validated} ref={this.formRef}>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <MdLabel></MdLabel>
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Label"
                                        type="text"
                                        required
                                        value={this.state.label}
                                        onChange={this.onChangeLabel}
                                    />

                                    <FormControl.Feedback type="invalid">
                                        Please enter a label.
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                        <Row>
                            <SketchPicker
                                className="mx-auto"
                                color={this.state.color}
                                onChange={this.onChangeColor}
                                disableAlpha={true}
                            />
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="mr-auto" onClick={this.props.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
