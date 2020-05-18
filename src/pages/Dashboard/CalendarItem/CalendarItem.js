import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classes from "../CalendarItem/CalendarItem.module.css";

class CalendarItem extends Component {
	goToCalendar = () => {
		const calendarId = this.props.calendar.id;
		this.props.history.push({
			pathname: `/calendar/${calendarId}`,
		});
	};
	render() {
		return (
			<div className={classes.calendarItem} onClick={this.goToCalendar}>
				<div className={classes.calendarListItem}>
					{this.props.calendar.title}
				</div>
			</div>
		);
	}
}

CalendarItem.propTypes = {
	calendar: PropTypes.object.isRequired,
};

export default withRouter(CalendarItem);
