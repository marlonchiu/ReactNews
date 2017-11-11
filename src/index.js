import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import App from './components/App';
import NewsContainer from './components/newsContainer';
import NewsDetail from './components/newsDetail';
import UserCenter from './components/userCenter';

import './componentsCss/pc.css';


ReactDOM.render(
    (
        <Router history={hashHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={NewsContainer}></IndexRoute>
                <Route path='/news_detail/:newsId' component={NewsDetail}></Route>
                <Route path='/user_center' component={UserCenter}></Route>
            </Route>
        </Router>
    ),
    document.getElementById('root')
);
