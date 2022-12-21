import React, { Component } from 'react';
import { SizeMe } from 'react-sizeme'

class HalalFood extends Component {
  render() {
    return (
      <div>
        <div className="Resume">
        <SizeMe>
              {({ size }) => (
                <iframe width={size.width ? size.width : 1} height={size.width ? size.width : 1} src="https://datastudio.google.com/embed/reporting/44f0955f-0a93-4cc0-bf4f-6777ed668dd4/page/KtwAD" frameBorder="0" style={{border:0}} allowFullscreen></iframe>
              )}
          </SizeMe>
        </div>
      </div>
    );
  }
}

export default HalalFood;
