import React from "react";
// import { cardsRef, storage } from "../../../../firebase";
import PropTypes from "prop-types";
import classes from "../UploadCardAssetModal/UploadCardAssetModal.module.css";

class UploadCardAssetModal extends React.Component {
	state = {
		url: "",
	};

	componentDidMount() {
		this.setState({
			assetLinks: this.props.cardData.cardAssets,
		});
	}

	// upload the assets to storage and update the state with the URLS
	// when the save button is clicked, push the new state array to firebase
	// conditionally render the card upload element if there is links in the array

	// updateCardAssets = async (e) => {
	// 	try {
	// 		e.preventDefault();
	// 		const cardId = this.props.cardData.id;
	// 		const links = this.state.assetLinks;
	// 		const card = await cardsRef.doc(cardId);
	// 		card.update({
	// 			"card.cardAssets": this.state.assetLinks,
	// 		});
	// 		this.props.toggleModal();
	// 	} catch (error) {
	// 		console.error("Error updating card: ", error);
	// 	}
	// };

	render() {
		return (
			<div
				className={classes.modalWrapper}
				style={{ display: this.props.modalOpen ? "block" : "none" }}>
				<div className={classes.modalBody}>
					<form onSubmit={this.uploadAssets}>
						<div>
							<span
								className={classes.modalClose}
								onClick={this.props.toggleModal}>
								&times;
							</span>
						</div>
						<input type="file" onChange={this.props.uploadImage} />
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
