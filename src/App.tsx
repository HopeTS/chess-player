import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Switch } from 'react-router';

import './App.scss';
import Home from './pages/Home';
import Game from './pages/Game';
import logo from './logo.svg';


function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route 
                        exact
                        path="/"
                        component={Home}
                    />

                    <Route 
                        path="/game"
                        component={Game}
                    />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
