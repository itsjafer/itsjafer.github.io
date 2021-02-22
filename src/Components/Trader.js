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
      equity: [null, null, null],
      change: [null, null, null],
      data: [null, null, null],
      limitedPositions: [null, null, null],
      positions: [null, null, null]
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }


  getData() {
      const URIs = [
          "https://us-central1-alpacatrader-304216.cloudfunctions.net/getAlpacaHistory",
          "https://us-central1-alpacatrader-304216.cloudfunctions.net/getAlpacaHistorySentiment",
          "https://us-central1-alpacatrader-304216.cloudfunctions.net/getBSSHistory",
          "https://us-central1-alpacatrader-304216.cloudfunctions.net/getRSAHistory"
      ]

      for (let i = 0; i < URIs.length; i++) {
        const URI = URIs[i]
        fetch(`${URI}`)
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            let results = res['results'];
            let trimmed = null;
            if (i >= 2) {
                trimmed = results.map(item => {
                    return [item[0]*1000, parseFloat(item[1])*100]
                })
            } else {
                trimmed = results.map(item => {
                    return [item[0]*1000, parseFloat(item[1])]
                })
            }
            trimmed.sort(function(a,b) { return a[0] > b[0] })
            const limited = res['positions'] ? res['positions'].map((position) => ({
                'symbol': position['symbol'],
                'profit': position['profit'],
                'profitPercent': position['profitPercent']
            })) : [];

            const { equity, change, positions, data, limitedPositions } = this.state

            equity[i] = parseFloat(res['equity'])
            change[i] = parseFloat(res['change'])
            positions[i] = res['positions']
            data[i] = trimmed
            limitedPositions[i] = limited
            this.setState({
                equity,
                change,
                positions,
                data,
                limitedPositions
            })
        })
        .catch((e) => {
            alert(e)
            console.log(e);
        });
      }
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
    this.getData()
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
                    data: this.state.data && this.state.data.length > 0 && this.state.data[0] ? this.state.data[0] : [],
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    name: 'Sentiment',
                    data: this.state.data && this.state.data.length > 1 && this.state.data[1] ? this.state.data[1] : [],
                    tooltip: {
                        valueDecimals: 2
                    },
                },
                {
                    name: 'BSS',
                    data: this.state.data && this.state.data.length > 2 && this.state.data[2] ? this.state.data[2] : [],
                    tooltip: {
                        valueDecimals: 2
                    },
                },
                {
                    name: 'RSA',
                    data: this.state.data && this.state.data.length > 3 && this.state.data[3] ? this.state.data[3] : [],
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
                selected: 2,
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
    //   const { equityBSS, changeBSS, positionsBSS, limitedPositionsBSS, equity, equityS, changeS, positionsS, limitedPositionsS, change, positions, isDesktop, limitedPositions } = this.state;
      const { isDesktop, equity, change, positions, data, limitedPositions } = this.state
      
      const formattedEquity = []
      const percentChange = []
      const formattedChange = []
      const overallChange = []
      const overallPercent = []
      const formattedOverall = []

      for (let i = 0; i < equity.length; i++) {
          formattedEquity.push(Trader.formatDollar(equity[i]))
          percentChange.push(((change[i] * 100 )/ equity[i]).toFixed(2))
          formattedChange.push(Trader.formatDollar(change[i]))
          let originalValue = i <= 1 ? 100000 : 1000
          overallChange.push(equity[i] - originalValue)
          overallPercent.push(((overallChange[i] * 100) / originalValue).toFixed(2))
          formattedOverall.push(Trader.formatDollar(overallChange[i]))
      }

    return (
      <div>
        <Helmet>
          <title>Jafer Haider -- Reddit Algo Trader</title>
          <meta name="description" content="Algo trader using stock popularity on Reddit"/>
          <link rel="canonical" href="http://itsjafer.com/#/trader" />
        </Helmet>
        <p>This page is a dashboard to monitor performance of three algorithmic day traders I'm currently paper testing. <b>Start date: February 23, 2021</b></p>

        <p><span style={{"color": "#368fe2"}}><b>Occurrences:</b></span> finds the top 10 most mentioned stocks on reddit and rebalances the portfolio around them every minute</p>
        <p><b>Sentiment:</b> finds the top 10 stocks with the highest sentiment rating on reddit and rebalances the portfolio around them every 5 minutes</p>
        <p><span style={{"color": "#5ec26a"}}><b>BSS</b></span>: Stock selection based on the views of a specific individual.</p>
        <p><span style={{"color": "#f7a35c"}}><b>RSA</b></span>: Stock selection based on <a href="twitter.com/reverseSplitArb"> reverse split arbitrage</a></p>
        <div>
    
        {
          !equity[0] && 'Loading...'
        }
        {   equity[0] && (
            <div className="occurrences">
                <h2>{formattedEquity[0]}</h2>
        <h4>{change[0] >= 0 ? "+" + formattedChange[0] : formattedChange[0]} ({percentChange[0] +"%"}) today</h4>
                <h4>{overallChange[0] >= 0 ? "+" + formattedOverall[0] : formattedOverall[0]} ({overallPercent[0] +"%"}) all time</h4>
            </div>
            )
        }
        {
          !equity[2] && 'Loading...'
        }
        {   equity[2] && (
            <div className="bss">
                <h2>{formattedEquity[2]}</h2>
        <h4>{change[2] >= 0 ? "+" + formattedChange[2] : formattedChange[2]} ({percentChange[2] +"%"}) today</h4>
                <h4>{overallChange[2] >= 0 ? "+" + formattedOverall[2] : formattedOverall[2]} ({overallPercent[2] +"%"}) all time</h4>
            </div>
            )
        }
        </div>
        <div>
        {
          !equity[1] && 'Loading...'
        }
        {   equity[1] && (
            <div className="sentiment">
                <h2>{formattedEquity[1]}</h2>
        <h4>{change[1] >= 0 ? "+" + formattedChange[1] : formattedChange[1]} ({percentChange[1] +"%"}) today</h4>
                <h4>{overallChange[1] >= 0 ? "+" + formattedOverall[1] : formattedOverall[1]} ({overallPercent[1] +"%"}) all time</h4>
            </div>
            )
        }
        {
          !equity[3] && 'Loading...'
        }
        {   equity[3] && (
            <div className="rsa">
                <h2>{formattedEquity[3]}</h2>
        <h4>{change[3] >= 0 ? "+" + formattedChange[3] : formattedChange[3]} ({percentChange[3] +"%"}) today</h4>
                <h4>{overallChange[3] >= 0 ? "+" + formattedOverall[3] : formattedOverall[3]} ({overallPercent[3] +"%"}) all time</h4>
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
                    positions[0] && (
                        <ReactTable
                        data={isDesktop ? positions[0] : limitedPositions[0]}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positions[0].length}
                        showPaginationBottom={false}
                        showPageSizeOptions={false}
                        />
                        )
                    }
                </TabPanel>
                <TabPanel>
                {
                    positions[1] && (
                        <ReactTable
                        data={isDesktop ? positions[1] : limitedPositions[1]}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positions[1].length}
                        showPaginationBottom={false}
                        showPageSizeOptions={false}
                        />
                        )
                    }
                </TabPanel>
                <TabPanel>
                {
                    positions[2] && (
                        <ReactTable
                        data={isDesktop ? positions[2] : limitedPositions[2]}
                        columns={isDesktop ? positionColumns : limitedColumns}
                        defaultPageSize={positions[2].length}
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
