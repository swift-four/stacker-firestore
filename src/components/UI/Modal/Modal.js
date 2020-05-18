import React from "react";
import PropTypes from "prop-types";
import classes from "../MoveCardModal/MoveCardModal.module.css";
import { cardsRef } from "../../../firebase";

class Modal extends React.Component {
	render() {
		return (
			<div
				className={classes.modalWrapper}
				style={{ display: this.props.modalOpen ? "block" : "none" }}>
				<div className={classes.modalBody}>
					<div>
						<span
							className={classes.modalClose}
							onClick={this.props.toggleModal}>
							&times;
						</span>
					</div>
					{props.children}
				</div>
			</div>
		);
	}
}

export default Modal;
