import React from "react";
import classes from "../Logo/Logo.module.css";
import stackerLogo from "../../../assets/images/stacker-purple.svg";

const logo = (props) => (
	<div className={classes.Logo} style={{ height: props.height }}>
		<img src={stackerLogo} alt="stackerLogo"></img>
	</div>
);

export default logo;
