import * as React from "react";
import { connect } from "react-redux";
import { fetchCalendar, ICalendarEvents } from "../reducers/calendarReducer";
import { IStore } from "../reducers";
import styles from "./eventcontainer.module.scss";
import logo from "../logo.jpg";
import EventEntry from "../components/evententry";
import DatePicker from "react-datepicker";

export interface IReactProps {}

export interface IReduxProps {
  fetchCalendar: () => void;
  allEvents: ICalendarEvents[];
}

export interface IState {
  startDate: Date;
  endDate: Date;
  filteredEvents: ICalendarEvents[];
  firstLoad: boolean;
  searchText: string;
}

class EventContainer extends React.Component<
  IReactProps & IReduxProps,
  IState
> {
  public state = {
    searchText: "",
    firstLoad: true,
    filteredEvents: this.props.allEvents,
    startDate: new Date(
      new Date(new Date().getFullYear(), 0, 1).setHours(0, 0, 0, 0)
    ),
    endDate: new Date(new Date().getFullYear(), 12, 0)
  };

  public componentDidMount = () => {
    this.props.fetchCalendar();
  };

  public handleStartDateChange = (evt: any) => {
    this.setState(
      {
        firstLoad: false,
        startDate: new Date(new Date(evt).setHours(0, 0, 0, 0))
      },
      () =>
        this.handleFilter(
          this.state.startDate,
          this.state.endDate,
          this.state.searchText
        )
    );
  };

  public handleEndDateChange = (evt: any) => {
    this.setState(
      {
        firstLoad: false,
        endDate: new Date(new Date(evt).setHours(23, 59, 59, 0))
      },
      () =>
        this.handleFilter(
          this.state.startDate,
          this.state.endDate,
          this.state.searchText
        )
    );
  };

  public handleSearchChange = (evt: any) => {
    this.setState(
      {
        firstLoad: false,
        searchText: evt.target.value
      },
      () =>
        this.handleFilter(
          this.state.startDate,
          this.state.endDate,
          this.state.searchText
        )
    );
  };

  public handleFilter(startDate: Date, endDate: Date, searchTxt: string) {
    this.setState({
      filteredEvents: this.props.allEvents.filter(
        (eachEvent: ICalendarEvents) => {
          const elementStart = eachEvent.start.dateTime
            ? new Date(eachEvent.start.dateTime)
            : new Date(eachEvent.start.date);

          if (
            elementStart >= startDate &&
            elementStart <= endDate &&
            eachEvent.summary.toLowerCase().includes(searchTxt.toLowerCase())
          ) {
            return true;
          } else return false;
        }
      )
    });
  }

  public sortEvents = () => {
    this.props.allEvents.sort((element1, element2) => {
      let element1Date;
      let element2Date;
      element1.start.dateTime
        ? (element1Date = new Date(element1.start.dateTime))
        : (element1Date = new Date(element1.start.date));

      element2.start.dateTime
        ? (element2Date = new Date(element2.start.dateTime))
        : (element2Date = new Date(element2.start.date));

      if (element1Date > element2Date) {
        return 1;
      } else {
        return -1;
      }
    });
  };

  public render() {
    // Sort events into correct date order, do this the first time only
    console.log(this.props.allEvents);
    if (this.state.firstLoad) {
      this.sortEvents();
    }

    const displayEvents = this.state.firstLoad
      ? this.props.allEvents.map((eachEvent, index) => (
          <EventEntry key={index} calendarEvent={eachEvent} />
        ))
      : this.state.filteredEvents.map((eachEvent, index) => (
          <EventEntry key={index} calendarEvent={eachEvent} />
        ));

    return (
      <React.Fragment>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={logo} height="50px" />
          </div>
          <div className={styles.select}>
            Select Start Date:
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
            />
          </div>
          <div className={styles.select}>
            Select End Date:
            <DatePicker
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
            />
          </div>
          <div className={styles.select}>
            Filter search text:
            <input type="text" onChange={this.handleSearchChange} />
          </div>
        </div>
        <div className={styles.eventcontainer}>{displayEvents}</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IStore, props: IReactProps) => {
  return {
    allEvents: state.calendar.calendarEvents
  };
};

const mapDispatchToProps = { fetchCalendar };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventContainer);
