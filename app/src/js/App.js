import AppNavbar from './AppNavbar'
import Main from './main/Main'
import Register from './Register'

import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

function App() {
    return (
        <Router>
            <AppNavbar></AppNavbar>
            <Route path="/" exact component={Main} />
            <Route path="/register" component={Register} />
        </Router>
    )
}

export default App;
