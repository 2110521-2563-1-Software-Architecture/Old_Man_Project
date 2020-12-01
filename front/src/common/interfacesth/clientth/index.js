import React from "react"
import { Switch, Route, Redirect, NavLink} from "react-router-dom";
import Editth from "./edit";
import Password from "./password"
import Reservations from "./reservations";
import EditPortfolio from "./edit-portfolio/"
import EditProfileth from "./edit-profile/"
import Calendar from "./calendar";
import JobDetails from "./job-details";
import { getCurrentClient } from "common/auth";

import { Menu } from 'antd';
import Notificationsth from "./notifications";
import Favorites from "./favorites";

class ClientLandingth extends React.Component {
    render() {
        const currentClient = getCurrentClient();
        const { type } = currentClient;
        return (
            <div className="d-flex align-stretch">
                <Menu
                    style={{ width: 256, height: '100%', position: 'fixed' }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    className="pt-0"
                >
                    { currentClient && (
                        <React.Fragment>
                            { type === 1 && (
                                <NavLink 
                                    className="ant-menu-item" 
                                    activeClassName="ant-menu-item-selected"
                                    to="/th/client/edit-portfolio/"
                                >
                                        แก้ไข Portfolio
                                </NavLink>
                            )}
                            { type === 1 && (
                                <NavLink 
                                    className="ant-menu-item" 
                                    activeClassName="ant-menu-item-selected"
                                    to="/th/client/edit-profile"
                                >
                                        แก้ไข Profile
                                </NavLink>
                            )}
                            { type === 2 && (
                                <NavLink 
                                    className="ant-menu-item" 
                                    activeClassName="ant-menu-item-selected"
                                    to="/th/client/favorites"
                                >
                                        ช่างภาพคนโปรด
                                </NavLink>
                            )}
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/th/client/reservations"
                            >
                                    การจองของฉัน
                            </NavLink>
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/th/client/calendar"
                            >
                                ปฏิทินของฉัน
                            </NavLink>
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="/th/client/notifications"
                            >
                                การแจ้งเตือนทั้งหมด
                            </NavLink>
                            <NavLink 
                                className="ant-menu-item" 
                                activeClassName="ant-menu-item-selected"
                                to="th/client/edit"
                            >
                                ข้อมูลส่วนตัวทั่วไป
                            </NavLink>
                        </React.Fragment>
                    )}
                </Menu>
                <Switch>
                    <Route path="th/client/edit/password" component={Password} />
                    <Route path="/th/client/edit" component={Editth} />
                    <Route path="/client/reservations/:jobId/th" component={JobDetails} />
                    <Route path="/th/client/reservations" component={Reservations} />
                    <Route path="/th/client/calendar" component={Calendar} />
                    <Route path="/th/client/favorites" component={Favorites} />
                    <Route path="/th/client/notifications" component={Notificationsth} />
                    <Route path="/client/edit-portfolio/th" component={EditPortfolio} />
                    <Route path="/th/client/edit-profile" component={EditProfileth} />
                    <Route path="/th/client" component={RedirectToEdit} />
                </Switch>
            </div>
        );
    }
}
const RedirectToEdit = () => (
    <Redirect to="/th/client/edit" />
)

export default ClientLandingth