import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Nav from "../../components/Nav";

const PublicRoute = props => {
    let { isAuth, path, component: Component, ...rest } = props;
	return (
		<Route
			{...rest}
			path={path}
			component={props =>
				<React.Fragment>
					<Nav transparent={true} />
					<main className="main-content">
						<Component {...props} />
					</main>
				</React.Fragment>
			}
        />
	);
}

const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(mapStateToProps)(PublicRoute);