import React, { Component } from "react";
import Row from "../Row/Row";
import PropTypes from "prop-types";
import { calendarsRef, rowsRef } from "../../firebase";
import { AuthConsumer } from "../../contexts/AuthContext";
import Toolbar from "../Toolbar/Toolbar";
import Aux from "../Hoc/Aux";
import classes from "./Calendar.module.css";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

//everytime we drag we need to re render the lists
//I just checked the key to be this.state.currentRows[key]id

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentCalendar: {},
			currentRows: [],
			currentCards: [],
			rowOrder: [], // An array from collection('calendars') that stores the ids of the rows
			message: "",
			isCollapsed: false,
		};
	}

	addCalendarInput = React.createRef();

	componentDidMount() {
		this.getCalendar(this.props.match.params.calendarId);
		this.getRows(this.props.match.params.calendarId);
	}

	componentDidUpdate(prevState) {
		if (this.state.currentRows !== prevState.currentRows) {
			this.updateCalendarRowOrder();
		}
	}

	compareValues(key, order = "asc") {
		return function innerSort(a, b) {
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
				// property doesn't exist on either object
				return 0;
			}

			const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
			const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return order === "desc" ? comparison * -1 : comparison;
		};
	}

	getRows = async (calendarId) => {
		//get rows where the calendarid in equals to the
		try {
			await rowsRef
				.where("row.calendar", "==", calendarId)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							const doc = change.doc;
							const row = {
								id: doc.id,
								orderId: doc.data().row.orderId,
								title: doc.data().row.title,
							};
							this.setState({
								//sort the array based off of order Id // order by the title
								currentRows: [
									...this.state.currentRows.sort(this.compareValues("orderId")),
									row,
								],
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

	updateCalendarRowOrder = async () => {
		const rows = this.state.currentRows;
		if (rows.length !== 0) {
			let i = 0;
			rows.forEach((rowKey) => {
				try {
					const rowId = rowKey.id;
					const orderId = i;
					const row = rowsRef.doc(rowId);
					row.update({ "row.orderId": orderId });
					i++;
				} catch (error) {
					console.error("Error updating row: ", error);
				}
			});
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
			const draggableRow = this.state.currentRows.find(
				(row) => row.id === draggableId
			);
			const newRowOrder = Array.from(this.state.currentRows);
			newRowOrder.splice(source.index, 1);
			newRowOrder.splice(destination.index, 0, draggableRow);

			const newState = {
				...this.state,
				currentRows: newRowOrder,
			};

			this.setState(newState);
			return;
		}
	};

	render() {
		// let newOrderTwo = order.sort(this.compareValues("title"));
		// let copy = [...this.state.currentRows, newOrderTwo]

		// let orderCopy = [...this.state.currentRows];
		// let newOrder = orderCopy.sort(this.compareValues("orderId"));

		// if (this.state.currentRows.length > 0) {
		// 	console.log("New order after sorting", newOrder);
		// }

		return (
			<AuthConsumer>
				{({ user }) => (
					<React.Fragment>
						{user.id === this.state.currentCalendar.user ? (
							<div className={classes.calendarWrapper}>
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
											// This is the row wrapper
											<div
												className={classes.rowsWrapper}
												{...provided.droppableProps}
												ref={provided.innerRef}>
												{Object.keys(
													this.state.currentRows.sort(
														this.compareValues("orderId")
													)
												).map((key, index) => (
													<Row
														key={this.state.currentRows[key].id}
														row={this.state.currentRows[key]}
														deleteRow={this.props.deleteRow}
														id={this.state.currentRows[key].id}
														cards={this.state.currentCards}
														rows={this.state.currentRows}
														index={index}
														updateRowOrder={this.updateRowOrder}
													/>
												))}
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
