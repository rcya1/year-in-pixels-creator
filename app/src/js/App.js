import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { AlertContainer } from "react-bs-notifier";

// Main Components
import AppNavbar from './components/AppNavbar'
import YearInPixels from './components/main/YearInPixels'
import Register from './components/Register'
import Login from './components/Login'
import AccountSettings from './components/AccountSettings'

// Utility
import HTTPRequest from './util/HTTPRequest';
import { OverridePrompt, OverrideOption, PromptStatus } from './components/OverridePrompt'
import { getIndex } from './util/DateUtils';
import { defaultOptions } from './util/ColorUtils';
import { handleError } from './util/ErrorUtils';

import 'bootstrap/dist/css/bootstrap.min.css';

let StyledAlert = require('./components/AlertStyle').StyledAlert;

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            name: "",
            username: "",

            year: new Date().getFullYear(),
            years: [new Date().getFullYear()],
            values: Array(12 * 31).fill(0),
            comments: Array(12 * 31).fill(""),
            options: defaultOptions,
            
            alerts: [],
            overrideDataPromptStatus: PromptStatus.NONE
        }

        this.onlineValues = null;
        this.onlineComments = null;
    }

    componentDidMount = async () => {
        try {
            let res = await HTTPRequest.get("authenticated");

            this.setState({
                loggedIn: res.data
            });

            if(res.data === true) {
                this.syncData();
            }
        }
        catch(err) {
            handleError(err, this.addAlert);
        }
    }

    syncData = async () => {
        if(this.state.loggedIn) {
            try {
                this.loadName();
                this.syncColorSchemes();
                await this.loadYears(); // this must finish before loading values and comments
                this.syncValuesAndComments();
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        }
    }

    loadName = async () => {
        let res = await HTTPRequest.get("users");
        let name = res.data.name;
        let username = res.data.username;

        this.setState({
            name: name,
            username: username
        });
    }

    loadYears = async () => {
        const body = {
            includeData: false
        };
        let res = await HTTPRequest.get("data", body);
        console.log(res);

        let years = [];
        for(let i in res.data) {
            years.push(res.data[i].year);
        }
        years.sort();

        this.setState({
            year: years[years.length - 1],
            years: years
        });
    }

    syncValuesAndComments = async () => {
        let res = await HTTPRequest.get("data/" + this.state.year);

        let onlineValues = res.data.values;
        let onlineComments = res.data.comments;

        let versionsDifferent = false; // whether or not the online and current version differ
        let currentModified = false;   // whether or not the current version is empty or not
        for(let i = 0; i < 12 * 31; i++) {
            if(onlineValues[i] !== this.state.values[i] || onlineComments[i] !== this.state.comments[i]) {
                versionsDifferent = true;
            }
            if(this.state.values[i] !== 0 || this.state.comments[i] !== "") {
                currentModified = true;
            }
            if(versionsDifferent && currentModified) break;
        }

        // display override prompt to see how to reconcile changes
        if(versionsDifferent && currentModified) {
            this.setState({
                overrideDataPromptStatus: PromptStatus.DATA
            });
            this.onlineValues = onlineValues;
            this.onlineComments = onlineComments;
        }
        // no differences or current version not modified
        // just take the online data
        else {
            this.setState({
                values: res.data.values,
                comments: res.data.comments
            });
            this.addAlert("info", "Loaded Data");
            this.onlineValues = null;
            this.onlineComments = null;
        }
    }

    syncColorSchemes = async () => {
        let res = await HTTPRequest.get("color-schemes");
        let data = res.data;
        
        // no data currently stored in account, so upload it
        if(data.length === 0) {
            for(let i in this.state.options) {
                let colorScheme = this.state.options[i];
                const body = {
                    red:   colorScheme[0],
                    green: colorScheme[1],
                    blue:  colorScheme[2],
                    label: colorScheme[3],
                    ordering: i
                };
                await HTTPRequest.post("color-schemes", body);
            }
            
            this.addAlert("info", "Uploaded Color Schemes");
        }
        else {
            let options = [];
            for(let colorScheme of data) {
                options.push([colorScheme.red, colorScheme.green, colorScheme.blue, colorScheme.label]);
            }
            this.setState({
                options: options
            });
            this.addAlert("info", "Loaded Color Schemes");
        }
    }

    navbarLogout = async () => {
        try {
            await HTTPRequest.post("logout");
            this.setState({
                loggedIn: false
            });
            this.addAlert("info", "Successfully Logged Out");
        }
        catch(err) {
            handleError(err, this.addAlert);
        }
    }

    checkUsernameAvailable = async (username) => {
        try {
            let res = await HTTPRequest.get("users/check-available/" + username);
            return res.data === true;
        }
        catch(err) {
            handleError(err, this.addAlert);
        }
    }

    register = async (name, username, password) => {
        const body = {
            name: name,
            username: username,
            password: password
        };

        try {
            await HTTPRequest.post("users/register", body);
            this.setState({
                loggedIn: true,
                name: name,
                username: username
            });
            this.addAlert("info", "Successfully Registered");
            this.uploadValuesAndComments();
            this.syncColorSchemes();
        }
        catch(err) {
            handleError(err, this.addAlert, [["UserExistsError", "User Already Exists"]]);
            return false;
        }

        return true;
    }

    uploadValuesAndComments = async () => {
        if(this.state.loggedIn) {
            try {
                await HTTPRequest.post("data/" + this.state.year);
                
                const body = {
                    values: this.state.values,
                    comments: this.state.comments
                };

                await HTTPRequest.put("/data/" + this.state.year, body);
                this.addAlert("info", "Uploaded Data");
            }
            catch(err) {
                handleError(err);
            }
        }
    }

    login = async (username, password) => {
        const body = {
            username: username,
            password: password,
        };

        try {
            await HTTPRequest.post("login", body);
            this.setState({
                loggedIn: true
            });
            this.syncData();
            this.addAlert("info", "Successfully Logged In");
        }
        catch(error) {
            handleError(error, this.addAlert, [["IncorrectPasswordError", "Incorrect Password"],
                ["IncorrectUsernameError", "Unknown User"]]);
            return false;
        }
        
        return true;
    }

    updateAccountInfo = async(name, username) => {
        const body = {
            name: name,
            username: username
        };

        try {
            await HTTPRequest.put("users", body);
            this.setState({
                name: name,
                username: username
            });
            this.addAlert("info", "Successfully Updated Account Info");
        }
        catch(err) {
            handleError(err, this.addAlert);
        }
    }

    changePassword = async(oldPassword, newPassword) => {
        const body = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            await HTTPRequest.post("users/change-password", body);
            this.addAlert("info", "Successfully Changed Password");
        }
        catch(err) {
            handleError(err, this.addAlert);
        }
    }

    changeYear = async (newYear) => {
        // wipe data to prevent any overriding issues
        this.setState({
            year: newYear,
            values: Array(12 * 31).fill(0),
            comments: Array(12 * 31).fill(""),
        }, () => {
            // make sure the state is updated before we start getting new year
            try {
                this.syncValuesAndComments();
                this.addAlert("info", "Successfully Changed Year");
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        });
    }

    addYear = async (newYear) => {
        if(this.state.loggedIn) {
            try {
                await HTTPRequest.post("data/" + newYear);
                this.addAlert("info", "Successfully Added Year");
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
            this.changeYear(newYear);       
            this.loadYears();
        }
    }
    
    checkYearExists = async (year) => {
        for(let i = 0; i < this.state.years.length; i++) {
            if(String(this.state.years[i]) === String(year)) {
                return true;
            }
        }

        return false;
    }

    handleDataOverride = async (overrideOption) => {
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
                values: this.onlineValues,
                comments: this.onlineComments
            };

            await HTTPRequest.put("/data/" + this.state.year, body);
            this.addAlert("info", "Handled Data Merging");
        }
        catch(err) {
            handleError(err, this.addAlert);
        }

        this.onlineValues = null;
        this.onlineComments = null;

        this.setState({
            overrideDataPromptStatus: PromptStatus.NONE
        });
    }

    updateBoardData = async (month, day, value, comment) => {
        let valuesCopy = this.state.values.slice();
        valuesCopy[getIndex(month, day)] = value;

        let commentsCopy = this.state.comments.slice();
        commentsCopy[getIndex(month, day)] = comment;

        this.setState({
            values: valuesCopy,
            comments: commentsCopy
        });

        if(this.state.loggedIn) {
            try {
                const body = {
                    value: value,
                    comment: comment
                }

                await HTTPRequest.put("/data/" + this.state.year + "/" + (month + 1) + "/" + (day + 1), body);
                this.addAlert("info", "Updated Board Data");
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        }
    }

    changeColorSchemeOrder = async(startIndex, endIndex) => {
        // swap the color scheme orders orders
        let newOptions = this.state.options.slice();
        let [removed] = newOptions.splice(startIndex, 1);
        newOptions.splice(endIndex, 0, removed);

        // generate new list of indices to figure out how to map current values to the new ones
        let indices = Array.from(Array(newOptions.length).keys());
        let [removedIndices] = indices.splice(startIndex, 1);
        indices.splice(endIndex, 0, removedIndices);

        // locally compute new values for the board data
        let newValues = this.state.values.slice();
        for(let i = 0; i < 12 * 31; i++) {
            newValues[i] = indices.indexOf(newValues[i] - 1) + 1;
        }

        // update this ASAP to make a fluid user response
        this.setState({
            options: newOptions,
            values: newValues
        });
        
        if(this.state.loggedIn) {
            try {
                let bodyLabels = [];
                let bodyOrderings = [];

                for(let i in newOptions) {
                    let colorScheme = newOptions[i];
                    bodyLabels.push(colorScheme[3]);
                    bodyOrderings.push(i);
                }

                const body = {
                    labels: bodyLabels,
                    orderings: bodyOrderings,
                    indices: indices,
                    year: this.state.year
                }

                let res = await HTTPRequest.post("/color-schemes/change-orderings", body);
                this.addAlert("info", "Updated Color Scheme Order");

                // use online data to reupdate just in case
                this.setState({
                    values: res.data
                });
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        }
    }

    // color is passed in as "#RRGGBB"
    addColorScheme = async(label, color) => {
        let colorSchemes = this.state.options.slice();
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        colorSchemes.push([r, g, b, label]);

        this.setState({
            options: colorSchemes
        })
        this.addAlert("info", "Successfully added color scheme");

        if(this.state.loggedIn) {
            try {
                const body = {
                    red: r,
                    green: g,
                    blue: b,
                    label: label
                };
                await HTTPRequest.post("color-schemes", body);
                this.addAlert("info", "Successfully uploaded color scheme");
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

    // newColor is passed in as "#RRGGBB"
    editColorScheme = async(originalLabel, newLabel, newColor) => {
        let colorSchemes = this.state.options.slice();
        let r = parseInt(newColor.substring(1, 3), 16);
        let g = parseInt(newColor.substring(3, 5), 16);
        let b = parseInt(newColor.substring(5, 7), 16);
        let index = -1;
        for(let i = 0; i < colorSchemes.length; i++) {
            if(colorSchemes[i][3] === originalLabel) {
                colorSchemes[i] = [r, g, b, newLabel];
                index = i;
                break;
            }
        }
        this.setState({
            options: colorSchemes
        })
        this.addAlert("info", "Successfully saved color scheme");

        if(this.state.loggedIn && index !== -1) {
            try {
                const body = {
                    red: r,
                    green: g,
                    blue: b,
                    label: newLabel,
                    ordering: index
                };
                await HTTPRequest.put("color-schemes/" + originalLabel, body);
                this.addAlert("info", "Successfully uploaded edited color scheme");
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        }
    }

    deleteColorScheme = async(label) => {
        // delete color scheme from options
        let newOptions = this.state.options.slice();
        let index = -1;
        for(let i = 0; i < newOptions.length; i++) {
            if(newOptions[i][3] === label) {
                index = i;
                break;
            }
        }
        newOptions.splice(index, 1);
        
        // generate new list of indices to figure out how to map current values to the new ones
        let indices = Array.from(Array(this.state.options.length).keys());
        indices.splice(index, 1);
        
        // locally compute new values for the board data
        let newValues = this.state.values.slice();
        for(let i = 0; i < 12 * 31; i++) {
            newValues[i] = indices.indexOf(newValues[i] - 1) + 1;
        }

        this.setState({
            options: newOptions,
            values: newValues
        })
        this.addAlert("info", "Successfully removed color scheme");

        if(this.state.loggedIn && index !== -1) {
            try {
                // actually delete the color scheme from the server
                await HTTPRequest.delete("color-schemes/" + label);
                this.addAlert("info", "Successfully uploaded removed color scheme");

                // send change order data to the server so that it updates all online data
                let bodyLabels = [];
                let bodyOrderings = [];

                for(let i in newOptions) {
                    let colorScheme = newOptions[i];
                    bodyLabels.push(colorScheme[3]);
                    bodyOrderings.push(i);
                }

                const body = {
                    labels: bodyLabels,
                    orderings: bodyOrderings,
                    indices: indices,
                    year: this.state.year
                }
                
                let res = await HTTPRequest.post("/color-schemes/change-orderings", body);
                
                // use online data to reupdate just in case
                this.setState({
                    values: res.data
                });
            }
            catch(err) {
                handleError(err, this.addAlert);
            }
        }
    }

    checkLabelExists = (label) => {
        for(let i = 0; i < this.state.options.length; i++) {
            if(this.state.options[i][3] === label) {
                return true;
            }
        }

        return false;
    }

    addAlert = (type, headline, message) => {
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

    onDismissAlert = (alert) => {
        let i = this.state.alerts.indexOf(alert);
        if(i < 0) return;

        let alerts = this.state.alerts.slice();
        alerts.splice(i, 1);

        this.setState({
            alerts: alerts
        });
    }

    clearAllAlerts = () => {
        this.setState({
            alerts: []
        });
    }
    
    render() {
        return (
            <Router>
                <AppNavbar
                    loggedIn={this.state.loggedIn}
                    username={this.state.username}
                    logout={this.navbarLogout}
                />
                <Route path="/" exact>
                    <YearInPixels
                        loggedIn={this.state.loggedIn}
                        year={this.state.year}
                        years={this.state.years}
                        changeYear={this.changeYear}
                        addYear={this.addYear}
                        checkYearExists={this.checkYearExists}
                        showAddYearModal={this.showAddYearModal}
                        values={this.state.values}
                        comments={this.state.comments}
                        options={this.state.options}
                        updateBoardData={this.updateBoardData}
                        changeColorSchemeOrder={this.changeColorSchemeOrder}
                        addColorScheme={this.addColorScheme}
                        editColorScheme={this.editColorScheme}
                        deleteColorScheme={this.deleteColorScheme}
                        checkLabelExists={this.checkLabelExists}
                    />
                </Route>
                <Route path="/register">
                    <Register
                        register={this.register}
                        checkUsernameAvailable={this.checkUsernameAvailable}
                    />
                </Route>
                <Route path="/login">
                    <Login
                        login={this.login}
                    />
                </Route>
                <Route path="/settings">
                    <AccountSettings
                        loggedIn={this.state.loggedIn}
                        name={this.state.name}
                        username={this.state.username}
                        checkUsernameAvailable={this.checkUsernameAvailable}
                        updateAccountInfo={this.updateAccountInfo}
                        changePassword={this.changePassword}
                    />
                </Route>
                <OverridePrompt
                    status={this.state.overrideDataPromptStatus}
                    handleDataOverride={this.handleDataOverride}
                    handleColorSchemeOverride={this.handleColorSchemeOverride}
                />
                <AlertContainer position="bottom-left">
                    {   
                        this.state.alerts.length > 0 && 
                        <Button className="mb-1" variant="outline-danger" onClick={this.clearAllAlerts}>
                            Clear All Alerts
                        </Button>
                    }
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
            </Router>
        )
    }
}

export default App;
