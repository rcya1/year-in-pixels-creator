import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink, Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import HTTPRequest from './util/HTTPRequest';

import '../css/Navbar.css'

class AppNavbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
        }
    }

    componentDidUpdate() {
        if(this.state.redirect != null) {
            this.setState({
                redirect: null
            });
        }
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

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
                            let res = await HTTPRequest.post("logout");
                            console.log(res.data);
                        }
                        catch(err) {
                            console.log(err);
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
                        this.setState({
                            redirect: "/login"
                        });
                    }}
                >
                    Login
                </Button>
            ));
            loginButtons.push((<Button
                    className="navbar-button"
                    key="register"
                    onClick={() => { 
                        this.setState({
                            redirect: "/register"
                        });
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

export default AppNavbar;
