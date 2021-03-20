import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FaGithub } from 'react-icons/fa'

import withRedirect from 'js/util/react/WithRedirect';

import 'css/Navbar.css'

class AppNavbar extends React.Component {

    render() {
        let activeStyle = {
            color: "rgba(255,255,255)"
        };

        let loginArea = [];
        if(this.props.loggedIn) {
            loginArea.push((<Button
                    className="navbar-button"
                    key="account"
                    onClick={() => {
                        this.props.setRedirect("/settings");
                    }}
                >
                {this.props.username}
            </Button>));
            loginArea.push((<Button
                    className="navbar-button"
                    key="logout"
                    onClick={() => {
                        this.props.logout();
                    }}
                >
                    Logout
                </Button>
            ));
        }
        else {
            loginArea.push((<Button
                    className="navbar-button"
                    key="login"
                    onClick={() => {
                        this.props.setRedirect("/login");
                    }}
                >
                    Login
                </Button>
            ));
            loginArea.push((<Button
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
                <Nav className="">
                    <NavLink
                        to="/"
                        className="navbar-link"
                        activeStyle={activeStyle}
                        exact
                    >
                        Home
                    </NavLink>
                </Nav>
                <Nav>
                    <NavLink
                        to="/about"
                        className="navbar-link"
                        activeStyle={activeStyle}
                        exact
                    >
                        About
                    </NavLink>
                </Nav>
                <Nav>
                    <NavLink
                        to="/privacypolicy"
                        className="navbar-link"
                        activeStyle={activeStyle}
                        exact
                    >
                        Privacy Policy
                    </NavLink>
                </Nav>
                <Nav className="mr-auto">
                    <a
                        href="https://github.com/Ryan10145/year-in-pixels-creator"
                        className="navbar-link"
                        target="_blank"
                        rel="noreferrer"
                        exact
                    >
                        <FaGithub style={{marginBottom: ".15rem"}}/> GitHub
                    </a>
                </Nav>
                <Nav className="ml-auto">
                    { loginArea }
                </Nav>
            </Navbar>
        );
    }
}

export default withRedirect(AppNavbar);
