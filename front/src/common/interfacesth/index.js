import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'antd';

class Landing extends React.Component {
    render() {
        return (
            <div className="container mt-4">
                <h1>ยินดีต้อนรับ!</h1>
                <p>นี่คือหน้าเพจแรกที่คุณ้ข่้ามาเห็น</p>
                <Link to="/profile">
                    <Button type="primary">โปรไฟล์ของฉัน</Button>
                </Link>
            </div>
        )
    }
}

export default Landing