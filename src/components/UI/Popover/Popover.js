import React, { Component } from "react";
import classes from "./Popover.module.css";

class Popover extends Component {
	render() {
		return (
			<div
				className={classes.popup}
				style={{ display: this.props.popoverOpen ? "block" : "none" }}>
				<span className={classes.popupText}>Popup text...</span>
			</div>
		);
	}
}

export default Popover;
