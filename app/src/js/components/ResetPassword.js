import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaLock } from 'react-icons/fa';

import withRedirect from 'js/util/react/WithRedirect';

import 'css/Form.css';

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
            validated: false
        }
    }

    onChangePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    onChangeConfirmPassword = (e) => {
        this.setState({
            confirmPassword: e.target.value
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let form = e.currentTarget;
        
        if(this.state.password !== this.state.confirmPassword) {
            return;
        }

        this.setState({
            validated: true
        });

        let username = this.props.match.params.username;
        let token = this.props.match.params.token;

        if(form.checkValidity() === true) {
            let success = await this.props.resetPassword(username, token, this.state.password);
            if(success) this.props.setRedirect("/");
        }
    }

    render() {
        return (
            <Container className="mt-3 form">
                <Card className="bg-light">
                    <Card.Header>
                        <h3 className="text-center">Reset Password</h3>
                    </Card.Header>
                    <Card.Body className="form-body mx-auto">
                        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <FaLock></FaLock>
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Password"
                                        type="password"
                                        required
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                    />

                                    <FormControl.Feedback type="invalid">
                                        Please choose a password.
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <FaLock></FaLock>
                                        </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Confirm Password"
                                        type="password"
                                        required
                                        isInvalid={this.state.password !== this.state.confirmPassword}
                                        value={this.state.confirmPassword}
                                        onChange={this.onChangeConfirmPassword}
                                    />

                                    <FormControl.Feedback type="invalid">
                                        Passwords not entered / do not match.
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <br></br>
                            <Button variant="primary" type="submit" block>
                                Change Password
                            </Button>
                        </Form>          
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default withRedirect(ResetPassword);
