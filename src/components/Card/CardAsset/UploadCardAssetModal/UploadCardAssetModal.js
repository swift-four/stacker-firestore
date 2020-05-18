import React from "react";
import PropTypes from "prop-types";
import classes from "../UploadCardAssetModal/UploadCardAssetModal.module.css";
import Uploader from "react-firebase-file-uploader";
import { storage } from "../../../../firebase";
import ProgressBar from "../../../UI/ProgressBar/ProgressBar";

class UploadCardAssetModal extends React.Component {
	state = {
		isUploading: false,
		progress: 0,
	};

	// componentDidMount() {
	// 	this.setState({
	// 		assetLinks: this.props.cardData.cardAssets,
	// 	});
	// }

	handleChangeUsername = (event) =>
		this.setState({ username: event.target.value });

	handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

	handleProgress = (progress) => this.setState({ progress });

	handleUploadError = (error) => {
		this.setState({ isUploading: false });
		console.error(error);
	};
	handleUploadSuccess = (filename) => {
		this.setState({ progress: 100, isUploading: false });
		storage
			.ref("images")
			.child(filename)
			.getDownloadURL()
			.then((url) => {
				this.setState({ avatarURL: url });
				this.props.updateCardAsset(url);
			});
	};

	render() {
		return (
			<div
				className={classes.modalWrapper}
				style={{ display: this.props.modalOpen ? "block" : "none" }}>
				<div className={classes.modalBody}>
					{/* <form>
						<div>
							<span
								className={classes.modalClose}
								onClick={this.props.toggleModal}>
								&times;
							</span>
						</div>
						<input type="file" onChange={this.props.uploadImage} />
						<button type="submit" onClick={this.handleSaveImage}>
							Save and Exit
						</button>
					</form> */}
					<div className={classes.modalHeader}>
						<span
							className={classes.modalClose}
							onClick={this.props.toggleModal}>
							&times;
						</span>
					</div>
					<div className={classes.modalUpload}>
						<label className={classes.buttonDefault}>
							Upload asset
							<Uploader
								hidden
								accept="image/*"
								randomizeFilename
								storageRef={storage.ref("images")}
								onUploadStart={this.handleUploadStart}
								onUploadError={this.handleUploadError}
								onUploadSuccess={this.handleUploadSuccess}
								onProgress={this.handleProgress}
							/>
						</label>
					</div>
					<ProgressBar progress={this.state.progress} />
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
