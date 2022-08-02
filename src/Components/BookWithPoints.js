import React, { Component } from 'react';
import 'react-table/react-table.css';
import moment_ from "moment"
import airportsDb from "./airports.json"
import "react-datepicker/dist/react-datepicker.css";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button, DatePicker, Form, Input, Table, Tag, Tooltip, Select, Alert, Typography, Divider } from 'antd';

import { value } from 'react-json-pretty/dist/monikai';
const { Title, Paragraph, Text, Link } = Typography;
const moment = moment_

class BookWithPoints extends Component {
    constructor(props) {
        super(props);

        let airlines = ["united", "delta", "aeroplan", "southwest", "jetblue", "chase", "virgin", "aa", "alaska"]
        let defaultQuery = {origin: "ORD - Chicago", destination:"LGA - New York", departureDate: moment().add("1", "day").format("YYYY-MM-DD"), airlines: airlines}

        this.state = {
          loading: new Set(),
          failed: new Set(),
          southwest: null,
          united: null,
          chase: null,
          searchQuery: JSON.parse(localStorage.getItem("searchQuery") || JSON.stringify(defaultQuery)),
          results: [],
          isDesktop: false,
          allAirlines: airlines,
          airlines: [],
        };

        this.updatePredicate = this.updatePredicate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

      }

  reduceToBestFarePerCabin = (flight) => {
    const scraperFares = {}
    flight.fares.forEach((fare) => {
      if (!scraperFares[`${fare.scraper}${fare.cabin}`] || fare.miles < scraperFares[`${fare.scraper}${fare.cabin}`].miles)
        scraperFares[`${fare.scraper}${fare.cabin}`] = fare
    })
  
    return { ...flight, fares: Object.values(scraperFares) }
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 800 });
  }

  // Merges properties of FlightWithFares into unique FlightWithFares by flightNo
mergeFlightsByFlightNo = (scraperResults) => {
  const flights = []
  scraperResults.forEach((scraperResult) => {
    // Try to first match by flight number
    let existingFlight = flights.find((flight) => flight.flightNo === scraperResult.flightNo)

    if (existingFlight) {
      for (const key in scraperResult) {
        if (existingFlight[key] === undefined) {
          // @ts-ignore
          existingFlight[key] = scraperResult[key]
        }
      }

      // Append in the fares
      existingFlight.fares.push(...scraperResult.fares)
    } else {
      flights.push(scraperResult)
    }
  })

  return flights
}

  handleSubmit(values) {

    const allCombinations = (origins, destinations) => {
      return origins.flatMap(d => destinations.map(v => v == d ? [] : [d, v]))
    }
    const getAirline = (x, requestOptions) => {
      const cloudFunctionsAirlines = new Set(["united", "aa", "alaska"])
      this.setState(({ loading }) => ({
        loading: new Set(loading).add(x)
      }));
      fetch((cloudFunctionsAirlines.has(x) ? 'https://us-central1-flightawards.cloudfunctions.net/': 'https://airline-scraper-ccjl4xchpq-uc.a.run.app/') + x, requestOptions)
      .then(response => response.json())
      .then((data) => {
        let fullData = [...this.state.results, ...data ]
        let cleanData = fullData.map((flight) => this.reduceToBestFarePerCabin(flight))
  
        let finalData = this.mergeFlightsByFlightNo(cleanData)
        this.setState({ results: finalData})
        this.setState(({ loading }) => {
          const newLoading = new Set(loading);
          newLoading.delete(x);
          return {
           loading: newLoading
          };
        });
      })
      .catch((e) => {
        this.setState(({ loading, failed }) => {
          const newLoading = new Set(loading);
          newLoading.delete(x);
          return {
           loading: newLoading,
           failed: new Set(failed).add(x)
          };
        });
      })
    }

    console.log(values)
    this.setState({
      searchQuery: { origin: values['origin'], destination: values['destination'], departureDate: values['departureDate'].format("YYYY-MM-DD"), airlines:values['airlines']},
      results: [],
      loading: new Set(),
      failed: new Set(),
      airlines: values['airlines']
    })
    localStorage.setItem("searchQuery", JSON.stringify(this.state.searchQuery))
    console.log(values['origin'], values['destination'])
    const pairs = allCombinations(values['origin'], values['destination'])
    const pairPromises = pairs.map(pair => {
      if (pair.length == 0) {
        return
      }
      const formData = new FormData();
      formData.append("origin", pair[0].split('-')[0].trim())
      formData.append("destination", pair[1].split('-')[0].trim())
      formData.append("date", values['departureDate'].format("YYYY-MM-DD"))
      const requestOptions = {
        method: 'POST',
        body: formData
      };
      
      const funcs = this.state.airlines.map(airline => getAirline(airline, requestOptions))
      try {
        Promise.all(funcs);
      } catch (err) {
        console.log(err);
      }
    })
    Promise.all(pairPromises)

  }

  render() {
    const lowestFare = (fares, cabin) => {
      const faresForClass = fares?.filter((fare) => fare.cabin === cabin)
      if (!faresForClass || faresForClass.length === 0)
        return null
      return faresForClass.reduce((smallest, cur) => ((cur.miles + cur.cash * 100) < (smallest.miles + smallest.cash * 100) ? cur : smallest))
    }
  
    const airlineLogoUrl = (airlineCode) => {
      return airlineCode === "WN" ? "https://www.southwest.com/favicon.ico" : `https://www.gstatic.com/flights/airline_logos/35px/${airlineCode}.png`
    }

    const smallColumns = [
      {
        title: "Flight",
        dataIndex: "flightNo",
        sorter: (recordA, recordB) => recordA.flightNo.localeCompare(recordB.flightNo),
        render: (flightNo) => (
          <>
            <img style={{ height: 16, marginBottom: 3, borderRadius: 3 }} src={airlineLogoUrl(flightNo.substring(0, 2))} alt={flightNo.substring(0, 2)} />
            <span style={{ marginLeft: 8 }}>{flightNo} ({(flightNo.split(",").length - 1) > 0 ? (flightNo.split(",").length - 1) == 1 ? '1 stop' : `${flightNo.split(",").length -1} stops` : 'nonstop'})</span>
          </>
        )
      },
      ...[{ title: "Economy", key: "economy" }, { title: "Business", key: "business" }, { title: "First", key: "first" }].filter((col) => this.state.results?.some((res) => res.fares.some((fare) => fare.cabin === col?.key))).map((column) => ({
        title: column.title,
        key: column.key,
        render: (_text, record) => {
          const smallestFare = lowestFare(record.fares, column.key)
          if (!smallestFare)
            return ""
  
          const milesStr = Math.round(smallestFare.miles).toLocaleString()
          const cashStr = smallestFare.cash.toLocaleString("en-US", { style: "currency", currency: smallestFare.currencyOfCash ?? "", maximumFractionDigits: 0 })
  
          const tooltipContent = record.fares
            .filter((fare) => fare.cabin === column.key)
            .sort((a, b) => (a.miles + a.cash * 100) - (b.miles + b.cash * 100))
            .map((fare) => fare.scraper == "Chase Ultimate Rewards" ? <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()} or {(fare.miles * 1.25 / 100).toLocaleString("en-US", { style: "currency", currency: fare.currencyOfCash ?? "", maximumFractionDigits: 0 })} {` (${fare.bookingClass || "?"})`}</div> : <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()} + {fare.cash.toLocaleString("en-US", { style: "currency", currency: fare.currencyOfCash ?? "", maximumFractionDigits: 0 })} {` (${fare.bookingClass || "?"})`}</div>)
  
          return <Tooltip title={tooltipContent} mouseEnterDelay={0} mouseLeaveDelay={0}><Tag color={"green"}>{milesStr}{` + ${cashStr}`}</Tag></Tooltip>
        },
        sorter: (recordA, recordB) => {
          const fareAMiles = ((lowestFare(recordA.fares, column.key)?.miles) + (lowestFare(recordA.fares, column.key)?.cash * 100)) ?? Number.MAX_VALUE
          const fareBMiles = ((lowestFare(recordB.fares, column.key)?.miles) + (lowestFare(recordB.fares, column.key)?.cash * 100)) ?? Number.MAX_VALUE
          return fareAMiles - fareBMiles
        },
      }))
    ]
    const columns = [
      {
        title: "Flight",
        dataIndex: "flightNo",
        sorter: (recordA, recordB) => recordA.flightNo.localeCompare(recordB.flightNo),
        render: (flightNo) => (
          <>
            <img style={{ height: 16, marginBottom: 3, borderRadius: 3 }} src={airlineLogoUrl(flightNo.substring(0, 2))} alt={flightNo.substring(0, 2)} />
            <span style={{ marginLeft: 8 }}>{flightNo} ({(flightNo.split(",").length - 1) > 0 ? (flightNo.split(",").length - 1) == 1 ? '1 stop' : `${flightNo.split(",").length -1} stops` : 'nonstop'})</span>
          </>
        )
      },
      {
        title: "From",
        dataIndex: "origin",
        sorter: (recordA, recordB) => recordA.origin.localeCompare(recordB.origin),
      },
      {
        key: "departure",
        render: (_text, record) => moment(record.departureDateTime).format("M/D"),
      },
      {
        title: "Departure",
        dataIndex: "departureDateTime",
        render: (text) => moment(text).format("h:mm A"),
        sorter: (recordA, recordB) => moment(recordA.departureDateTime).diff(moment(recordB.departureDateTime)),
        defaultSortOrder: "ascend",
      },
      {
        title: "Arrival",
        dataIndex: "arrivalDateTime",
        render: (_text, record) => `${moment(record.arrivalDateTime).format("h:mm A")} ${moment(record.arrivalDateTime).isAfter(moment(record.departureDateTime), "day") ? " (+1)" : ""} ${record.duration > 30 ? ("(" + Math.round(record.duration / 60) + (record.duration > 90 ? " hours)" : "hour)")) : ""}`,
        sorter: (recordA, recordB) => moment(recordA.arrivalDateTime).diff(moment(recordB.arrivalDateTime)),
      },
      {
        title: "Dest",
        dataIndex: "destination",
        sorter: (recordA, recordB) => recordA.destination.localeCompare(recordB.destination),
      },
      ...[{ title: "Economy", key: "economy" }, { title: "Business", key: "business" }, { title: "First", key: "first" }].filter((col) => this.state.results?.some((res) => res.fares.some((fare) => fare.cabin === col?.key))).map((column) => ({
        title: column.title,
        key: column.key,
        render: (_text, record) => {
          const smallestFare = lowestFare(record.fares, column.key)
          if (!smallestFare)
            return ""
  
          const milesStr = Math.round(smallestFare.miles).toLocaleString()
          const cashStr = smallestFare.cash.toLocaleString("en-US", { style: "currency", currency: smallestFare.currencyOfCash ?? "", maximumFractionDigits: 0 })
  
          const tooltipContent = record.fares
            .filter((fare) => fare.cabin === column.key)
            .sort((a, b) => (a.miles + a.cash * 100) - (b.miles + b.cash * 100))
            .map((fare) => fare.scraper == "Chase Ultimate Rewards" ? <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()} or {(fare.miles * 1.25 / 100).toLocaleString("en-US", { style: "currency", currency: fare.currencyOfCash ?? "", maximumFractionDigits: 0 })} {` (${fare.bookingClass || "?"})`}</div> : <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()} + {fare.cash.toLocaleString("en-US", { style: "currency", currency: fare.currencyOfCash ?? "", maximumFractionDigits: 0 })} {` (${fare.bookingClass || "?"})`}</div>)
  
          return <Tooltip title={tooltipContent} mouseEnterDelay={0} mouseLeaveDelay={0}><Tag color={"green"}>{milesStr}{` + ${cashStr}`}</Tag></Tooltip>
        },
        sorter: (recordA, recordB) => {
          const fareAMiles = ((lowestFare(recordA.fares, column.key)?.miles) + (lowestFare(recordA.fares, column.key)?.cash * 100)) ?? Number.MAX_VALUE
          const fareBMiles = ((lowestFare(recordB.fares, column.key)?.miles) + (lowestFare(recordB.fares, column.key)?.cash * 100)) ?? Number.MAX_VALUE
          return fareAMiles - fareBMiles
        },
      }))
    ]

    const initialValuesWithMoment = { ...this.state.searchQuery, departureDate: moment(this.state.searchQuery.departureDate) }

    return (
        <div>
          <Typography>
          <Title>BookWithPoints</Title>
          <Paragraph>
            Welcome! This is a tool I've created that aggregates flight fares based on how much it would cost to book using points. Different airlines have different ways of calculating award fares and I find it tedious to manually check websites one-by-one; this tool is an alternative approach.
          </Paragraph>

          <Text italic>Searches can be as fast as a second or as long as 2 minutes depending on the query.</Text>

          <Divider />

          </Typography>
        <div className="search">
          <Form
            name="flightsearch"
            initialValues={initialValuesWithMoment}
            onFinish={(values) => this.handleSubmit(values)}
            autoComplete="on"
            layout={this.state.isDesktop ? "inline" : "vertical"} 
            >
            <Form.Item name="origin" rules={[{required: true}]} style={this.state.isDesktop ? { width: 200, marginRight: 5, marginBottom: 0} : { width: "100%", marginRight: 5, marginBottom: 0 }}>
                {/* <Input placeholder='origin'/> */}
                <Select
                  showSearch
                  optionFilterProp="value"
                  mode='multiple'
                  >
                  { airportsDb.map(airport => airport.IATA.length == 3 ? <Select.Option value={`${airport.IATA} - ${airport.city}`}key={airport.IATA}>{airport.IATA} - {airport.city}</Select.Option> : null)}
                </Select>
            </Form.Item>
            <Form.Item name="destination" rules={[{required: true}]} style={this.state.isDesktop ? { width: 200, marginRight: 5, marginBottom: 0} : { width: "100%", marginRight: 5, marginBottom: 0 }}>
                <Select
                  showSearch
                  optionFilterProp="value"
                  mode='multiple'
                  >
                  { airportsDb.map(airport => airport.IATA.length == 3 ? <Select.Option value={`${airport.IATA} - ${airport.city}`} key={airport.IATA}>{airport.IATA} - {airport.city}</Select.Option> : null)}
                </Select>
            </Form.Item>
            <Form.Item name="departureDate" style = {{marginBottom: 0, marginRight: 5}}><DatePicker style= {this.state.isDesktop ? { width: 200} : { width: "100%"}} disabledDate={(current) => current.isBefore(moment().subtract(1, "day"))} allowClear={false} /></Form.Item>
            <Form.Item name="airlines" rules={[{required: true}]} style={{ marginRight: 5, marginBottom: 0 }}>
              <Select listHeight={300} maxTagCount={"responsive"} mode="multiple" style={this.state.isDesktop ? { width: 250} : { width: "100%"}}  >
                {this.state.allAirlines.map(airline => <Select.Option key={airline} value={airline}>{airline}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item style={this.state.isDesktop ? { width: 50, marginLeft: 0, marginBottom: 0} : { width: "100%" }}><Button type="primary" htmlType="submit" style={this.state.isDesktop ? {} : { width: "100%"}} loading={this.state.loading.size > 0} >Search</Button></Form.Item>
          </Form>
        </div>
        <div className='results'>
        {[...this.state.loading].map((name) => {
          return <Alert key={name} message={`${name} loading...`} type="info" showicon banner closable size="small"/>
        })}
        {[...this.state.failed].map((name) => {
          return <Alert key={name} message={`${name} failed to load (or no award tickets were found).`} type="warning" showicon banner closable size="small"/>
        })}
        <Table
          dataSource={this.state.results}
          columns={this.state.isDesktop ? columns : smallColumns}
          rowKey={(record) => record.flightNo}
          size="small"
          loading={this.state.loading.size > 0 && this.state.loading.size >= this.state.airlines - 1}
          showSorterTooltip={false}
          pagination={true}
          scroll={{ y: 500 }}
          className="search-results"
          style={this.state.isDesktop ? {} : {marginBottom: 200}}
        />
        </div>
        </div>
      );
  }
}

export default BookWithPoints;
