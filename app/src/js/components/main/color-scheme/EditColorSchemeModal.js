import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import { MdLabel } from "react-icons/md";
import { SketchPicker } from "react-color";

import "css/ColorPicker.css";
import "css/Form.css";

export default class EditColorSchemeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      label: "",
      labelAlreadyExists: false,
      color: "#dddddd",
    };

    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    let curr = this.props.colorScheme;
    let prev = prevProps.colorScheme;

    let diff = false;
    for (let i = 0; i < 4; i++) {
      if (curr[i] !== prev[i]) {
        diff = true;
        break;
      }
    }

    if (diff) {
      this.setState({
        validated: false,
        label: curr[3],
        color:
          "#" +
          curr[0].toString(16) +
          curr[1].toString(16) +
          curr[2].toString(16),
      });
    }
  }

  onChangeLabel = async (e) => {
    let newLabel = e.target.value;

    if (newLabel === this.props.label) {
      this.setState({
        label: newLabel,
        labelAlreadyExists: false,
      });
    } else {
      let labelAlreadyExists = await this.props.checkLabelExists(newLabel);
      this.setState({
        label: newLabel,
        labelAlreadyExists: labelAlreadyExists,
      });
    }
  };

  onChangeColor = (color) => {
    this.setState({
      color: color.hex,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.labelAlreadyExists) return;

    this.setState({
      validated: true,
    });

    if (this.formRef.current.checkValidity() === true) {
      this.props.editColorScheme(
        this.props.colorScheme[3],
        this.state.label,
        this.state.color
      );
      this.props.closeModal();
    }
  };

  render() {
    return (
      <Modal show={this.props.visible} onHide={this.props.closeModal} size="md">
        <Modal.Header>
          <Modal.Title>Edit Color Scheme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form
              noValidate
              validated={this.state.validated}
              ref={this.formRef}
            >
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
                    isInvalid={this.state.labelAlreadyExists}
                    value={this.state.label}
                    onChange={this.onChangeLabel}
                  />

                  <FormControl.Feedback type="invalid">
                    Label already taken / is empty.
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
          <Button
            variant="danger"
            className="mr-auto"
            onClick={this.props.closeModal}
          >
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
