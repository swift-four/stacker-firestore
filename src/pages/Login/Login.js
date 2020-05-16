import React, { Component } from "react";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "../Login/Login.module.css";
import { Button, Checkbox, Form } from "semantic-ui-react";

class UserForm extends Component {
	emailInput = React.createRef();
	passwordInput = React.createRef();

	redirect = (userId) => {
		this.props.history.push(`/${userId}/calendars`);
	};

	render() {
		return (
			<AuthConsumer>
				{({ logIn, user, authMessage }) => (
					<React.Fragment>
						{!user.id ? (
							<div className={classes.loginWrapper}>
								<div className={classes.loginContainer}>
									<h2>Sign in</h2>
									{authMessage ? <span>{authMessage}</span> : ""}
									<Form>
										<Form.Field>
											<label>Email</label>
											<input
												placeholder="Your Email ..."
												ref={this.emailInput}
											/>
										</Form.Field>
										<Form.Field>
											<label>Password</label>
											<input
												placeholder="Password..."
												ref={this.passwordInput}
												type="password"
											/>
										</Form.Field>
										<Button
											onClick={(e) =>
												logIn(
													this.emailInput.current.value,
													this.passwordInput.current.value,
													e
												)
											}>
											Login
										</Button>
									</Form>
								</div>
							</div>
						) : (
							<button onClick={() => this.redirect(user.id)}>
								Go to my calendars
							</button>
						)}
					</React.Fragment>
				)}
			</AuthConsumer>
		);
	}
}

export default UserForm;
