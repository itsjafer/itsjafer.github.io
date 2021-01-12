import React, { Component } from 'react';
import {
  NavLink,
} from 'react-router-dom';

class Schedule extends Component {
  render() {
    return (
      <div>
        <p>
          I am currently in my
          <b> 4B</b>
          {' '}
          term.
        </p>
        <div className="schedule">
          <div className="year">
            <div className="term">
              <h3>1A: Fall 2016</h3>
              <ul>
                <li>BU111 - Business Environment</li>
                <li>EC120 - Microeconomics</li>
                <li>CS135 - Functional Programming</li>
                <li>MATH135 - Proofs</li>
                <li>MATH137 - Calculus I</li>
              </ul>
            </div>
            <div className="term">
              <h3>1B: Winter 2017</h3>
              <ul>
                <li>BU121 - Business Functions</li>
                <li>EC140 - Macroeconomics</li>
                <li>CS136 - Data Abstraction</li>
                <li>SPCOM223 - Public Speaking</li>
                <li>MATH128 - Calculus II</li>
                <li>PD1 - Career Fundamentals</li>
              </ul>
            </div>
            <div className="term">
              <h3>Spring 2017</h3>
              <ul>
                <li>MATH136 - Linear Algebra</li>
                <li><b>DevOps Engineer - Camis Inc.</b></li>
              </ul>
            </div>
          </div>

          <div className="year">
            <div className="term">
              <h3>2A: Fall 2017</h3>
              <ul>
                <li>BU127 - Financial Accounting</li>
                <li>BU283 - Corporate Finance I</li>
                <li>BU288 - Organizational Behaviour I</li>
                <li>CS245 - Logic and Computation</li>
                <li>CS246 - Object-Oriented Software</li>
                <li>STAT230 - Probability</li>
              </ul>
            </div>
            <div className="term">
              <h3>Winter 2018</h3>
              <ul>
                <li>CO250 - Introduction to Optimization</li>
                <li><b>Software Developer (Trading Products) - BMO Capital Markets</b></li>
              </ul>
            </div>
            <div className="term">
              <h3>2B: Spring 2018</h3>
              <ul>
                <li>BU231 - Business Law</li>
                <li>BU247 - Managerial Accounting</li>
                <li>
                  <NavLink to="/cs240">CS240</NavLink>
                  {' '}
                  - Data Structures
                </li>
                <li>CS241 - Compilers</li>
                <li>CS251 - Computer/Circuit Design</li>
                <li>STAT231 - Statistics</li>
              </ul>
            </div>
          </div>

          <div className="year">
            <div className="term">
              <h3>3A: Fall 2018</h3>
              <ul>
                <li>BU393 - Corporate Finance II</li>
                <li>BU352 - Human Resources</li>
                <li>BU354 - Marketing</li>
                <li>CS350 - Operating Systems</li>
                <li>MATH239- Graph Theory</li>
                <li><b>Software Developer (Mobile) - NLS</b></li>
              </ul>
            </div>
            <div className="term">
              <h3>3B: Winter 2019</h3>
              <ul>
                <li>
                  <NavLink to="/bu362">BU362</NavLink>
                  {' '}
                  - Product management
                </li>
                <li>BU375 - Operations management</li>
                <li>BU398 - Organizational Behaviour II</li>
                <li>
                  <NavLink to="/cs341">CS341</NavLink>
                  {' '}
                  - Algorithms
                </li>
              </ul>
            </div>
            <div className="term">
              <h3>Spring 2019</h3>
              <ul>
                <li><b>Software Engineer (Data Science) - Vida Health</b></li>
              </ul>
            </div>
          </div>

          <div className="year">
            <div className="term">
              <h3>4A: Fall 2019</h3>
              <ul>
                <li>BU481 - Business Policy I</li>
                <li>BU422 - Marketing Research</li>
                <li>CS343 - Concurrency Programming</li>
                <li>EC260 - Microeconomics</li>
              </ul>
            </div>
            <div className="term">
              <h3>Winter 2020</h3>
              <ul>
                <li><b>Software Engineer (Infrastructure) - Yelp Inc.</b></li>
                <li>SI102 - Introduction to Arabic 2</li>
              </ul>
            </div>
            <div className="term">
              <h3>4B: Spring 2020</h3>
              <ul>
                <li>CS348 - Databases</li>
                <li>BU452 - Marketing Strategy</li>
                <li>CS490 - Information Systems</li>
                <li>CS492 - Social Implications of Computing</li>
              </ul>
            </div>
          </div>

          <div className="year">
            <div className="term">
              <h3>Fall 2020</h3>
              <ul>
                <li><b>Software Development Engineer - Amazon (AWS Step Functions)</b></li>
              </ul>
            </div>
            <div className="term">
              <h3>5A: Winter 2021</h3>
              <ul>
                <li>SDS131R - Intro to Political Ideologies</li>
                <li>BU493V - Investment Strategies</li>
                <li>BU491 - Policy 2</li>
                <li>CS451 - Data-Intensive Distributed Computing</li>
                <li>CS486 - Artificial Intelligence</li>
              </ul>
            </div>
            <div className="term">
              <h3>Spring 2021</h3>
              <ul>
                <li><b>Software Engineer - Google</b></li>
              </ul>
            </div>
          </div>
          <div className="year">
            <div className="term">
              <h3>5B: Fall 2021</h3>
              <ul>
                <li>Elective</li>
                <li>BU4?? - Elective</li>
                <li>BU4?? - Elective</li>
                <li>BU4?? - Elective</li>
                <li>CS??? - Elective</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Schedule;
