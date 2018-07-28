import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import PDF from 'react-pdf-js';
import ResumePDF from './resume.pdf';

class Resume extends Component {
  render() {
    return (
      <div>
        <p> My resume was written in LaTeX. To view the source code and the PDF side by side, you can view it directly on Overleaf <a href="https://v2.overleaf.com/read/wvmqpzrthcpw">here</a>. </p>
        <p> For convenience, here is a <a href={ResumePDF}>direct link</a> to my resume. </p>
        <Document 
        file="https://github.com/itsjafer/Resume/raw/master/Resume.pdf" 
        >
          <Page pageNumber={1} renderTextLayer={false}/>
        </Document>
      </div>
    );
  }
}

export default Resume;