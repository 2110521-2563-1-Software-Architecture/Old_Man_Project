import React from "react"
import { Button } from "antd" 
import { Link } from "react-router-dom";
import Background from "assets/not-found.jpg"
import Nav from "./Nav";

const NotFoundth = () => (
    <div 
        className="d-flex align-center justify-center"
        style={{
            backgroundImage: `url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100vw',
            height: '100vh'
        }}
    >
        <Nav transparent={true} />
        <div className="container ma-0" style={{ textAlign: 'center' }}>
            <div className="hero-text mb-4">
                <div className="header">ไม่พบ page นี้</div>
                <div className="subheader" style={{ fontSize: 18, letterSpacing: 5 }}>
                    เพจที่คุณต้องการหาไม่สามารถค้นพบ
                </div>
            </div>
            <Link to="/">
                <Button type="primary" size="large" shape="round">Go to Homepage</Button>
            </Link>
        </div>
    </div>
);

export default NotFoundth;