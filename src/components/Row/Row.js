import React, { Component } from "react";
import PropTypes from "prop-types";
import Card from "../Card/Card";
import { cardsRef, rowsRef } from "../../firebase";
import { AuthConsumer } from "../../contexts/AuthContext";
import { AiOutlineDelete } from "react-icons/ai";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classes from "../Row/Row.module.css";
import { Droppable, Draggable } from "react-beautiful-dnd";

class Row extends Component {
	state = { currentCards: this.props.cards };

	componentDidMount() {
		this.fetchCards(this.props.row.id);
	}

	fetchCards = async (rowId) => {
		try {
			await cardsRef.where("card.rowId", "==", rowId).onSnapshot((snapshot) => {
				snapshot.docChanges().forEach((change) => {
					const doc = change.doc;
					const card = {
						id: doc.id,
						text: doc.data().card.text,
						body: doc.data().card.body,
						asset: doc.data().card.cardAsset,
					};
					if (change.type === "added") {
						this.setState({
							currentCards: [...this.state.currentCards, card],
						});
					}
					if (change.type === "removed") {
						this.setState({
							currentCards: [
								...this.state.currentCards.filter((card) => {
									return card.id !== change.doc.id;
								}),
							],
						});
					}
					if (change.type === "modified") {
						const index = this.state.currentCards.findIndex((item) => {
							return item.id === change.doc.id;
						});

						const cards = [...this.state.currentCards];
						cards[index] = card;
						this.setState({ currentCards: cards });
					}
				});
			});
		} catch (error) {
			console.log("Error fetching cards", error);
		}
	};

	nameInput = React.createRef();

	createNewCard = async (e, userId) => {
		try {
			e.preventDefault();
			// This is where the card gets made, update it to have the image element as well
			const card = {
				text: this.nameInput.current.value,
				body: "",
				rowId: this.props.row.id,
				cardAssets: "",
				user: userId,
			};
			//check if the text and id exist first
			if (card.text && card.rowId) {
				await cardsRef.add({ card });
			}
			this.nameInput.current.value = "";
			console.log("new card added " + card.text);
		} catch (error) {
			console.error("Error creating new card", error);
		}
	};

	deleteRow = () => {
		const rowId = this.props.row.id;
		this.props.deleteRow(rowId);
	};

	updateTitle = async (e) => {
		try {
			const rowId = this.props.row.id;
			const newTitle = e.currentTarget.value;
			const row = await rowsRef.doc(rowId);
			row.update({ "row.title": newTitle });
		} catch (error) {
			console.error("Error updating row: ", error);
		}
	};

	// updateRowOrder = async (newOrderId) => {
	// 	try {
	// 		const rowId = this.props.row.id;
	// 		const orderId = newOrderId;
	// 		const row = await rowsRef.doc(rowId);
	// 		row.update({ "row.orderId": orderId });
	// 	} catch (error) {
	// 		console.error("Error updating row: ", error);
	// 	}
	// };

	// updateRowOrder = async () => {
	// 	const rowId = this.props.row.id;
	// 	this.props.updateRowOrder(rowId);
	// };

	showCardOrder = () => {
		console.log(this.state.currentCards);
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<Draggable draggableId={this.props.row.id} index={this.props.index}>
						{(provided) => (
							<div
								{...provided.dragHandleProps}
								{...provided.draggableProps}
								ref={provided.innerRef}
								className={classes.rowContainer}>
								<Droppable
									droppableId={this.props.row.id}
									direction="horizontal"
									type="card">
									{(provided) => (
										<ExpansionPanel
											className={classes.expansionWrapper}
											{...provided.droppableProps}
											ref={provided.innerRef}>
											<ExpansionPanelSummary
												expandIcon={<ExpandMoreIcon />}
												aria-controls="panel1a-content"
												id="panel1a-header">
												<div className={classes.rowHeader}>
													<input
														className={classes.rowHeaderInput}
														type="text"
														name="rowTitle"
														onChange={this.updateTitle}
														defaultValue={this.props.row.title}></input>
													<div className={classes.rowIconWrapper}>
														<AiOutlineDelete
															onClick={this.deleteRow}
															style={{
																cursor: "pointer",
															}}
														/>
													</div>
												</div>
											</ExpansionPanelSummary>
											{/* Map through the cards and display them as card components*/}
											<div className={classes.rowWrapper}>
												{Object.keys(this.state.currentCards).map(
													(key, index) => (
														<Card
															key={key}
															card={this.state.currentCards[key]}
															index={index}
															rows={this.props.rows}
														/>
													)
												)}
												{/* Add new card input*/}
												<form
													onSubmit={(e) => this.createNewCard(e, user.id)}
													className={classes.newCardInputForm}>
													<input
														className={classes.newCardInput}
														type="text"
														ref={this.nameInput}
														name="name"
														placeholder=" + new card"></input>
												</form>
											</div>
											{provided.placeholder}
										</ExpansionPanel>
									)}
								</Droppable>
							</div>
						)}
					</Draggable>
				)}
			</AuthConsumer>
		);
	}
}

Row.propTypes = {
	// row: PropTypes.object.isRequired,
	deleteRow: PropTypes.func.isRequired,
};

export default Row;
