import AppNavbar from './AppNavbar'
import Main from './main/Main'
import Register from './Register'
import Login from './Login'

import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false
        }

        this.setLoggedIn = this.setLoggedIn.bind(this);
    }

    setLoggedIn(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        });
    }
    
    render() {
        return (
            <Router>
                <AppNavbar
                    loggedIn={this.state.loggedIn}
                    setLoggedIn={this.setLoggedIn}
                />
                <Route path="/" exact>
                    <Main
                        loggedIn={this.state.loggedIn}
                    />
                </Route>
                <Route path="/register">
                    <Register
                        setLoggedIn={this.setLoggedIn}
                    />
                </Route>
                <Route path="/login">
                    <Login
                        setLoggedIn={this.setLoggedIn}
                    />
                </Route>
            </Router>
        )
    }
}

export default App;
