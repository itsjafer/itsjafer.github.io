import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Helmet} from "react-helmet";
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const ReactHighcharts = require('react-highcharts/ReactHighstock'); 
moment().format();
class Trader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      positions: null
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  getBssData() {
    const URI = "https://us-central1-alpacatrader-304216.cloudfunctions.net/getBSSInfo";
    fetch(`${URI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let results = data['results'];
        let trimmed = results.map(item => {
            return [moment(item['date']).subtract(6, 'h').startOf("minute").valueOf(), parseFloat(item['equity'])]
        })
        trimmed.sort(function(a,b) { return a[0] > b[0] })
        const limitedPositions = data['positions'] ? data['positions'].map((position) => ({
            'symbol': position['symbol'],
            'profit': position['profit'],
            'profitPercent': position['profitPercent']
        })) : [];

        this.setState({
            equityBSS: parseFloat(data['equity']),
            changeBSS: parseFloat(data['change']),
            positionsBSS: data['positions'],
            dataBSS: trimmed,
            limitedPositionsBSS: limitedPositions
        })
    })
    .catch((e) => {
        alert(e)
        console.log(e);
    });
  }

  getSentimentData() {

    const URI = "https://us-central1-alpacatrader-304216.cloudfunctions.net/getAlpacaInfoSentiment";
    fetch(`${URI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let results = data['results'];
        let trimmed = results.map(item => {
            return [moment(item['date']).subtract(6, 'h').startOf("minute").valueOf(), parseFloat(item['equity'])]
        })
        trimmed.sort(function(a,b) { return a[0] > b[0] })
        const limitedPositions = data['positions'] ? data['positions'].map((position) => ({
            'symbol': position['symbol'],
            'profit': position['profit'],
            'profitPercent': position['profitPercent']
        })) : [];

        this.setState({
            equityS: parseFloat(data['equity']),
            changeS: parseFloat(data['change']),
            positionsS: data['positions'],
            dataS: trimmed,
            limitedPositionsS: limitedPositions
        })
    })
    .catch((e) => {
        alert(e)
        console.log(e);
    });
  }

  getCurrentData() {

    const URI = "https://us-central1-alpacatrader-304216.cloudfunctions.net/getAlpacaInfo";
    fetch(`${URI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let results = data['results'];
        let trimmed = results.map(item => {
            return [moment(item['date']).subtract(6, 'h').startOf("minute").valueOf(), parseFloat(item['equity'])]
        })
        trimmed.sort(function(a,b) { return a[0] > b[0] })
        const limitedPositions = data['positions'] ? data['positions'].map((position) => ({
            'symbol': position['symbol'],
            'profit': position['profit'],
            'profitPercent': position['profitPercent']
        })) : [];

        this.setState({
            equity: parseFloat(data['equity']),
            change: parseFloat(data['change']),
            positions: data['positions'],
            data: trimmed,
            limitedPositions: limitedPositions
        })
    })
    .catch((e) => {
        alert(e)
        console.log(e);
    });
  }

  static formatDollar(num) {
    if (!num) {
        return;
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    return formatter.format(num)
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
    this.focus = true;
    this.getCurrentData()
    this.getSentimentData()
    this.getBssData()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  onFocus = () => {
    this.focus = true
  }

  onBlur = () => {
    this.focus = false
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 800 });
  }

  render() {
    const positionColumns = [
        {
            Header: 'Symbol',
            accessor: 'symbol',
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Quantity',
            accessor: 'qty',
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Cost',
            id: 'cost',
            accessor: (d) => Trader.formatDollar(d.cost),
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Value',
            id: 'value',
            accessor: (d) => Trader.formatDollar(d.value),
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Profit',
            id: 'profit',
            accessor: (d) => Trader.formatDollar(d.profit),
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Profit Percent',
            id: 'profitPercent',
            accessor: (d) => (d.profitPercent * 100).toFixed(2) + "%",
            style: { whiteSpace: 'unset' },
        },

        ];
        const limitedColumns = [
        {
            Header: 'Symbol',
            accessor: 'symbol',
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Profit',
            id: 'profit',
            accessor: (d) => Trader.formatDollar(d.profit),
            style: { whiteSpace: 'unset' },
        },
        {
            Header: 'Profit Percent',
            id: 'profitPercent',
            accessor: (d) => (d.profitPercent * 100).toFixed(2) + "%",
            style: { whiteSpace: 'unset' },
        },
        ];
      const config = {
          title: {
              text: ''
          },
          series: 
            [
                {
                    name: 'Occurrences',
                    data: this.state.data,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    name: 'Sentiment',
                    data: this.state.dataS,
                    tooltip: {
                        valueDecimals: 2
                    },
                },
                {
                    name: 'BSS',
                    data: this.state.dataBSS,
                    tooltip: {
                        valueDecimals: 2
                    },
                }
            ],
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                selected: 1,
                buttons: [{
                type: 'hour',
                count: 1,
                text: '1h',
                title: 'View 1 hour'
            }, {
                type: 'hour',
                count: 12,
                text: '12h',
                title: 'View 12 hours'
            }, {
                type: 'day',
                count: 1,
                text: '1d',
                title: 'View 1 Day'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }]
            }
      };
      const { equityBSS, changeBSS, positionsBSS, limitedPositionsBSS, equity, equityS, changeS, positionsS, limitedPositionsS, change, positions, isDesktop, limitedPositions } = this.state;
      const formattedEquity = Trader.formatDollar(equity)
      const percentChange = ((change * 100 )/ equity).toFixed(2)
      const formattedChange = Trader.formatDollar(change)
      const overallChange = equity - 100000;
      const overallPercent = ((overallChange * 100) / 100000).toFixed(2)
      const formattedOverall = Trader.formatDollar(overallChange);

      const formattedEquityS = Trader.formatDollar(equityS)
      const percentChangeS = ((changeS * 100 )/ equityS).toFixed(2)
      const formattedChangeS = Trader.formatDollar(changeS)
      const overallChangeS = equityS - 100000;
      const overallPercentS = ((overallChangeS * 100) / 100000).toFixed(2)
      const formattedOverallS = Trader.formatDollar(overallChangeS);

      const formattedEquityBSS = Trader.formatDollar(equityBSS)
      const percentChangeBSS = ((changeBSS * 100 )/ equityBSS).toFixed(2)
      const formattedChangeBSS = Trader.formatDollar(changeBSS)
      const overallChangeBSS = equityBSS - 100000;
      const overallPercentBSS = ((overallChangeBSS * 100) / 100000).toFixed(2)
      const formattedOverallBSS = Trader.formatDollar(overallChangeBSS);
    return (
      <div>
        <Helmet>
          <title>Jafer Haider -- Reddit Algo Trader</title>
          <meta name="description" content="Algo trader using stock popularity on Reddit"/>
          <link rel="canonical" href="http://itsjafer.com/#/trader" />
        </Helmet>
        <p>This page is a dashboard to monitor performance of three algorithmic day traders I'm currently paper testing. This is updated every 15 minutes or on refresh.</p>

        <p><span style={{"color": "#368fe2"}}><b>Occurrences:</b></span> finds the top 10 most mentioned stocks on reddit and rebalances the portfolio around them every minute</p>
        <p><b>Sentiment:</b> finds the top 10 stocks with the highest sentiment rating on reddit and rebalances the portfolio around them every 5 minutes</p>
        <p><span style={{"color": "#5ec26a"}}><b>BSS</b></span>: Stock selection based on a rather...unique individual.</p>
        <div className="balances">
        {
          !equity && 'Loading...'
        }
        {   equity && (
            <div className="occurrences">
                <h2>{formattedEquity}</h2>
        <h4>{change >= 0 ? "+" + formattedChange : formattedChange} ({percentChange +"%"}) today</h4>
                <h4>{overallChange >= 0 ? "+" + formattedOverall : formattedOverall} ({overallPercent +"%"}) all time</h4>
            </div>
            )
        }
        {
            !equityS && (
            <div className="bss">
                Loading...
            </div>  
            )
        }
        {   equityS && (
            <div className="bss">
                <h2>{formattedEquityBSS}</h2>
            <h4>{changeBSS >= 0 ? "+" + formattedChangeBSS : formattedChangeBSS} ({percentChangeBSS +"%"}) today</h4>
                <h4>{overallChangeBSS >= 0 ? "+" + formattedOverallBSS : formattedOverallBSS} ({overallPercentBSS +"%"}) all time</h4>
            </div>
            )
        }
        {
          !equityS && (
            <div className="sentiment">
                Loading...
            </div>  
          )
        }
        {   equityS && (
            <div className="sentiment">
                <h2>{formattedEquityS}</h2>
        <h4>{changeS >= 0 ? "+" + formattedChangeS : formattedChangeS} ({percentChangeS +"%"}) today</h4>
                <h4>{overallChangeS >= 0 ? "+" + formattedOverallS : formattedOverallS} ({overallPercentS +"%"}) all time</h4>
            </div>
            )
        }
        </div>
        <ReactHighcharts config={config}></ReactHighcharts>
            <h4>Current Holdings</h4>
            <div className="tabs">
            <Tabs>
                <TabList>
                    <Tab>Occurrences</Tab>
                    <Tab>Sentiment</Tab>
                    <Tab>BSS</Tab>
                </TabList>
                <TabPanel>
                {
                    positions && (
                        <ReactTable
                        data={isDesktop ? positions : limitedPositions}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positions.length}
                        showPaginationBottom={false}
                        showPageSizeOptions={false}
                        />
                        )
                    }
                </TabPanel>
                <TabPanel>
                {
                    positionsS &&
                    (
                        <ReactTable
                        data={isDesktop ? positionsS : limitedPositionsS}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positionsS.length}
                        showPaginationBottom={false}
                        showPageSizeOptions={false}
                        />
                        )
                    }
                </TabPanel>
                <TabPanel>
                {
                    positionsBSS &&
                    (
                        <ReactTable
                        data={isDesktop ? positionsBSS : limitedPositionsBSS}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positionsBSS.length}
                        showPaginationBottom={false}
                        showPageSizeOptions={false}
                        />
                        )
                    }
                </TabPanel>
            </Tabs>
            </div>
        </div>
    );
  }
}

export default Trader;
