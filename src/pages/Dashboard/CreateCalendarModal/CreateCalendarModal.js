import React from "react";
import classes from "../CreateCalendarModal/CreateCalendarModal.module.css";
import { AuthConsumer } from "../../../contexts/AuthContext";

class CreateCalendarModal extends React.Component {
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
					<div
						className={classes.modalWrapper}
						style={{ display: this.props.modalOpen ? "block" : "none" }}>
						<div className={classes.modalBody}>
							<div className={classes.modalHeader}>
								<span
									className={classes.modalClose}
									onClick={this.props.toggleModal}>
									&times;
								</span>
							</div>
							<div>
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
									<button className={classes.buttonDefault} type="submit">
										Create new calendar
									</button>
								</form>
							</div>
						</div>
					</div>
				)}
			</AuthConsumer>
		);
	}
}

export default CreateCalendarModal;
