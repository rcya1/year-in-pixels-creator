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

        let title = (
            <NavLink
                to="/"
                exact
                className="navbar-link mr-auto"
                id="navbar-brand"
                eventKey="1"
            >
                Year in Pixels
            </NavLink>
        );

        let primaryContent = (
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="">
                    <NavLink
                        to="/"
                        className="navbar-link"
                        activeStyle={activeStyle}
                        exact
                        eventKey="2"
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
                        eventKey="3"
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
                        eventKey="4"
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
                        eventKey="5"
                    >
                        <FaGithub style={{marginBottom: ".15rem"}}/> GitHub
                    </a>
                </Nav>
            </Navbar.Collapse>
        );

        let loginArea = [];
        if(this.props.loggedIn) {
            loginArea.push((<Button
                    className="navbar-button"
                    key="account"
                    onClick={() => {
                        this.props.setRedirect("/settings");
                    }}
                    eventKey="10"
                >
                {this.props.username}
            </Button>));
            loginArea.push((<Button
                    className="navbar-button"
                    key="logout"
                    onClick={() => {
                        this.props.logout();
                    }}
                    eventKey="11"
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
                    eventKey="12"
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

        let navbar = [];

        if(this.props.inLg) {
            navbar.push(title);
            navbar.push(primaryContent);
            navbar.push(<Nav className="ml-auto">{loginArea}</Nav>);
        }
        else {
            navbar.push(<Navbar.Toggle className="mr-2" aria-controls="basic-navbar-nav" />);
            navbar.push(title);
            navbar.push(primaryContent);
            navbar.push(<Nav className="ml-auto" style={{flexDirection: "row"}}>{loginArea}</Nav>);
        }
    
        return (
            <Navbar collapseOnSelect id="navbar" expand="lg" bg="dark" variant="dark">
                {navbar}
            </Navbar>
        );
    }
}

export default withRedirect(AppNavbar);
