import AppNavbar from './AppNavbar'
import Main from './main/Main'
import Register from './Register'
import Login from './Login'

import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Button} from "react-bootstrap";
import {AlertList} from "react-bs-notifier";

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            alerts: []
        }

        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    setLoggedIn(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        });
    }

    addAlert(type, headline, message) {
        let alerts = this.state.alerts.slice();
        alerts.push({
            id: new Date().getTime(),
            type: type,
            headline: headline,
            message: message
        });

        this.setState({
            alerts: alerts
        });
    }

    onDismissAlert(alert) {
        let i = this.state.alerts.indexOf(alert);
        if(i < 0) return;

        let alerts = this.state.alerts.slice();
        alerts.splice(i, 1);

        this.setState({
            alerts: alerts
        });
    }
    
    render() {
        return (
            <Router>
                <AppNavbar
                    loggedIn={this.state.loggedIn}
                    setLoggedIn={this.setLoggedIn}
                    addAlert={this.addAlert}
                />
                <AlertList
                    position="top-right"
                    alerts={this.state.alerts}
                    timeout={10000}
                    dismissTitle="Close Alert"
                    onDismiss={this.onDismissAlert}
                />
                <Route path="/" exact>
                    <Main
                        loggedIn={this.state.loggedIn}
                        addAlert={this.addAlert}
                    />
                </Route>
                <Route path="/register">
                    <Register
                        setLoggedIn={this.setLoggedIn}
                        addAlert={this.addAlert}
                    />
                </Route>
                <Route path="/login">
                    <Login
                        setLoggedIn={this.setLoggedIn}
                        addAlert={this.addAlert}
                    />
                </Route>
            </Router>
        )
    }
}

export default App;
