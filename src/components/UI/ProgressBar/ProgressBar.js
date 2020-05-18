import React from "react";
import classes from "./ProgressBar.module.css";

const ProgressBar = (props) => {
	const { progress } = props;
	return (
		<div className={classes.progressContainer}>
			<div
				className={classes.progressBar}
				style={{ width: `${progress}%` }}></div>
		</div>
	);
};

export default ProgressBar;
