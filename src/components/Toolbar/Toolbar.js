import React, { Component } from "react";
import {
	AiOutlineCalendar,
	AiOutlineSetting,
	AiOutlineShareAlt,
	AiOutlineDelete,
	AiOutlineDown,
} from "react-icons/ai";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "./Toolbar.module.css";

class Toolbar extends Component {
	state = {
		modalOpen: false,
		isCollapsed: true,
	};

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<div className={classes.toolbarContainer}>
						<div className={classes.toolbarIconWrapper}>
							<a
								className={classes.buttonDefault}
								href={user.id ? `/${user.id}/calendars` : `/`}>
								<AiOutlineCalendar style={{ marginRight: "8px" }} /> All
								Calendars
							</a>
							<div className={classes.buttonDefault}>
								<AiOutlineShareAlt style={{ marginRight: "8px" }} />
								Share
							</div>
						</div>
						<div className={classes.toolbarIconWrapper}>
							<div className={classes.buttonDefault}>
								<AiOutlineSetting style={{ marginRight: "8px" }} /> Settings
							</div>
							<div className={classes.buttonDefault}>
								<AiOutlineDown style={{ marginRight: "8px" }} /> Collapse All
							</div>
							<div
								className={classes.buttonDanger}
								onClick={this.props.deleteCalendar}>
								<AiOutlineDelete style={{ marginRight: "10px" }} /> Delete
								Calendar
							</div>
						</div>
					</div>
				)}
			</AuthConsumer>
		);
	}
}

export default Toolbar;
