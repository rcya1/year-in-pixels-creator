import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import HTTPRequest from '../util/HTTPRequest';
import withRedirect from '../util/react/WithRedirect';

import '../../css/Navbar.css'

class AppNavbar extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    render() {
        let activeStyle = {
            color: "rgba(255,255,255,.8)"
        };

        let loginButtons = [];
        if(this.props.loggedIn) {
            loginButtons.push((<Button
                    className="navbar-button"
                    key="logout"
                    onClick={async () => { 
                        try {
                            await HTTPRequest.post("logout");
                            this.props.addAlert("info", "Successfully Logged Out", "You are now signed out");
                        }
                        catch(err) {
                            if(err.response !== undefined) {
                                let response = err.response.data;
                                this.props.addAlert("danger", "Unknown Error", response);
                            }
                            else {
                                this.props.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
                            }
                        }
                        this.props.setLoggedIn(false);
                    }}
                >
                    Logout
                </Button>
            ));
        }
        else {
            loginButtons.push((<Button
                    className="navbar-button"
                    key="login"
                    onClick={() => {
                        this.props.setRedirect("/login");
                    }}
                >
                    Login
                </Button>
            ));
            loginButtons.push((<Button
                    className="navbar-button"
                    key="register"
                    onClick={() => { 
                        this.props.setRedirect("/register");
                    }}
                >
                    Register
                </Button>
            ));
        }
    
        return (
            <Navbar bg="dark" variant="dark">
                <NavLink
                    to="/"
                    exact
                    className="navbar-link"
                    id="navbar-brand"
                >
                    Year in Pixels
                </NavLink>
                <Nav className="mr-auto">
                    <NavLink
                        to="/"
                        className="navbar-link"
                        activeStyle={activeStyle}
                        exact
                    >
                        Home
                    </NavLink>
                </Nav>
                <Nav className="ml-auto">
                    { loginButtons }
                </Nav>
            </Navbar>
        );
    }
}

export default withRedirect(AppNavbar);
