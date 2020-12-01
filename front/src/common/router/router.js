import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import history from "./history";
import { setAuth } from "common/actions/auth";
import { connect } from "react-redux";
import Profile from "interfaces/profile";
import Listing from "interfaces/listing"
import Listingth from "../interfacesth/listingth"
import SignUpth from "../interfacesth/signinregth/SignUpth"
import Profileth from "../interfacesth/profileth"
import ClientLanding from "interfaces/client";
import SignUp from "interfaces/signinreg/SignUp";
import Error from "../components/Error";
import NotFound from "../components/NotFound";


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Error/>
                <Router history={history}>
                    <Switch>
                        <PrivateRoute path="/client" component={ClientLanding}/>
                        <PublicRoute path="/signup" component={SignUp}/>
                        <PublicRoute path="/th/signup" component={SignUpth}/>
                        <PublicRoute path="/profile/:username" component={Profile}/>
                        <PublicRoute path="/th/profile/:username" component={Profileth}/>
                        <PublicRoute path="/" component={Listing} exact/>
                        <PublicRoute path="/th" component={Listingth} exact/>
                        <Route path="/" component={NotFound}/>

                    </Switch>
                </Router>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
	isAuth: state.auth.isAuth
});
export default connect(
	mapStateToProps,
	{ setAuth }
)(AppRouter);