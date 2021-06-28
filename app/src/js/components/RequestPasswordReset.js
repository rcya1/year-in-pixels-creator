import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaUser } from 'react-icons/fa';

import withRedirect from 'js/util/react/WithRedirect';

import 'css/Form.css';

class RequestPasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            validated: false
        }
    }

    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let form = e.currentTarget;

        this.setState({
            validated: true
        });

        if(form.checkValidity() === true) {
            let success = await this.props.requestPasswordReset(this.state.username);
            if(success) this.props.setRedirect("/");
        }
    }

    render() {
        return (
            <Container className="mt-3 form">
                <Card className="bg-light">
                    <Card.Header>
                        <h3 className="text-center">Request Password Reset</h3>
                    </Card.Header>
                    <Card.Body className="form-body mx-auto">
                        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <FaUser></FaUser>
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Username"
                                        type="text"
                                        required
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                    />

                                    <FormControl.Feedback type="invalid">
                                        Please enter your username.
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <br></br>
                            <Button variant="primary" type="submit" block>
                                Request Password Reset
                            </Button>
                        </Form>          
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default withRedirect(RequestPasswordReset);
