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
      positions: null
    };
    this.updatePredicate = this.updatePredicate.bind(this);
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
            return [moment(item['date']).subtract(6, 'h').valueOf(), parseFloat(item['equity'])]
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
    this.timer = setInterval(() => {
        this.getCurrentData()
    }, 30*1000)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
    clearInterval(this.timer);
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
          series: [{
              name: 'Portfolio',
              data: this.state.data,
              tooltip: {
                  valueDecimals: 2
              }
          }]
      };
      const { equity, change, positions, isDesktop, limitedPositions } = this.state;
      const formattedEquity = Trader.formatDollar(equity)
      const percentChange = ((change * 100 )/ equity).toFixed(2)
      const formattedChange = Trader.formatDollar(change)
      const overallChange = equity - 100000;
      const overallPercent = ((overallChange * 100) / equity).toFixed(2)
      const formattedOverall = Trader.formatDollar(overallChange);

    return (
      <div>
        <Helmet>
          <title>Jafer Haider -- Reddit Algo Trader</title>
          <meta name="description" content="Algo trader using stock popularity on Reddit"/>
          <link rel="canonical" href="http://itsjafer.com/#/trader" />
        </Helmet>
        <p>This page is an interface for an algorithmic day trader I'm currently paper testing. On this page, you will see the portfolio performance and current holdings. This is updated every 30 seconds while this page is open and every 15 minutes otherwise. The algorithm liquidates all positions at market close.</p>        
        
        {   equity && (
            <div>
                <h2>{formattedEquity}</h2>
        <h4>{change >= 0 ? "+" + formattedChange : formattedChange} ({percentChange +"%"}) since last close</h4>
                <h4>{overallChange >= 0 ? "+" + formattedOverall : formattedOverall} ({overallPercent +"%"}) all time</h4>
            </div>
            )
        }
        <ReactHighcharts config={config}></ReactHighcharts>
        {
            positions && (
                <div>
                <h4>Current Holdings</h4>

                <ReactTable
                data={isDesktop ? positions : limitedPositions}
                columns={isDesktop ? positionColumns : limitedColumns}
                defaultPageSize={positions.length}
                showPaginationBottom={false}
                showPageSizeOptions={false}
                />
                </div>
            )
        }
        </div>
    );
  }
}

export default Trader;
