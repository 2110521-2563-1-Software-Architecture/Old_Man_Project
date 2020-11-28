import React from "react";
import { getCurrentClient } from "common/auth";
import { timeLabels } from "logic/Calendar";
import Axios from "axios";
import { formatDate } from "common/date";
import { statusLabels } from "logic/Reservation";
import { styleLabels } from "logic/Styles";
import { Button, Icon } from "antd";
import { calculateDepositPrice } from "./reservations";
import history from "common/router/history"

const showContactStatuses = [
    "PAID",
    "PROCESSING",
    "COMPLETED",
    "CLOSED",
    "REVIEWED"
];

class JobDetails extends React.Component {
    state = {
        currentJob: null
    }
    async componentDidMount() {
        const { jobId } = this.props.match.params;
        try {
            const res = await Axios.get("/api/getjobs/" + jobId);
            if (res.data) {
                this.setState({ currentJob: res.data })
            }
        } catch (err) {
            history.push("/client/reservations");
        }
    }

    render() {
        const { currentJob } = this.state;
        return (
            <div className="container mt-4 with-sidebar pl-4 mb-5" style={{ fontSize: 15 }}>
                { currentJob && (
                    <React.Fragment>
                        <div className="mb-4">
                            <h1 className="mr-3 mb-0">รายละเอียดการจอง</h1>
                            <Button type="link" onClick={() => window.history.back()}>
                                <Icon type="left"/>
                                กลับ
                            </Button>
                        </div>
                        <Content label="Title" content={currentJob.job_title}/>
                        <Content 
                            label="Status" 
                            content={`${statusLabels[currentJob.job_status]} ${
                                (currentJob.job_status === "DECLINED" && getCurrentClient().type === 2) ?
                                "(การจองของคุณถูกปฏิเสธโดยช่างภาพ)" : ""
                            }`}
                        />
                        <Content label={ 
                            getCurrentClient().type === 1 ? "ลูกค้า" : "ช่างภาพ"
                        } content={
                            getCurrentClient().type === 1 ? (
                                `${currentJob.job_customer.profile.user.username}${' '} 
                                (${currentJob.job_customer.profile.user.first_name} ${currentJob.job_customer.profile.user.last_name})`
                            ) : (
                                `${currentJob.job_photographer.profile.user.username}${' '}  
                                (${currentJob.job_photographer.profile.user.first_name} ${currentJob.job_photographer.profile.user.last_name})`
                            )
                        }/>
                        <Content label="สถานที่" content={currentJob.job_location} />
                        <Content label="สไตล์" content={styleLabels[currentJob.job_style]} />
                        <Content 
                            label={
                                getCurrentClient().type === 1 ? "เบอร์โทรลูกค้า" : "เบอร์โทรช่างภาพ"
                            } 
                            content={
                                showContactStatuses.includes(currentJob.job_status) ? (
                                    getCurrentClient().type === 1 ? (
                                        currentJob.job_customer.profile.phone
                                    ) : (
                                        currentJob.job_photographer.profile.phone
                                    )
                                ) : (
                                    "เบอร์โทรจะแสดงผลได้เมื่องานนั้นได้ถูกจ่ายเงินและยังไม่ถูกยกเลิก"
                                )
                            }
                            contentClass={
                                showContactStatuses.includes(currentJob.job_status) ? "" : "t-color-light"
                            }
                        />
                        <Content 
                            label={
                                getCurrentClient().type === 1 ? "อีเมลลูกค้า" : "อีเมลช่างภาพ"
                            } 
                            content={
                                showContactStatuses.includes(currentJob.job_status) ? (
                                    getCurrentClient().type === 1 ? (
                                        currentJob.job_customer.profile.user.email
                                    ) : (
                                        currentJob.job_photographer.profile.user.email
                                    )
                                ) : (
                                    "อีเมลจะแสดงผลได้เมื่องานนั้นได้ถูกจ่ายเงินและยังไม่ถูกยกเลิก"
                                )
                            }
                            contentClass={
                                showContactStatuses.includes(currentJob.job_status) ? "" : "t-color-light"
                            }
                        />
                        <div className="mb-3">
                            <b>เวลาและราคาการจอง</b><br/>
                            <ul>
                                {currentJob.job_reservation.map((e,i) => (
                                    <li className="mb-1" key={"job_time" + i}>
                                        <span>{formatDate(e.photoshoot_date)}, {' '}
                                        {timeLabels[e.job_avail_time.avail_time]}: {e.job_avail_time.photographer_price}บาท</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Content label="Total Price" content={`${currentJob.job_total_price}THB`} />
                        <Content label="Deposit" content={`${calculateDepositPrice(currentJob.job_total_price)}THB`} />
                        <Content label="Expected Complete Date" content={formatDate(currentJob.job_expected_complete_date)} />
                        <div className="mb-3">
                            <b className="d-block mb-1">รายละเอียดงาน</b>
                            <span 
                                className={`${currentJob.job_description && currentJob.job_description !== "" ? "" : "t-color-light"}`}
                            >
                                {currentJob.job_description && currentJob.job_description !== "" ? currentJob.job_description : "ไม่มีรายละเอียดงาน"}
                            </span>
                        </div>
                        <div className="mb-3">
                            <b className="d-block mb-1">ความต้องการเพิ่มเติม</b>
                            <span 
                                className={`${currentJob.job_special_requirement && currentJob.job_special_requirement !== "" ? "" : "t-color-light"}`}
                            >
                                {currentJob.job_special_requirement && currentJob.job_special_requirement !== "" ? currentJob.job_special_requirement : "ไม่มีรายละเอียดงานเพิ่มเติม"}
                            </span>
                        </div>
                        <div className="mb-3">
                            <b className="d-block mb-2">รูปภาพ</b>
                            {
                                getCurrentClient().type === 1 ? (
                                    (currentJob.job_status === "COMPLETED" || currentJob.job_status === "CLOSED") ? (
                                        <a href={currentJob.job_url} target="_blank" rel="noopener noreferrer">
                                            <Button type="primary" shape="round">
                                                ดูรูปภาพ
                                            </Button>
                                        </a>
                                    ) : ( <span className="t-color-light">ไม่มีรูปภาพแสดงผล</span> )
                                ) : (
                                    (currentJob.job_status === "CLOSED") ? (
                                        <a href={currentJob.job_url} target="_blank" rel="noopener noreferrer">
                                            <Button type="primary" shape="round" className="mt-2">
                                                ดูรูปภาพ
                                            </Button>
                                        </a>
                                    ) : ( <span className="t-color-light">
                                        {(currentJob.job_status ==="COMPLETED") 
                                        ? "ถ้าหากคุณยังไม่ได้จ่ายเงินทั้งหมด โปรดจ่ายเงินเพื่อดูรูปที่ต้องการแสดงผล"
                                        : "ไม่มีการแสดงผล"}
                                    </span> )
                                )
                            }
                        </div>
                    </React.Fragment>
                )}
            </div>
        )
    }
}

const Content = ({ label, content, contentStyle, contentClass }) => (
    <div className="mb-3">
        <div className="d-flex">
            <b className="d-block mr-2">{label}:</b>
            <span style={contentStyle} className={contentClass}>{content}</span>
        </div>
    </div>
)

export default JobDetails;