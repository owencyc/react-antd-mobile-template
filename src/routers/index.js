import React, { Component } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router'

import App from '../components/app/App'
import test from '../demo/test/test'

const NotFound1 = () => (
    <div style={{ position: "fixed", width: '100%', height: '100%', zIndex: "100", backgroundColor: '#f5f5f9' }}>404</div>
)
const dan = () => (
    <div>
        问题填单
    </div>
)

export default class AppRouter extends Component {
    updateHandle() {
        console.log("换了一页")
    }
    render() {
        return (
            <div className='App'>
                <Switch>
                    <Route path="/" component={App} exact />
                    <Route path="/test" component={test} exact />
                    

                    <Route component={NotFound1} />

                </Switch>
            </div>
        );
    }
}