import React, { Component } from "react";
import Row from "../Row/Row";
import PropTypes from "prop-types";
import { calendarsRef, rowsRef } from "../../firebase";
import { AuthConsumer } from "../../contexts/AuthContext";
import Toolbar from "../Toolbar/Toolbar";
import Aux from "../Hoc/Aux";
import classes from "./Calendar.module.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

class Calendar extends Component {
	state = {
		currentCalendar: {},
		currentRows: [],
		currentCards: [],
		message: "",
		orderMessage: "default order",
	};

	addCalendarInput = React.createRef();

	componentDidMount() {
		this.getCalendar(this.props.match.params.calendarId);
		this.getRows(this.props.match.params.calendarId);
	}

	getRows = async (calendarId) => {
		try {
			await rowsRef
				.where("row.calendar", "==", calendarId)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							const doc = change.doc;
							const row = {
								id: doc.id,
								title: doc.data().row.title,
							};
							this.setState({
								currentRows: [...this.state.currentRows, row],
							});
						}
						if (change.type === "removed") {
							this.setState({
								currentRows: [
									...this.state.currentRows.filter((row) => {
										return row.id !== change.doc.id;
									}),
								],
							});
						}
					});
				});
		} catch (error) {
			console.log("Error fetching rows:", error);
		}
	};

	getCalendar = async (calendarId) => {
		try {
			const calendar = await calendarsRef.doc(calendarId).get();
			this.setState({ currentCalendar: calendar.data().calendar });
		} catch (error) {
			this.setState({
				message: "Calendar not found...",
			});
		}
	};

	createNewRow = async (e, userId) => {
		try {
			e.preventDefault();
			const row = {
				title: this.addCalendarInput.current.value,
				calendar: this.props.match.params.calendarId,
				createdAt: new Date(),
				user: userId,
			};

			if (row.title && row.calendar) {
				await rowsRef.add({ row });
			}
			this.addCalendarInput.current.value = "";
		} catch (error) {
			console.error("Error creating a new row", error);
		}
	};

	deleteCalendar = async () => {
		const calendarId = this.props.match.params.calendarId;
		this.props.deleteCalendar(calendarId);
		this.setState({
			message: "Calendar not found...",
		});
	};

	updateCalendar = (e) => {
		//Get the calendar idea from the URL parameters
		const calendarId = this.props.match.params.calendarId;
		const newTitle = e.currentTarget.value;

		if (calendarId && newTitle) {
			this.props.updateCalendar(calendarId, newTitle);
		}
	};

	onDragEnd = (result) => {
		const { destination, source, draggableId, type } = result;
		if (!destination) {
			return;
		}
		if (
			destination.draggableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		if (type === "row") {
			const newRowOrder = Array.from(this.state.currentRows);
			newRowOrder.splice(source.index, 1);
			newRowOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...this.state,
				currentRows: newRowOrder,
			};

			this.setState(newState);
		}
	};

	// moveRowUp = () => {

	// 	const newRowOrder = Array.from(this.state.currentRows);
	// 	newRowOrder.splice(source.index, 1);
	// 	newRowOrder.splice(destination.index, 0, draggableId);

	// 	const newState = {
	// 		...this.state,
	// 		columnOrder: newColumnOrder,
	// 	};

	// 	this.setState(newState);
	// 	return;
	// };

	render() {
		//On drag end = compare the previous state of the row order and if its changed, update it, splice the arrays then update state
		// let newOrder = this.state.currentRows;
		// newOrder.sort(function (a, b) {
		// 	return 0.5 - Math.random();
		// });

		return (
			<AuthConsumer>
				{({ user }) => (
					<React.Fragment>
						{user.id === this.state.currentCalendar.user ? (
							<div
								className={classes.calendarWrapper}
								style={{
									backgroundColor: this.state.currentCalendar.background,
								}}>
								{this.state.message === "" ? (
									<Aux>
										<Toolbar deleteCalendar={this.deleteCalendar} />
										<div className={classes.calendarHeader}>
											<input
												className={classes.calendarHeaderInput}
												type="text"
												name="calendarTitle"
												onChange={this.updateCalendar}
												defaultValue={this.state.currentCalendar.title}></input>
										</div>
									</Aux>
								) : (
									<h2 className={classes.calendarWrapperTitle}>
										{this.state.message}
									</h2>
								)}
								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId="all-rows" type="row">
										{(provided) => (
											<div
												className={classes.rowsWrapper}
												{...provided.droppableProps}
												ref={provided.innerRef}>
												{Object.keys(this.state.currentRows).map(
													(key, index) => (
														<Row
															key={this.state.currentRows[key].id}
															row={this.state.currentRows[key]}
															deleteRow={this.props.deleteRow}
															id={this.state.currentRows[key].id}
															cards={this.state.currentCards}
															index={index}
														/>
													)
												)}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
								{/* New row button */}
								<form onSubmit={(e) => this.createNewRow(e, user.id)}>
									<input
										className={classes.newRowWrapperInput}
										type={this.state.message === "" ? "text" : ""}
										name="name"
										ref={this.addCalendarInput}
										placeholder="+ New Row"></input>
								</form>
							</div>
						) : (
							<span></span>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

Calendar.propTypes = {
	deleteCalendar: PropTypes.func.isRequired,
	deleteRow: PropTypes.func.isRequired,
	updateCalendar: PropTypes.func.isRequired,
};

export default Calendar;
