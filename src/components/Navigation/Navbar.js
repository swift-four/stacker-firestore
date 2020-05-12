import React from "react";
import { AuthConsumer } from "../../contexts/AuthContext";
import classes from "../Navigation/Navbar.module.css";
import Logo from "../../components/UI/Logo/Logo";
import { AiOutlineLogout } from "react-icons/ai";

export default function Navbar() {
	return (
		<header className={classes.navWrapper}>
			<AuthConsumer>
				{({ user, logOut }) => (
					<div className={classes.navContainer}>
						<a href={user.id ? `/${user.id}/calendars` : `/`}>
							{" "}
							<Logo height="20px" />
						</a>
						{
							user.id ? (
								<React.Fragment>
									<div
										className={classes.navbarIconContainer}
										onClick={(e) => logOut(e)}>
										<AiOutlineLogout style={{ marginRight: "10px" }} />
										Logout
									</div>
								</React.Fragment>
							) : null // <small>Please sign in</small>
						}
					</div>
				)}
			</AuthConsumer>
		</header>
	);
}
