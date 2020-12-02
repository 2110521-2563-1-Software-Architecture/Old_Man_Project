import React from 'react';
import history from "../../../common/router/history";
import { getCurrentClientInfo } from "common/auth";
import { Button, Form, Input } from "antd";
import { animateScroll as scroll } from 'react-scroll'
import Axios from 'axios';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Passwordth extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const currentClient = await getCurrentClientInfo();

        this.props.form.validateFields((err, values) => {
            if ( values.newPassword !== values.confirmPassword) {
                this.setState({
                    passwordsDoNotMatch: true
                })
                return;
            } else {
                this.setState({
                    passwordsDoNotMatch: false
                })
            }
            if (!err) {
                const { username } = currentClient.profile.user
                Axios.put(`/api/password/${username}/`, {
                    old_password: values.oldPassword,
                    new_password: values.newPassword
                }).then(res => {
                    scroll.scrollToTop();
                    this.setState({ success: true })
                    this.setState({ wrongPassword: false })
                }).catch(res => {
                    scroll.scrollToTop();
                    this.setState({ success: false })
                    this.setState({ wrongPassword: true })
                });
            }
        });
    };

    state = {
        passwordsDoNotMatch: false,
        wrongPassword: false,
        success: false
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { passwordsDoNotMatch, wrongPassword, success } = this.state;

        // Validation
        const oldPasswordError = isFieldTouched('oldPassword') && getFieldError('oldPassword');
        const newPasswordError = isFieldTouched('newPassword') && getFieldError('newPassword');
        const confirmPasswordError = isFieldTouched('confirmPassword') 
            && getFieldError('confirmPassword');

        return (
            <div className="container mt-4 with-sidebar pl-4">
                <h1>Edit Password</h1>
                <div className="mb-4">
                    { passwordsDoNotMatch && (
                        <div className="error-banner">
                            <b className="t-color-error">รหัสผ่านไม่ตรง</b>
                        </div>
                    ) }
                    { wrongPassword && (
                        <div className="error-banner">
                            <b>รหัสผ่านเก่าไม่ถูกต้อง</b>
                        </div>
                    ) }
                    { success && (
                        <div className="success-banner">
                            <b>รหัสผ่านถูกเปลัี่ยน</b>
                        </div>
                    ) }
                </div>
                <Form>
                    <label>รหัสผ่านเก่า</label>
                    <Form.Item validateStatus={oldPasswordError ? 'เกิดข้อผิดพลาด' : ''} help={oldPasswordError || ''}>
                        {getFieldDecorator('oldPassword', {
                            rules: [
                                { required: true,message: 'โปรดใส่ข้อมูล' },
                            ],
                        })(
                            <Input
                                placeholder="รหัสผ่านเก่า"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <label>รหัสผ่านใหม่</label>
                    <Form.Item validateStatus={newPasswordError ? 'เกิดข้อผิดพลาด' : ''} help={newPasswordError || ''}>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                { required: true,message: 'โปรดใส่ข้อมูล' },
                            ],
                        })(
                            <Input
                                placeholder="รหัสผ่านใหม่"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <label>Confirm New Password</label>
                    <Form.Item validateStatus={confirmPasswordError ? 'เกิดข้อผิดพลาด' : ''} help={confirmPasswordError || ''}>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                { required: true,message: 'โปรดใส่ข้อมูล' },
                            ],
                        })(
                            <Input
                                placeholder="โปรดพิมพ์รหัสผ่านใหม่อีกครั้ง"
                                type="password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <div className="d-flex">
                            <Button 
                                type="primary" 
                                onClick={e => this.handleSubmit(e)}
                                className="mr-2"
                                htmlType="submit" 
                                disabled={hasErrors(getFieldsError())}
                            >ยืนยันการเปลี่ยนรหัสผ่าน</Button>
                            <Button 
                                type="secondary" 
                                onClick={() => history.goBack()}
                                className="mr-2"
                                htmlType="button" 
                            >กลับ</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const WrappedEditForm = Form.create({ name: 'edit_profile' })(Passwordth);

export default WrappedEditForm;