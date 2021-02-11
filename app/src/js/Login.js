import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import HTTPRequest from './util/HTTPRequest';
import withRedirect from './util/react/WithRedirect';

import '../css/Form.css';

class CreateUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            validated: false
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        let form = e.currentTarget;

        this.setState({
            validated: true
        });

        if(form.checkValidity() === true) {
            const body = {
                username: this.state.username,
                password: this.state.password,
            };

            try {
                let res = await HTTPRequest.post("login", body);
                console.log(res.data);
                this.props.setLoggedIn(true);
                this.props.setRedirect("/");
                this.props.retrieveData();

                this.props.addAlert("info", "Successfully Logged In", "You are now signed in.");
            }
            catch(err) {
                if(err.response !== undefined) {
                    let response = err.response.data;
                    if(response.includes("IncorrectPasswordError")) {
                        this.props.addAlert("danger", "Incorrect Password", "The password you entered is not correct.");
                    }
                    else if(response.includes("IncorrectUsernameError")) {
                        this.props.addAlert("danger", "Unknown User", "That user does not exist.");
                    }
                    else {
                        this.props.addAlert("danger", "Unknown Error", response);
                    }
                }
                else {
                    this.props.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue");
                }
            }
        }
    }

    render() {
        return (
            <Container className="mt-3 form">
                <Card className="bg-light">
                    <Card.Header>
                        <h3 className="text-center">Login</h3>
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
                                        Please enter your password.
                                    </FormControl.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <br></br>
                            <Button variant="primary" type="submit" block>
                                Submit
                            </Button>
                        </Form>

                        <p className="mt-3 text-center">Don't have an account? <Link to="/register">Register</Link> </p>            
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default withRedirect(CreateUser);
