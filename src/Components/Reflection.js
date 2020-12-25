import React, { Component } from 'react';
import MarkdownComponent from './MarkdownComponent';

class Reflection extends Component {
  constructor(props) {
    this.state = { file: this.props.file };
  }


  render() {
    return (
      <div className="reflection">
        <span className="reflectionTitle">{this.props.title}</span>
        <h4>{this.props.date}</h4>
        <MarkdownComponent markdownSrcPromise={this.state.file} />
        {' '}
      </div>
    );
  }
}

export default Reflection;
