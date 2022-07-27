import React, { Component } from 'react';
import 'react-table/react-table.css';
import moment_ from "moment"

import "react-datepicker/dist/react-datepicker.css";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Button, DatePicker, Form, Input, Table, Tag, Tooltip, Spin } from 'antd';
import { value } from 'react-json-pretty/dist/monikai';
const moment = moment_

class BookWithPoints extends Component {
    constructor(props) {
        super(props);

        let defaultQuery = {origin: "ORD", destination:"LGA", departureDate: moment().add("1", "day").format("YYYY-MM-DD")}

        this.state = {
          loading: 0,
          southwest: null,
          united: null,
          chase: null,
          searchQuery: JSON.parse(localStorage.getItem("searchQuery") || JSON.stringify(defaultQuery)),
          results: [],
          isDesktop: false,
        };

        this.updatePredicate = this.updatePredicate.bind(this);

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
    let airlines = ["united", "delta", "aeroplan", "southwest", "jetblue", "chase"]
    this.setState({
      searchQuery: { origin: values['origin'], destination: values['destination'], departureDate: values['departureDate'].format("YYYY-MM-DD")},
      results: [],
    })
    localStorage.setItem("searchQuery", JSON.stringify(this.state.searchQuery))
    const formData = new FormData();
    formData.append("origin", values['origin'])
    formData.append("destination", values['destination'])
    console.log(values['departureDate'].format("YYYY-MM-DD"))
    formData.append("date", values['departureDate'].format("YYYY-MM-DD"))
    const requestOptions = {
    method: 'POST',
    body: formData
    };
    for (let x of airlines) {
      this.setState({ loading: this.state.loading+1 })
      fetch('https://airline-scraper-ccjl4xchpq-uc.a.run.app/' + x, requestOptions)
      .then(response => response.json())
      .then((data) => {
        let fullData = [...this.state.results, ...data ]
        let cleanData = fullData.map((flight) => this.reduceToBestFarePerCabin(flight))

        let finalData = this.mergeFlightsByFlightNo(cleanData)
        this.setState({ results: finalData})
        this.setState({ loading: this.state.loading-1 })
      })
      .catch((e) => {
        this.setState({ loading: this.state.loading-1})
      })
    }
  }

  render() {
    const lowestFare = (fares, cabin) => {
      const faresForClass = fares?.filter((fare) => fare.cabin === cabin)
      if (!faresForClass || faresForClass.length === 0)
        return null
      return faresForClass.reduce((smallest, cur) => (cur.miles < smallest.miles ? cur : smallest))
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
            <span style={{ marginLeft: 8 }}>{flightNo} ({flightNo.split(",").length -1} stops)</span>
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
            .sort((a, b) => a.miles - b.miles)
            .map((fare) => <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()}{` (${fare.bookingClass || "?"})`}</div>)
  
          return <Tooltip title={tooltipContent} mouseEnterDelay={0} mouseLeaveDelay={0}><Tag color={"green"}>{milesStr}{` + ${cashStr}`}</Tag></Tooltip>
        },
        sorter: (recordA, recordB) => {
          const fareAMiles = lowestFare(recordA.fares, column.key)?.miles ?? Number.MAX_VALUE
          const fareBMiles = lowestFare(recordB.fares, column.key)?.miles ?? Number.MAX_VALUE
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
            <span style={{ marginLeft: 8 }}>{flightNo} ({flightNo.split(",").length -1} stops)</span>
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
        render: (_text, record) => `${moment(record.arrivalDateTime).format("h:mm A")} ${moment(record.arrivalDateTime).isAfter(moment(record.departureDateTime), "day") ? " (+1)" : ""} (${record.duration})`,
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
            .sort((a, b) => a.miles - b.miles)
            .map((fare) => <div key={`${fare.scraper}${record.flightNo}${fare.cabin}${fare.miles}`}>{fare.scraper}: {Math.round(fare.miles).toLocaleString()}{` (${fare.bookingClass || "?"})`}</div>)
  
          return <Tooltip title={tooltipContent} mouseEnterDelay={0} mouseLeaveDelay={0}><Tag color={"green"}>{milesStr}{` + ${cashStr}`}</Tag></Tooltip>
        },
        sorter: (recordA, recordB) => {
          const fareAMiles = lowestFare(recordA.fares, column.key)?.miles ?? Number.MAX_VALUE
          const fareBMiles = lowestFare(recordB.fares, column.key)?.miles ?? Number.MAX_VALUE
          return fareAMiles - fareBMiles
        },
      }))
    ]

    const initialValuesWithMoment = { ...this.state.searchQuery, departureDate: moment(this.state.searchQuery.departureDate) }

    return (
        <div>
        <div className="search">
          <Form
            name="flightsearch"
            initialValues={initialValuesWithMoment}
            onFinish={(values) => this.handleSubmit(values)}
            autoComplete="on"
            layout={this.state.isDesktop ? "inline" : "vertical"} 
            >
            <Form.Item name="origin" rules={[{required: true}]} style={{ width: 100, marginRight: 5, marginBottom: 0}}>
                <Input placeholder='origin'/>
            </Form.Item>
            <Form.Item name="destination" rules={[{required: true}]} style={{ width: 100, marginRight: 5, marginBottom: 0 }}>
                <Input placeholder='destination' />
            </Form.Item>
            <Form.Item name="departureDate" style={{ marginRight: 5 }}><DatePicker disabledDate={(current) => current.isBefore(moment().subtract(1, "day"))} allowClear={false} /></Form.Item>
            <Form.Item style={{ marginLeft: 0 }}><Button type="primary" htmlType="submit" loading={this.state.loading > 0} >Search</Button></Form.Item>
          </Form>
        </div>
        <div className='results'>
        <Table
          dataSource={this.state.results}
          columns={this.state.isDesktop ? columns : smallColumns}
          rowKey={(record) => record.flightNo}
          size="small"
          loading={this.state.loading >= 3}
          showSorterTooltip={false}
          pagination={false}
          className="search-results"
          style={{ whiteSpace: "nowrap" }}
        />
        </div>
        </div>
      );
  }
}

export default BookWithPoints;
