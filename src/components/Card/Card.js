import React, { Component } from "react";
import PropTypes from "prop-types";
import { cardsRef, storage } from "../../firebase";
import UploadCardAssetmodal from "./CardAsset/UploadCardAssetModal/UploadCardAssetModal";
import TextareaAutosize from "react-autosize-textarea";
import MoveCardModal from "./MoveCardModal/MoveCardModal";
import {
	AiOutlineUpload,
	AiOutlineDelete,
	AiOutlineSelect,
} from "react-icons/ai";
import Aux from "../Hoc/Aux";
import classes from "./Card.module.css";
import { Draggable } from "react-beautiful-dnd";
import ReactPlayer from "react-player";

class Card extends Component {
	state = {
		isModalOpen: false,
		isMoveModalOpen: false,
		isPopoverOpen: false,
	};

	toggleModal = () => {
		this.setState({ modalOpen: !this.state.modalOpen });
	};

	deleteCard = async (e) => {
		try {
			e.preventDefault();
			const cardId = this.props.card.id;
			const card = await cardsRef.doc(cardId);
			card.delete();
		} catch (error) {
			console.error("problem deleting card", error);
		}
	};

	updateCardTitle = async (e) => {
		try {
			const cardId = this.props.cardData.id;
			const newTitle = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.text": newTitle,
			});
		} catch (error) {
			console.log("Error updating card title: ", error);
		}
	};

	updateCardBody = async (e) => {
		try {
			const cardId = this.props.card.id;
			const newBody = e.currentTarget.value;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.body": newBody,
			});
		} catch (error) {
			console.log("Error updating card body:", error);
		}
	};

	toggleAssetUploadModal = () => {
		this.setState({ isModalOpen: !this.state.isModalOpen });
	};

	toggleMoveCardModal = () => {
		this.setState({ isMoveModalOpen: !this.state.isMoveModalOpen });
	};

	updateCardImage = async (url) => {
		try {
			const cardId = this.props.card.id;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.cardAsset": url,
			});
		} catch (error) {
			console.log("Error updating card body:", error);
		}
	};

	updateCardVideo = async (url) => {
		try {
			const cardId = this.props.card.id;
			const card = await cardsRef.doc(cardId);
			card.update({
				"card.video": url,
			});
		} catch (error) {
			console.log("Error updating card body:", error);
		}
	};

	// handleImageUpload = (e) => {
	// 	if (e.target.files[0]) {
	// 		const image = e.target.files[0];
	// 		const uploadTask = storage.ref(`images/${image.name}`).put(image);
	// 		uploadTask.on(
	// 			"state_changed",
	// 			(snapshot) => {
	// 				console.log(snapshot);
	// 			},
	// 			(error) => {
	// 				console.log(error);
	// 			},
	// 			() => {
	// 				storage
	// 					.ref("images/")
	// 					.child(image.name)
	// 					.getDownloadURL()
	// 					.then((url) => {
	// 						this.updateCardAsset(url);
	// 					});
	// 			}
	// 		);
	// 	}
	// };

	render() {
		let cardAsset = null;

		if (this.props.card.video) {
			cardAsset = (
				<ReactPlayer
					url={this.props.card.video}
					width={"250px"}
					height={"150px"}
					controls={true}
				/>
			);
		} else if (this.props.card.asset) {
			cardAsset = (
				<img
					src={`${this.props.card.asset}`}
					alt="card-asset"
					className={classes.cardImage}
				/>
			);
		}

		return (
			<Aux>
				<Draggable draggableId={this.props.card.id} index={this.props.index}>
					{(provided) => (
						<div
							className={classes.cardContainer}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
							ref={provided.innerRef}>
							<div className={classes.cardHeader}>
								<TextareaAutosize
									className={classes.cardHeaderInput}
									defaultValue={this.props.card.text}
									onChange={this.updateCardTitle}
									name="title"></TextareaAutosize>
								<div className={classes.cardIconContainer}>
									<div className={classes.cardIconWrapper}>
										<AiOutlineUpload
											onClick={this.toggleAssetUploadModal}
											style={{ cursor: "pointer" }}
										/>
									</div>
									<div className={classes.cardIconWrapper}>
										<AiOutlineDelete
											onClick={this.deleteCard}
											style={{ cursor: "pointer" }}
										/>
									</div>
									<div className={classes.cardIconWrapper}>
										<AiOutlineSelect
											style={{ cursor: "pointer" }}
											onClick={this.toggleMoveCardModal}
										/>
									</div>
								</div>
							</div>
							{/* Conditionally render the asset modal if we have no images in the array */}
							<div className={classes.cardAsset}>
								{/* {!this.props.card.asset ? (
									<p>No image </p>
								) : (
									// <img
									// 	src={`${this.props.card.asset}`}
									// 	alt="card-asset"
									// 	className={classes.cardImage}
									// />
									)} */}
								{cardAsset}
							</div>

							<div className={classes.cardTextWrapper}>
								<textarea
									className={classes.cardBodyText}
									placeholder="Enter post copy..."
									defaultValue={this.props.card.body}
									onChange={this.updateCardBody}
									type="text"
									name="body"></textarea>
							</div>
						</div>
					)}
				</Draggable>

				<UploadCardAssetmodal
					modalOpen={this.state.isModalOpen}
					toggleModal={this.toggleAssetUploadModal}
					cardData={this.props.card}
					uploadImage={this.handleImageUpload}
					updateCardImage={this.updateCardImage}
					updateCardVideo={this.updateCardVideo}
				/>
				<MoveCardModal
					modalOpen={this.state.isMoveModalOpen}
					toggleModal={this.toggleMoveCardModal}
					rows={this.props.rows}
					card={this.props.card}
				/>
			</Aux>
		);
	}
}

Card.propTypes = {
	card: PropTypes.object.isRequired,
};

export default Card;
