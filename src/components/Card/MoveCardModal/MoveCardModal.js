import React from "react";
import PropTypes from "prop-types";
import classes from "../MoveCardModal/MoveCardModal.module.css";
import { cardsRef } from "../../../firebase";

class MoveCardModal extends React.Component {
	state = {
		rowTarget: "",
	};

	showState = () => {
		console.log(this.state.rowTarget);
	};

	moveCard = async (e) => {
		e.preventDefault();
		try {
			const rowId = this.state.rowTarget;
			const cardId = this.props.card.id;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.rowId": rowId,
			});
		} catch (error) {
			console.log("Error updating card id:", error);
		}
		this.setState({ rowTarget: "" });
		this.props.toggleModal();
	};

	render() {
		return (
			<React.Fragment>
				<div
					className={classes.modalWrapper}
					style={{ display: this.props.modalOpen ? "block" : "none" }}>
					<div className={classes.modalBody}>
						<form>
							<div>
								<span
									className={classes.modalClose}
									onClick={this.props.toggleModal}>
									&times;
								</span>
							</div>
							<select
								name="lists"
								onChange={(e) => this.setState({ rowTarget: e.target.value })}>
								<option defaultValue="Choose List"></option>
								{this.props.rows.map((row) => (
									<option value={row.id}>{row.title}</option>
								))}
							</select>
							<button
								className={classes.buttonDefault}
								onClick={(e) => this.moveCard(e)}>
								Move Card
							</button>
						</form>
					</div>
					<button onClick={this.showState}>Show State</button>
				</div>
			</React.Fragment>
		);
	}
}

MoveCardModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	toggleModal: PropTypes.func.isRequired,
	// cardData: PropTypes.object.isRequired,
};

export default MoveCardModal;
