import React, { Component } from "react";
import CalendarItem from "../Dashboard/CalendarItem/CalendarItem";
import PropTypes from "prop-types";
import classes from "../Dashboard/Dashboard.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import CreateCalendarModal from "./CreateCalendarModal/CreateCalendarModal";

class Dashboard extends Component {
	state = {
		modalOpen: false,
	};
	componentDidMount() {
		this.props.getCalendars(this.props.match.params.userId);
	}

	toggleModal = () => {
		this.setState({ modalOpen: !this.state.modalOpen });
	};

	render() {
		return (
			<div className={classes.dashboardWrapper}>
				<div className={classes.dashboardToolbar}>
					<div className={classes.buttonAction}>
						<AiOutlinePlusCircle
							style={{ margin: "8px" }}
							onClick={this.toggleModal}
						/>{" "}
						Create new calendar
					</div>
				</div>
				<div className={classes.calendarPreviewWrapper}>
					<div className={classes.calendarPreviewHeader}>
						<div>
							<h3 className={classes.tableHeading}>NAME</h3>
						</div>
						<div>
							<h3 className={classes.tableHeading}>DESCRIPTION</h3>
						</div>
						<div>
							<h3 className={classes.tableHeading}>USERS</h3>
						</div>
						<div>
							<h3 className={classes.tableHeading}>DELETE</h3>
						</div>
					</div>
					<div className={classes.tableItemsWrapper}>
						{this.props.calendars.map((calendar, key) => (
							<CalendarItem key={key} calendar={calendar} />
						))}
					</div>
				</div>
				<CreateCalendarModal
					createNewCalendar={this.props.createNewCalendar}
					toggleModal={this.toggleModal}
					modalOpen={this.state.modalOpen}
				/>
			</div>
		);
	}
}

Dashboard.propTypes = {
	getCalendars: PropTypes.func.isRequired,
	calendars: PropTypes.array.isRequired,
	createNewCalendar: PropTypes.func.isRequired,
};

export default Dashboard;
