import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Helmet} from "react-helmet";
import moment from 'moment';
const ReactHighcharts = require('react-highcharts/ReactHighstock'); // Expects that Highcharts was loaded in the code.
moment().format();
class Trader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      positions: null,
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  getHistoricalData() {

    const URI = "https://us-central1-alpacatrader-304216.cloudfunctions.net/getHistoricalPerformance";
    fetch(`${URI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let results = data['results'];
        let trimmed = results.map(item => {
            return [moment(item['date']).subtract(6, 'h').valueOf(), parseFloat(item['equity'])]
        })
        trimmed.sort(function(a,b) { return a[0] > b[0] })
        this.setState({ data: trimmed });
    })
    .catch((e) => {
        alert(e)
        console.log(e);
    });
  }

  getCurrentData() {

    const URI = "https://us-central1-alpacatrader-304216.cloudfunctions.net/getAlpacaEquity";
    fetch(`${URI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        this.setState({
            equity: parseFloat(data['equity']),
            change: parseFloat(data['change']),
            positions: data['positions']
        })
    })
    .catch((e) => {
        alert(e)
        console.log(e);
    });
  }

  formatDollar(num) {
    if (!num) {
        return;
    }
    var p = num.toFixed(2).split(".");
    return ["$", p[0].split("").reverse().reduce(function(acc, num, i) {
        return num + (i && !(i % 3) ? "," : "") + acc;
    }, "."), p[1]].join("");
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    this.getHistoricalData()
    this.getCurrentData()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 800 });
  }

  render() {
      const config = {
          title: {
              text: ''
          },
          series: [{
              name: 'Portfolio',
              data: this.state.data,
              tooltip: {
                  valueDecimals: 2
              }
          }]
      };
      const equity = this.state.equity;
      const formattedEquity = this.formatDollar(equity)
      const change = this.state.change;
      const formattedChange = this.formatDollar(change)
      const overallChange = equity - 100000;
      const formattedOverall = this.formatDollar(overallChange);
    return (
      <div>
        <Helmet>
          <title>Jafer Haider -- Reddit Algo Trader</title>
          <meta name="description" content="Algo trader using stock popularity on Reddit"/>
          <link rel="canonical" href="http://itsjafer.com/#/trader" />
        </Helmet>
        <p>This page is an interface for an algorithmic day trader I'm currently paper testing. On this page, you will see the portfolio performance and current holdings (updated every 15 minutes or on refresh). The algorithm liquidates all positions at market close.</p>        
        
        <h2>{formattedEquity}</h2>
        <h4>{change >= 0 ? "+" + formattedChange : "-" + formattedChange} since last close</h4>
        <h4>{overallChange >= 0 ? "+" + formattedOverall : "-" + formattedOverall} all time</h4>
        <ReactHighcharts config={config}></ReactHighcharts>
      </div>
    );
  }
}

export default Trader;
