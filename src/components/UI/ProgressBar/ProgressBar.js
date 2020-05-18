import React from "react";
import classes from "./ProgressBar.module.css";

const ProgressBar = (props) => {
	const { progress } = props;
	return (
		<div className={classes.progressContainer}>
			<div className={classes.progressBar} style={{ width: `${progress}%` }}>
				<p className={classes.progressLabel}>{`${progress}%`}</p>
			</div>
		</div>
	);
};

export default ProgressBar;
