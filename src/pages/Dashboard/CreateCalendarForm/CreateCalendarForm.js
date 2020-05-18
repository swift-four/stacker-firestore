import React, { Component } from "react";
import PropTypes from "prop-types";
import { AuthConsumer } from "../../../contexts/AuthContext";
import classes from "../CreateCalendarForm/CreateCalendarForm.module.css";

class CreateCalendarForm extends Component {
	state = {
		title: "",
	};

	handleSubmit = (e, userId) => {
		e.preventDefault();
		const calendar = {
			title: this.state.title,
			createdAt: new Date(),
			user: userId,
		};
		if (calendar.title && calendar.user) {
			this.props.createNewCalendar(calendar);
		}
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<form
						className={classes.createCalendarFormWrapper}
						onSubmit={(e) => this.handleSubmit(e, user.id)}>
						<input
							type="text"
							name="name"
							placeholder="Enter Calendar Name"
							//Take the value from the input field for calendar name and set the state
							onChange={(e) => this.setState({ title: e.target.value })}
						/>
						<button type="submit">Create new calendar</button>
					</form>
				)}
			</AuthConsumer>
		);
	}
}

CreateCalendarForm.propTypes = {
	createNewCalendar: PropTypes.func.isRequired,
};

export default CreateCalendarForm;
