import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import withTracker from './withTracker';
import Home from './Components/Home';
import Social from './Components/Social';
import Technical from './Components/Technical';
import Favourites from './Components/Favourites';
import Schedule from './Components/Schedule';
import ShowPredictor from './Components/ShowPredictor';
import ReverseSplit from './Components/ReverseSplit';
import Parser from './Components/Parser';
import {Blog, BlogEntry} from './Components/Blog';
import Trader from './Components/Trader';
import Loonie from './Components/Loonie/Loonie';
import BookWithPoints from './Components/BookWithPoints';
import HalalFood from './Components/HalalFood';
import Quran from './Components/Quran';

ReactGA.initialize('UA-123367662-1');

function fireTracking() {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cookies } = this.props;
    return (
      <HashRouter onUpdate={fireTracking}>
        <div>
          <div className="content">
            <ul className="header">
              <li><NavLink exact to="/">Home</NavLink></li>
              <li><NavLink exact to="/resume">Resume</NavLink></li>
              <li><NavLink to="/schedule">Coursework</NavLink></li>
              <li>
                <div class="dropdown">
                <label class="dropbtn">Projects</label>
                <div class="dropdown-content">
                <NavLink to="/parser">Resume Parser</NavLink>
                <NavLink to="/schwab">Schwab Trader</NavLink>
                <NavLink to="/halal">Halal Food Chicago</NavLink>
                <NavLink to="/quran">Quran</NavLink>
                <a href="https://itsjafer.com/repo" target="_blank" rel="noopener noreferrer">Jailbreak Repo</a>
                </div>
              </div></li>
            </ul>
            <h1>Jafer Haider</h1>
            <Social />

            <Route exact path="/" component={withTracker(Home)} />
            <Route exact path="/technical" component={withTracker(Technical)} />
            <Route exact path="/resume" component={withTracker(Technical)} />
            <Route path="/favourites" component={withTracker(Favourites)} />
            <Route exact path="/blog" component={withTracker(Blog)} />
            <Route exact path="/blog/:file/" component={withTracker(BlogEntry)} />
            <Route path="/reversesplit" component={withTracker(ReverseSplit)} />
            <Route path="/schwab" component={withTracker(ReverseSplit)} />
            <Route path="/schedule" component={withTracker(Schedule)} />
            <Route path="/show-predictor" component={withTracker(ShowPredictor)} />
            <Route path="/loonie" component={withTracker(() => <Loonie cookies={cookies} />)} />
            <Route path="/parser" component={withTracker(Parser)} />
            <Route path="/trader" component={withTracker(Trader)} />
            <Route path="/points" component={withTracker(BookWithPoints)} />
            <Route path="/halal" component={withTracker(HalalFood)} />
            <Route path="/quran" component={withTracker(Quran)} />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default withCookies(Main);
