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

        <p>This Summer, I'll be interning at Google within the Cloud Compute team!</p>
        
        <p>
          Apart from all that, I&apos;m a big fan of board games, movies, and TV Shows (for real, I even have a
          <a href="/#/favourites"> list</a>
          ), I love good shawarma, and I like to
          <a href="/repo"> write tweaks for jailbroken iPhones</a>
          {' '}
          on occasion.
        </p>
        
        <p>If you want to connect, we can hop on a call to talk about experiences, education, connect about an opportunity, or just hangout -- <a href="https://calendly.com/itsjafer/coffee-chat"> schedule a coffee chat on my calendar</a>!
        </p>

      </div>
    );
  }
}

export default Home;
