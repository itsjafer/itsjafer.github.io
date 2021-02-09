import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter,
} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import ReactGA from 'react-ga';
import loadScript from 'load-script';
import withTracker from './withTracker';
import Home from './Components/Home';
import Social from './Components/Social';
import Technical from './Components/Technical';
import Favourites from './Components/Favourites';
import Schedule from './Components/Schedule';
import Reflection from './Components/Reflection';
import ShowPredictor from './Components/ShowPredictor';
import Parser from './Components/Parser';
import Trader from './Components/Trader';
import Loonie from './Components/Loonie/Loonie';
import CS240 from './Courses/CS240.md';
import BU362 from './Courses/BU362.md';
import CS341 from './Courses/CS341.md';

const MATHJAX_SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';

const MATHJAX_OPTIONS = {
  'fast-preview': { disabled: true },
  tex2jax: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  showMathMenu: false,
  showMathMenuMSIE: false,
};

ReactGA.initialize('UA-123367662-1');

function fireTracking() {
  ReactGA.pageview(window.location.pathname + window.location.search);
}

class Main extends Component {
  constructor(props) {
    super(props);
    loadScript(MATHJAX_SCRIPT, () => {
      window.MathJax.Hub.Config(MATHJAX_OPTIONS);
    });
  }

  render() {
    const { cookies } = this.props;
    return (
      <HashRouter onUpdate={fireTracking}>
        <div>
          <div className="content">
            <ul className="header">
              <li><NavLink exact to="/">Home</NavLink></li>
              <li><NavLink exact to="/technical">Resume</NavLink></li>
              <li><NavLink to="/favourites">Things I Love</NavLink></li>
              <li><NavLink to="/schedule">Coursework</NavLink></li>
              <li>
                <div class="dropdown">
                <label class="dropbtn">Projects</label>
                <div class="dropdown-content">
                <NavLink to="/trader">Algo Trader</NavLink>
                <NavLink to="/parser">Resume Parser</NavLink>
                <NavLink to="/show-predictor">TV Show Recommender</NavLink>
                <NavLink to="/loonie">Loonie</NavLink>
                <a href="https://itsjafer.com/repo" target="_blank" rel="noopener noreferrer">Cydia Repo</a>
                </div>
              </div></li>
            </ul>
            <h1>Jafer Haider</h1>
            <Social />

            <Route exact path="/" component={withTracker(Home)} />
            <Route exact path="/technical" component={withTracker(Technical)} />
            <Route path="/favourites" component={withTracker(Favourites)} />
            <Route path="/schedule" component={withTracker(Schedule)} />
            <Route path="/show-predictor" component={withTracker(ShowPredictor)} />
            <Route path="/loonie" component={withTracker(() => <Loonie cookies={cookies} />)} />
            <Route path="/parser" component={withTracker(Parser)} />
            <Route path="/trader" component={withTracker(Trader)} />
            <Route
              path="/cs240"
              component={withTracker(() => (
                <Reflection
                  title="CS240"
                  date="Spring 2018"
                  file={CS240}
                />
              ))}
            />
            <Route
              path="/bu362"
              component={withTracker(() => (
                <Reflection
                  title="BU362"
                  date="Winter 2019"
                  file={BU362}
                />
              ))}
            />
            <Route
              path="/cs341"
              component={withTracker(() => (
                <Reflection
                  title="CS341"
                  date="Winter 2019"
                  file={CS341}
                />
              ))}
            />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default withCookies(Main);
