import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {AlertContainer} from "react-bs-notifier";

import AppNavbar from './components/AppNavbar'
import Main from './components/main/Main'
import Register from './components/Register'
import Login from './components/Login'
import { OverrideDataPrompt, OverrideOption } from './components/OverrideDataPrompt'
import HTTPRequest from './util/HTTPRequest';
import { getIndex } from './util/DateUtils';

let StyledAlert = require('./AlertStyle').StyledAlert;

class App extends React.Component {
    
    constructor(props) {
        super(props);

        let values = Array(12 * 31).fill(0);
        let comments = Array(12 * 31).fill("");

        this.state = {
            loggedIn: false,
            year: new Date().getFullYear(),
            alerts: [],
            values: values,
            comments: comments,
            options: [
                [125, 125, 117, "Very Bad Day"], 
                [184, 183, 118, "Bad Day"],
                [175, 125, 197, "Average Day"],
                [126, 252, 238, "Chill Day"],
                [253, 250, 117, "Good Day"],
                [253, 125, 236, "Amazing Day"],
                [255, 171, 111, "Super Special Day"]
            ],
            overrideDataPromptVisible: false
        }

        this.retrieveData = this.retrieveData.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.updateDay = this.updateDay.bind(this);
        this.handleDataOverrideSubmit = this.handleDataOverrideSubmit.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.addAlert = this.addAlert.bind(this);
        this.onDismissAlert = this.onDismissAlert.bind(this);
        this.onlineValues = null;
        this.onlineComments = null;
    }

    async componentDidMount() {
        try {
            let res = await HTTPRequest.get("authenticated");
            this.setState({
                loggedIn: res.data
            });
            if(res.data === true) {
                this.retrieveData();
            }
        }
        catch(err) {
            if(err.response !== undefined) {
                let response = err.response.data;
                this.addAlert("danger", "Unknown Error", response);
            }
            else {
                this.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
            }
        }
    }

    async retrieveData() {
        if(this.state.loggedIn) {
            try {
                let res = await HTTPRequest.get("data/get-year/" + this.state.year);

                let onlineValues = res.data.values;
                let onlineComments = res.data.comments;

                let versionsDifferent = false;
                let currentModified = false;
                for(let i = 0; i < 12 * 31; i++) {
                    if(onlineValues[i] !== this.state.values[i] || onlineComments[i] !== this.state.comments[i]) {
                        versionsDifferent = true;
                    }
                    if(this.state.values[i] !== 0 || this.state.comments[i] !== "") {
                        currentModified = true;
                    }
                    if(versionsDifferent && currentModified) break;
                }

                if(versionsDifferent && currentModified) {
                    this.setState({
                        overrideDataPromptVisible: true
                    });
                    this.onlineValues = onlineValues;
                    this.onlineComments = onlineComments;
                }
                else {
                    this.setState({
                        values: res.data.values,
                        comments: res.data.comments
                    });
                    this.addAlert("info", "Loaded Data", "Successfully loaded data from account.");
                    this.onlineValues = null;
                    this.onlineComments = null;
                }
            }
            catch(err) {
                if(err.response !== undefined) {
                    let response = err.response.data;
                    this.addAlert("danger", "Unknown Error", response);
                }
                else {
                    this.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
                }
            }
        }
    }

    async updateDay(month, day, value, comment) {
        let valuesCopy = this.state.values.slice();
        valuesCopy[getIndex(month, day)] = value;

        let commentsCopy = this.state.comments.slice();
        commentsCopy[getIndex(month, day)] = comment;

        this.setState({
            values: valuesCopy,
            comments: commentsCopy
        });

        const body = {
            year: this.state.year,
            month: month + 1,
            day: day + 1,
            value: value,
            comment: comment
        }

        if(this.state.loggedIn) {
            try {
                await HTTPRequest.post("/data/edit-day", body);
                this.addAlert("info", "Updated Data", "Successfully updated data for account.");
            }
            catch(err) {
                if(err.response !== undefined) {
                    let response = err.response.data;
                    this.addAlert("danger", "Unknown Error", response);
                }
                else {
                    this.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
                }
            }
        }
    }

    async uploadData() {
        try {
            await HTTPRequest.post("data/add-year", { year: this.state.year });
            
            const body = {
                year: this.state.year,
                values: this.state.values,
                comments: this.state.comments
            };

            await HTTPRequest.post("/data/edit-year", body);
            this.addAlert("info", "Uploaded Data", "Successfully uploaded data for new account.");
        }
        catch(err) {
            if(err.response !== undefined) {
                let response = err.response.data;
                this.addAlert("danger", "Unknown Error", response);
            }
            else {
                this.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
            }
        }
    }

    async handleDataOverrideSubmit(overrideOption) {
        switch(overrideOption) {
            case OverrideOption.REPLACE_CURRENT:
                this.onlineValues = this.state.values;
                this.onlineComments = this.state.comments;
                break;
            case OverrideOption.REPLACE_ONLINE:
                this.setState({
                    values: this.onlineValues,
                    comments: this.onlineComments
                });
                break;
            case OverrideOption.MERGE_CURRENT:
                for(let i = 0; i < 12 * 31; i++) {
                    if(this.state.values[i] !== this.onlineValues[i]) {
                        if(this.state.values[i] !== 0) {
                            this.onlineValues[i] = this.state.values[i];
                        }
                    }
                    if(this.state.comments[i] !== this.onlineComments[i]) {
                        if(this.state.comments[i] !== 0) {
                            this.onlineComments[i] = this.state.comments[i];
                        }
                    }
                }

                this.setState({
                    values: this.onlineValues,
                    comments: this.onlineComments
                });
                break;
            case OverrideOption.MERGE_ONLINE:
                for(let i = 0; i < 12 * 31; i++) {
                    if(this.state.values[i] !== this.onlineValues[i]) {
                        if(this.onlineValues[i] === 0) {
                            this.onlineValues[i] = this.state.values[i];
                        }
                    }
                    if(this.state.comments[i] !== this.onlineComments[i]) {
                        if(this.onlineComments[i] === "") {
                            this.onlineComments[i] = this.state.comments[i];
                        }
                    }
                }

                this.setState({
                    values: this.onlineValues,
                    comments: this.onlineComments
                });
                break;
            default:
                break;
        }

        try {
            const body = {
                year: this.state.year,
                values: this.onlineValues,
                comments: this.onlineComments
            };

            await HTTPRequest.post("/data/edit-year", body);
            this.addAlert("info", "Updated Data", "Successfully updated data for account.");
        }
        catch(err) {
            if(err.response !== undefined) {
                let response = err.response.data;
                this.addAlert("danger", "Unknown Error", response);
            }
            else {
                this.addAlert("danger", "Unknown Error Has Occurred", "Please contact the developer to help fix this issue.");
            }
        }

        this.onlineValues = null;
        this.onlineComments = null;

        this.setState({
            overrideDataPromptVisible: false
        });
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
                <OverrideDataPrompt
                    visible={this.state.overrideDataPromptVisible}
                    handleSubmit={this.handleDataOverrideSubmit}
                />
                <Route path="/" exact>
                    <Main
                        loggedIn={this.state.loggedIn}
                        addAlert={this.addAlert}
                        values={this.state.values}
                        comments={this.state.comments}
                        options={this.state.options}
                        updateDay={this.updateDay}
                    />
                </Route>
                <Route path="/register">
                    <Register
                        setLoggedIn={this.setLoggedIn}
                        addAlert={this.addAlert}
                        uploadData={this.uploadData}
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
