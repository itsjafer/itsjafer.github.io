import React, { Component } from 'react';
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme'
import {Helmet} from "react-helmet";

import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class Technical extends Component {

  removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      textLayers.forEach(layer => {
        const { style } = layer;
        style.top = "0";
        style.left = "0";
        style.transform = "";
    });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Jafer Haider -- Resume</title>
          <meta name="description" content="My most up-to-date resume."/>
          <link rel="canonical" href="http://itsjafer.com/#/technical" />
          <meta name="image" property="og:image" content="/Resume.jpg"/>
        </Helmet>
        <div className="Resume">
          <p>
            {' '}
            Here is a
            <a href="Jafer_Haider_Resume.pdf" target="_blank" rel="noopener noreferrer"> direct link to my resume;</a>
            {' '}
            Ahead of my graduation in 2021, I'm currently looking for new grad opportunities!
            {' '}
          </p>

          <SizeMe>
              {({ size }) => (
                <Document file={"Jafer_Haider_Resume.pdf"}>
                  <Page pageNumber={1}  onLoadSuccess={this.removeTextLayerOffset} width={size.width ? size.width : 1} />
                </Document>
              )}
          </SizeMe>
        </div>
      </div>
    );
  }
}

export default Technical;
