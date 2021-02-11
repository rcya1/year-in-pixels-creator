import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {AlertContainer} from "react-bs-notifier";

import AppNavbar from './AppNavbar'
import Main from './main/Main'
import Register from './Register'
import Login from './Login'
import HTTPRequest from './util/HTTPRequest';

let StyledAlert = require('./AlertStyle').StyledAlert;

// TODO Fix the formatting on the alerts
class App extends React.Component {
    
    constructor(props) {
        super(props);

        let data = Array(12).fill().map(() => Array(31).fill(0));
        let comments = Array(12).fill().map(() => Array(31).fill(""));

        this.state = {
            loggedIn: false,
            alerts: [],
            data: data,
            comments: comments,
            options: [
                [125, 125, 117, "Very Bad Day"], 
                [184, 183, 118, "Bad Day"],
                [175, 125, 197, "Average Day"],
                [126, 252, 238, "Chill Day"],
                [253, 250, 117, "Good Day"],
                [253, 125, 236, "Amazing Day"],
                [255, 171, 111, "Super Special Day"]
            ]
        }

        this.retrieveData = this.retrieveData.bind(this);
        this.updateDay = this.updateDay.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.addAlert = this.addAlert.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
    }

    retrieveData() {
        if(this.state.loggedIn) {
            
        }
    }

    updateDay(month, day, value, comment) {
        let dataCopy = this.state.data.map((arr) => {
            return arr.slice();
        });
        dataCopy[month][day] = value;

        let commentsCopy = this.state.comments.map((arr) => {
            return arr.slice();
        });
        commentsCopy[month][day] = comment;
        this.setState({
            data: dataCopy,
            comments: commentsCopy
        });

        // TODO Send data to the server
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
                <AlertContainer position="top-right">
                    {
                        this.state.alerts.map((alert) => {
                            return <StyledAlert
                                timeout={10000}
                                onDismiss={() => { this.onDismissAlert(alert) }}
                                type={alert.type}
                                key={alert.id}
                                headline={alert.headline}
                            >
                                {alert.message}    
                            </StyledAlert>
                        })
                    }
                </AlertContainer>
                <Route path="/" exact>
                    <Main
                        loggedIn={this.state.loggedIn}
                        addAlert={this.addAlert}
                        data={this.state.data}
                        comments={this.state.comments}
                        options={this.state.options}
                        updateDay={this.updateDay}
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
                        retrieveData={this.retrieveData}
                    />
                </Route>
            </Router>
        )
    }
}

export default App;
