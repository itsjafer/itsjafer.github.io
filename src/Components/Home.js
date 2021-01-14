import React, { Component } from 'react';
import {Img} from 'react-image';

class Home extends Component {
  render() {
    return (
      <div>
        <div className='baby'>
          <Img src='baby_jafer.jpeg' />
        </div>
        <h4>Hi there,</h4>

        <p>
          My name is
          <b> Jafer Haider</b>
          {' '}
          and I&apos;m a student studying concurrently at the University of Waterloo and Wilfrid Laurier University working towards an
          <b> Honours Bachelor of Computer Science</b>
          {' '}
          and an
          <b> Honours Bachelor of Business Administration</b>
          {' '}
          respectively.
        </p>

        <p>I&apos;ve got one research assistantship and six internships under my belt including experience at Google, Amazon, Yelp, Vida, and BMO Capital Markets; <a href="/#/technical">check out my resume here</a>!</p>
        
        <p>The most popular page on this website, by far, is my <a href="/#/parser">Resume Parser project</a> which is a tool to show how well your resume gets parsed by online job tracking systems (ATS). Chances are, if you've stumbled across my website, you probably came for that project!</p>

        <p>
          Apart from all that, I&apos;m a big fan of board games, movies, and TV Shows (for real, I even have a
          <a href="/#/favourites"> list</a>
          ), I love a good shawarma, and I like to
          <a href="/repo"> write tweaks for jailbroken iPhones</a>
          {' '}
          on occasion.
        </p>


        <p>If you have any questions about my experiences, education, projects or want to connect about an opportunity, I'd love to <a href="https://linkedin.com/in/itsjafer">connect on LinkedIn</a>. If you'd like to hop on a call, feel free to <a href="https://calendly.com/itsjafer/coffee-chat"> schedule a meeting on my calendar</a>!
        </p>

        <p>You can view the source code for this website and the projects it hosts <a href="https://github.com/itsjafer/itsjafer.github.io">here</a>.</p>

      </div>
    );
  }
}

export default Home;
