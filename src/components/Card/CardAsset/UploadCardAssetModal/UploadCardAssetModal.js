import React from "react";
import PropTypes from "prop-types";
import classes from "../UploadCardAssetModal/UploadCardAssetModal.module.css";

class UploadCardAssetModal extends React.Component {
	state = {
		// url: "",
	};

	// componentDidMount() {
	// 	this.setState({
	// 		assetLinks: this.props.cardData.cardAssets,
	// 	});
	// }

	render() {
		return (
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
						<input type="file" onChange={this.props.uploadImage} />
						{/* <button type="submit" onClick={this.handleSaveImage}>
							Save and Exit
						</button> */}
					</form>
				</div>
			</div>
		);
	}
}

UploadCardAssetModal.propTypes = {
	modalOpen: PropTypes.bool.isRequired,
	toggleModal: PropTypes.func.isRequired,
	// cardData: PropTypes.object.isRequired,
};

export default UploadCardAssetModal;
