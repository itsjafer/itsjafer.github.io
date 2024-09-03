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
          and I'm a Software Engineer at Google. In 2021, I graduated as a double-degree student from the University of Waterloo and Wilfrid Laurier University with degrees in Computer Science and Business Administration, respectively.</p>
        
        <p>
          I also generally enjoy working on side projects that make my life easier. In particular, there's a good chance you've come across my website because of my popular <a href="/#/parser">resume parser project</a>.
        </p>
        
        <p>If you're looking to connect to talk about experiences, education, connect about an opportunity, or just hangout, feel free to send me an email or connect on linkedin!
        </p>

      </div>
    );
  }
}

export default Home;
