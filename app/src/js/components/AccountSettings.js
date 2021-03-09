import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaUser, FaLock } from 'react-icons/fa';

import withRedirect from 'js/util/react/WithRedirect';

class AccountSettings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            username: this.props.username,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            updateFormValidated: false,
            changePasswordFormValidated: false,
            usernameTaken: false
        };
    }

    componentDidUpdate(prevProps) {
        if(!this.props.loggedIn) {
            this.props.setRedirect("/");
            return;
        }
        
        if(this.props.name !== prevProps.name || this.props.username !== prevProps.username) {
            this.setState({
                name: this.props.name,
                username: this.props.username,
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
                updateFormValidated: false,
                changePasswordFormValidated: false,
                usernameTaken: false
            });
        }
    }

    onChangeName = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    onChangeUsername = async (e) => {
        this.setState({
            username: e.target.value
        });

        let username = e.target.value;
        if(username !== "" && username !== this.props.username) {
            let usernameAvailable = await this.props.checkUsernameAvailable(username);
            this.setState({
                usernameTaken: !usernameAvailable
            });
        }
    }

    onChangePassword = (e) => {
        this.setState({
            currentPassword: e.target.value
        });
    }

    onChangeNewPassword = (e) => {
        this.setState({
            newPassword: e.target.value
        });
    }

    onChangeConfirmNewPassword = (e) => {
        this.setState({
            confirmNewPassword: e.target.value
        });
    }

    handleUpdateSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let form = e.currentTarget;

        if(this.state.usernameTaken) {
            return;
        }

        this.setState({
            updateFormValidated: true
        });

        if(form.checkValidity() === true) {
            this.props.updateAccountInfo(this.state.name, this.state.username);
        }
    }

    handlePasswordSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let form = e.currentTarget;

        if(this.state.currentPassword === this.state.newPassword || this.state.newPassword !== this.state.confirmNewPassword) {
            return;
        }

        this.setState({
            changePasswordFormValidated: true
        });

        if(form.checkValidity() === true) {
            this.props.changePassword(this.state.currentPassword, this.state.newPassword);
        }
    }

    render() {
        return (<Container className="mt-3 form">
            <Card className="bg-light">
                <Card.Header>
                    <h3 className="text-center">Account Settings</h3>
                </Card.Header>
                <Card.Body className="w-100 mx-auto">
                    <Container className="w-100 mw-100">
                        <Row className="equal">
                            <Col>
                                <Form noValidate
                                    validated={this.state.updateFormValidated} 
                                    onSubmit={this.handleUpdateSubmit}
                                    className="w-75 mx-auto d-flex flex-column h-100"
                                >
                                    <Form.Group>
                                        <Form.Label as="h5">
                                            First Name
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>
                                                    <FaUser></FaUser>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="First Name"
                                                type="text"
                                                value={this.state.name}
                                                onChange={this.onChangeName}
                                            />
                                        </InputGroup>
                                        <small className="form-text text-muted">You may leave this blank.</small>
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Form.Label as="h5">
                                            Username
                                        </Form.Label>
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
                                                isInvalid={this.state.usernameTaken}
                                                value={this.state.username}
                                                onChange={this.onChangeUsername}
                                            />

                                            <FormControl.Feedback type="invalid">
                                                Username already taken / is empty.
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <br></br>
                                    <Button 
                                        variant="primary"
                                        type="submit"
                                        block
                                        className="mt-auto"
                                    >
                                        Update Account Settings
                                    </Button>
                                </Form>
                            </Col>
                            <Col>
                                <Form 
                                    noValidate
                                    validated={this.state.changePasswordFormValidated}
                                    onSubmit={this.handlePasswordSubmit}
                                    className="w-75 mx-auto d-flex flex-column h-100"
                                >
                                    <Form.Label as="h5">
                                        Change Password
                                    </Form.Label>

                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>
                                                    <FaLock></FaLock>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="Current Password"
                                                type="password"
                                                required
                                                value={this.state.password}
                                                onChange={this.onChangePassword}
                                            />

                                            <FormControl.Feedback type="invalid">
                                                Please enter the current password
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    
                                    <Form.Group className="mt-3">
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>
                                                    <FaLock></FaLock>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                placeholder="New Password"
                                                type="password"
                                                required
                                                isInvalid={this.state.newPassword === this.state.password}
                                                value={this.state.newPassword}
                                                onChange={this.onChangeNewPassword}
                                            />

                                            <FormControl.Feedback type="invalid">
                                                New password must differ from current password
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
                                                placeholder="Confirm New Password"
                                                type="password"
                                                required
                                                isInvalid={this.state.newPassword !== this.state.confirmNewPassword}
                                                value={this.state.confirmNewPassword}
                                                onChange={this.onChangeConfirmNewPassword}
                                            />

                                            <FormControl.Feedback type="invalid">
                                                Passwords not entered / do not match
                                            </FormControl.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <br></br>
                                    <Button 
                                        variant="danger"
                                        type="submit"
                                        block
                                        className="mt-auto"
                                    >
                                        Change Password
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Container>

                    <br></br>
                    
                </Card.Body>
            </Card>
        </Container>);
    }
}

export default withRedirect(AccountSettings);
