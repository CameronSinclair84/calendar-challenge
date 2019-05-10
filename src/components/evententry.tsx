import * as React from "react";
import styles from "./evententry.module.scss";
import { ICalendarEvents, toggleEvent } from "../reducers/calendarReducer";
import { connect } from "react-redux";
import { IStore } from "../reducers";

export interface IReactProps {
  calendarEvent: ICalendarEvents;
}

export interface IReduxProps {
  selectedEvents: ICalendarEvents[];
  toggleEvent: (event: ICalendarEvents) => void;
}

export interface IState {
  //  isClicked: boolean;
}

class EventEntry extends React.PureComponent<
  IReactProps & IReduxProps,
  IState
> {
  public state = {
    //   isClicked: false
  };

  public componentDidUpdate(prevProps: IReduxProps) {
    if (this.props.selectedEvents !== prevProps.selectedEvents) {
      console.log("props changed");
      this.forceUpdate();
    }
  }

  public handleClick = () => {
    this.props.toggleEvent(this.props.calendarEvent);
    //   this.setState({ isClicked: !this.state.isClicked });
    this.forceUpdate();
  };

  public render() {
    const amIClicked =
      this.props.selectedEvents.indexOf(this.props.calendarEvent) !== -1
        ? styles.eventInfoClicked
        : styles.eventInfo;
    const displayStart = this.props.calendarEvent.start.dateTime
      ? new Date(this.props.calendarEvent.start.dateTime)
          .toString()
          .slice(0, 25)
      : new Date(this.props.calendarEvent.start.date).toString().slice(0, 15) +
        " (No time specified)";
    const displayEnd = this.props.calendarEvent.end.dateTime
      ? new Date(this.props.calendarEvent.start.dateTime)
          .toString()
          .slice(0, 25)
      : new Date(this.props.calendarEvent.end.date).toString().slice(0, 15) +
        " (No time specified)";
    return (
      <React.Fragment>
        <div className={amIClicked} onClick={this.handleClick}>
          <section className={styles.eventTitle}>
            <div className={styles.title}>
              {this.props.calendarEvent.summary}
            </div>
          </section>

          <section className={styles.description}>
            Starts on:
            <br /> {displayStart}
            <br />
            Ends on: <br /> {displayEnd}
          </section>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IStore, props: IReactProps) => {
  return {
    selectedEvents: state.calendar.mySelectedEvents
  };
};

const mapDispatchToProps = { toggleEvent };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventEntry);
