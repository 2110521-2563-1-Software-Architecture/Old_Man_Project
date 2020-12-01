import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Tag, Icon, Divider } from "antd";
import { connect } from "react-redux"
import { getCurrentClientInfo } from "common/auth";
import { formatDateTime } from "common/date";
import JobCalendar from "./calendar";
import { styleColors } from "../../../common/style-colors";
import Axios from "axios"
import SignInModal from "../signinregth/modal";
import history from "common/router/history";
import Reviews from "./reviews";

class Profileth extends React.Component {
    state = {
        display: 0,
        currentPhotographer: null,
        currentPortfolio: null,
        currentClient: null,
        showSignIn: false,
        enableReserve: false,
        favorited: false
    }

    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        const { username } = this.props.match.params;
        try {
            const res =  await Axios.get("/api/photographers/" + username)
            const photographer = res.data;
            this.setState({
                photographer
            });
            const currentPortfolio = photographer.photographer_photos;
            this.setState({
                currentPhotographer: photographer,
                currentPortfolio,
                currentClient,
                favorited: (currentClient && currentClient.fav_photographers) ? 
                    [...currentClient.fav_photographers].includes(photographer.profile.user.id) : false
            });
        } catch (err) {
            history.push('/');
        }
    }

    toggleFav = async () => {
        const { 
            currentPhotographer, 
            currentClient, 
            favorited
        } = this.state;

        if (!currentClient) {
            this.setState({ showSignIn: true });
            return;
        }

        const photographerId = currentPhotographer.profile.user.id;
        const { fav_photographers } = currentClient;
        if (!favorited) {
            const res = await Axios.patch("/api/customers/"+currentClient.profile.user.username+"/", {
                fav_photographers: [...fav_photographers, photographerId]
            });
            if (res.data) {
                this.setState({
                    favorited: true
                })
            }
        } else {
            let index = currentClient.fav_photographers.indexOf(photographerId);
            const fav = [...currentClient.fav_photographers]
            const rem = [...fav.slice(0,index),...fav.slice(index+1, fav.length)];
            if (index > -1) {
                const res = await Axios.patch("/api/customers/"+currentClient.profile.user.username+"/", {
                    fav_photographers: rem
                });
                if (res.data) {
                    this.setState({
                        favorited: false
                    })
                }
            }
        }
    }

    render() {
        const { 
            currentPhotographer, 
            currentPortfolio, 
            display, 
            currentClient, 
            showSignIn,
            enableReserve,
            favorited
        } = this.state;
        const { username } = this.props.match.params;
        if (currentClient && (currentClient.profile.user.username === username 
            && currentClient.profile.user.user_type !== 1)) {
            return <Redirect to="/"/>
        }
        
        const { isAuth } = this.props;

        return (
            <div className="d-flex-md align-stretch bg-white">
                { currentPhotographer && (
                    <React.Fragment>
                        <div
                            className="sidebar-profile pa-3"
                        >
                            <h1 className="mb-1">
                                {currentPhotographer.profile.user.first_name} {currentPhotographer.profile.user.last_name}
                            </h1>
                            <h3 className="mb-2">{username}</h3>
                            <span className="t-color-light d-block">Last Online Time: {formatDateTime(currentPhotographer.photographer_last_online_time)}</span>
                            { (!isAuth || (currentClient && currentClient.profile.user.user_type !== 1)) && (
                                <Button 
                                    type="danger" 
                                    size="large" 
                                    shape="round" 
                                    ghost={(currentClient && favorited) ? true : false}
                                    className="mt-2"
                                    onClick={() => this.toggleFav()}
                                >
                                    {(currentClient && favorited) ? 'Unfavorite' : 'Favorite' } <Icon type="heart" theme='outlined' />
                                </Button>
                            )} 
                            <Divider/>
                            <div className="mb-3">
                                <div className="secondary-label mb-2">
                                    สไตล์
                                </div>
                                { currentPhotographer.photographer_style.length > 0 ? (
                                    currentPhotographer.photographer_style.map((e,i) => (
                                        <Tag color={styleColors[e]} key={i + e} className="mb-2">
                                            {e}
                                        </Tag>
                                    ))
                                ) : (
                                    <span className="t-color-light">ไม่มีสไตล์ที่ต้องการ</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="secondary-label mb-2">
                                    อุปกรณ์
                                </div>
                                { currentPhotographer.photographer_equipment.length > 0 ? (
                                    currentPhotographer.photographer_equipment.map((e,i) => (
                                        <div className="snippet secondary" key={i + e.equipment_name}>
                                            {e.equipment_name}
                                        </div>
                                    ))
                                ) : (
                                    <span className="t-color-light">ไม่มีอุปกรณ์แสดงผล</span>
                                )}
                            </div>
                            { isAuth && currentClient.profile.user.username === username && (
                                <React.Fragment>
                                    <Link to="/client/edit-profile">
                                        <Button type="primary" shape="round">แก้ไขโปรไฟล์</Button>
                                    </Link>
                                    <br/>
                                </React.Fragment>
                            )}
                            <div className="profile-tabs mt-4">
                                <div className="secondary-label mb-2">
                                    แสดงผล
                                </div>
                                <div 
                                    className={`profile-tabs-item ${display === 0 && 'active'}`}
                                    onClick={() => this.setState({ display: 0, enableReserve: false})}
                                >
                                    Portfolio
                                </div>
                                <div 
                                    className={`profile-tabs-item ${display === 1&& 'active'}`}
                                    onClick={() => this.setState({ display: 1})}
                                >
                                    รีวิว
                                </div>
                                <div 
                                    className={`profile-tabs-item ${display === 2 && 'active'}`}
                                    onClick={() => this.setState({ display: 2})}
                                >
                                    เวลาที่ว่าง
                                </div>
                            </div>
                        </div>
                        <div className="container with-sidebar full-width-xs portfolio-container">
                        { display === 0 && (
                            <div className="photo-grid">
                                { currentPortfolio && currentPortfolio.length > 0 ? (
                                    currentPortfolio.map((e,i) => (
                                        <div className="photo-grid-photo" key={e.photo_link}>
                                            <img src={e.photo_link} alt=""/>
                                        </div>
                                    ))
                                ) : (
                                    <p className="pa-3" style={{ textAlign: 'center' }}>ไม่มีรูปภาพแสดงผลในพอร์ต</p>
                                )}
                            </div>
                        )}
                        { display === 1 && (
                            <div className="pa-4">
                                <Reviews 
                                    currentPhotographer={currentPhotographer}
                                />
                            </div>
                        ) }
                        { display === 2 && (
                            <div className="pa-4">
                                <JobCalendar 
                                    fullscreen={true} 
                                    currentPhotographer={currentPhotographer}
                                    currentClient={currentClient}
                                    enableReserve={enableReserve}
                                />
                            </div>
                        ) }
                        </div>
                        { currentClient && currentClient.profile.user.user_type !== 1 && (
                            <Button 
                                type={enableReserve ? "danger" : "primary"}
                                onClick={() => this.setState({ display: 2, enableReserve: !enableReserve })}
                                className="el-4 pos-fixed"
                                size="large"
                                shape="round"
                                style={{
                                    right: 36,
                                    bottom: 24,
                                    transform: 'scale(1.2)',
                                    zIndex: 999
                                }}
                            >
                                { enableReserve ? (
                                    <React.Fragment>
                                        <Icon type="close" /> ยกเลิก
                                    </React.Fragment>
                                ): (
                                    <React.Fragment>
                                        <Icon type="book" /> จอง
                                    </React.Fragment>
                                )}
                            </Button>
                        )}
                        { currentClient ? <div/> : 
                            <Button 
                                type="primary" 
                                onClick={() => this.setState({ showSignIn: true })}
                                className="el-4 pos-fixed"
                                size="large"
                                shape="round"
                                style={{
                                    right: 36,
                                    bottom: 24,
                                    transform: 'scale(1.2)',
                                    zIndex: 999
                                }}
                            >
                                <Icon type="book" /> Sign in เพื่อทำการจอง
                            </Button>
                        }
                        <SignInModal 
                            onCancel={() => this.setState({ showSignIn: false })} 
                            visible={showSignIn} 
                        />
                    </React.Fragment>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, null)(Profileth)