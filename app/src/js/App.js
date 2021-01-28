import AppNavbar from './AppNavbar'
import Main from './main/Main'
import Register from './Register'
import Login from './Login'

import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

function App() {
    return (
        <Router>
            <AppNavbar></AppNavbar>
            <Route path="/" exact component={Main} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
        </Router>
    )
}

export default App;
