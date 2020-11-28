import React from 'react';
import history from "../../common/router/history";
import { Button, Form, Input } from "antd";
import { Link } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll'
import Axios from "axios";
import { getCurrentClientInfo } from "../../common/auth";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Edit extends React.Component {
    componentDidMount = async () => {
        const currentClient = await getCurrentClientInfo();
        this.setState({ currentClient })
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }
    state = {
        success: false,
        error: false,
        currentClient: null
    }

    handleSubmit = e => {
        e.preventDefault();
        const { currentClient } = this.state;
        const { username, user_type } = currentClient.profile.user;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    firstName,
                    lastName,
                    email,
                    ssn,
                    bankAccountNumber,
                    bankName,
                    bankAccountName,
                    phone
                } = values;

                const url = user_type === 1 ? "/api/photographers" : "/api/customers"
                if (ssn.length !== 13 || !ssn.match(/^[0-9]*$/g)) return;
                Axios.patch(`${url}/${username}/`, {
                    profile: {
                        user: {
                            username,
                            first_name: firstName,
                            last_name: lastName,
                            email,
                        },
                        ssn,
                        bank_account_number: bankAccountNumber,
                        bank_name: bankName,
                        bank_account_name: bankAccountName,
                        phone
                    },
                }).then(res => {
                    scroll.scrollToTop();
                    this.setState({ success: true })
                    this.setState({ error: false })
                }).catch(res => {
                    scroll.scrollToTop();
                    this.setState({ error: true })
                    this.setState({ success: false })
                });
            } else {
                scroll.scrollToTop();
                this.setState({ error: true })
                this.setState({ success: false })
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        if (this.state.currentClient) {
            const { 
                username, 
                first_name: firstName, 
                last_name: lastName, 
                email, 
                type,
            } = this.state.currentClient.profile.user;
            const {
                ssn,
                bank_account_number: bankAccountNumber,
                bank_name: bankName,
                bank_account_name: bankAccountName,
                phone
            } = this.state.currentClient.profile;
    
            const { success, error } = this.state;
    
            // Validation
            const firstNameError = isFieldTouched('firstName') && getFieldError('firstName');
            const lastNameError = isFieldTouched('lastName') && getFieldError('lastName');
            const emailError = isFieldTouched('email') && getFieldError('email');
            const phoneError = isFieldTouched('phone') && getFieldError('phone');
            const ssnError = isFieldTouched('ssn') && getFieldError('ssn');
            const ssnLengthError = isFieldTouched('ssn') && this.props.form.getFieldsValue(['ssn']).ssn.length !== 13;
            const bankNameError = isFieldTouched('bankName') && getFieldError('bankName');
            const bankAccountNumberError = isFieldTouched('bankAccountNumber') && getFieldError('bankAccountNumber');
            const bankAccountNameError = isFieldTouched('bankAccountName') && getFieldError('bankAccountName');
    
            return (
                <div className="container mt-4 with-sidebar pl-4">
                    <h1>Personal Information</h1>
                    { success && 
                        <React.Fragment>
                            <div className="success-banner">
                                <span>Your personal information has been edited.</span>
                            </div>
                            <div className="pb-2"/>
                        </React.Fragment>
                    }
                    { error && 
                        <React.Fragment>
                            <div className="error-banner">
                                <span>An error occurred. Please try again later.</span>
                            </div>
                            <div className="pb-2"/>
                        </React.Fragment>
                    }
                    <Form>
                        <h3>Account Information</h3>
                        <label>Email</label>
                        <Form.Item 
                            validateStatus={emailError ? 'error' : ''} 
                            help={emailError || ''}
                        >
                            {getFieldDecorator('email', {
                                rules: [
                                    { required: true,message: 'This field is required.' },
                                ],
                                initialValue: email
                            })(
                                <Input
                                    placeholder="Email"
                                    type="email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Link to="/client/edit/password">
                                <Button 
                                    type="primary" 
                                    className="mr-2"
                                    htmlType="button" 
                                >แก้ไขพาสเวิด</Button>
                            </Link>
                        </Form.Item>
                        <h3>ช่องทางการติดต่อ</h3>
                        <label>เบอร์โทรศัพท์</label>
                        <Form.Item 
                            validateStatus={phoneError ? 'error' : ''} 
                            help={phoneError || ''}
                        >
                            {getFieldDecorator('phone', {
                                rules: [
                                    { required: true,message: 'This field is required.' },
                                ],
                                initialValue: phone
                            })(
                                <Input
                                    placeholder="Phone Number"
                                    type="phone"
                                />,
                            )}
                        </Form.Item>
                        <h3>ข้อมูลส่วนบุคคล</h3>
                        <div className="d-flex">
                            <div className="mr-1 full-width">
                                <label>ชื่อ</label>
                                <Form.Item 
                                    validateStatus={firstNameError ? 'error' : ''} 
                                    help={firstNameError || ''}
                                    className="full-width"
                                >
                                    {getFieldDecorator('firstName', {
                                        rules: [
                                            { required: true,message: 'โปรดใส่ข้อมูล' },
                                        ],
                                        initialValue: firstName
                                    })(
                                        <Input
                                            placeholder="ชื่อ"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                            </div>
                            <div className="ml-1 full-width">
                                <label>Last Name</label>    
                                <Form.Item 
                                    validateStatus={lastNameError ? 'เกิดข้อผิดพลาด' : ''} 
                                    help={lastNameError || ''}
                                    className="full-width"
                                >
                                    {getFieldDecorator('นามสกุล', {
                                        rules: [
                                            { required: true,message: 'โปรดใส่ข้อมูล' },
                                        ],
                                        initialValue: lastName
                                    })(
                                        <Input
                                            placeholder="นามสกุล"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <label>Social Security Number</label>
                        <Form.Item 
                            validateStatus={(ssnError || ssnLengthError) ? 'เกิดข้อผิลพลาด' : ''} 
                            help={ssnError || (ssnLengthError && "SSN ควรจะยาว 13 ตัวอักษร") || ''}
                        >
                            {getFieldDecorator('ssn', {
                                rules: [
                                    { required: true, message: 'โปรดใส่ข้อมูล' }
                                ],
                                initialValue: ssn
                            })(
                                <Input
                                    placeholder="Social Security Number"
                                    type="number"
                                    maxLength={13}
                                />,
                            )}
                        </Form.Item>
                        <h3>ข้อมูลการจ่ายเงิน</h3>
                        <div className="d-flex">
                            <div className="mr-1 full-width">
                                <label>เลขบัญชี</label>
                                <Form.Item 
                                    validateStatus={bankAccountNumberError ? 'error' : ''} 
                                    help={bankAccountNumberError || ''}
                                    className="full-width"
                                >
                                    {getFieldDecorator('bankAccountNumber', {
                                        rules: [
                                            { required: true,message: 'โปรดใส่ข้อมูล' },
                                        ],
                                        initialValue: bankAccountNumber
                                    })(
                                        <Input
                                            placeholder="เลขบัญชี"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                            </div>
                            <div className="ml-1 full-width">
                                <label>Bank Name</label>
                                <Form.Item 
                                    validateStatus={bankNameError ? 'error' : ''} 
                                    help={bankNameError || ''}
                                    className="full-width"
                                >
                                    {getFieldDecorator('bankName', {
                                        rules: [
                                            { required: true,message: 'โปรดใส่ข้อมูล' },
                                        ],
                                        initialValue: bankName
                                    })(
                                        <Input
                                            placeholder="ชื่อธนาคาร"
                                            type="text"
                                        />,
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <div className="mr-1">
                            <label>ชื่อบัญชี</label>
                            <Form.Item 
                                validateStatus={bankAccountNameError ? 'error' : ''} 
                                help={bankAccountNameError || ''}
                            >
                                {getFieldDecorator('bankAccountName', {
                                    rules: [
                                        { required: true,message: 'โปรดใส่ข้อมูล' },
                                    ],
                                    initialValue: bankAccountName
                                })(
                                    <Input
                                        placeholder="เลขบัญชี"
                                        type="text"
                                    />,
                                )}
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <div className="d-flex">
                                <Button 
                                    type="primary" 
                                    onClick={e => this.handleSubmit(e)}
                                    className="mr-2"
                                    htmlType="submit" 
                                    disabled={hasErrors(getFieldsError())}
                                >คอนเฟิมการแก้ไข</Button>
                                <Button 
                                    type="secondary" 
                                    onClick={() => {
                                        type === 'PHOTOGRAPHER' ? history.push("/profile/" + username)
                                        : history.push("/")
                                    }}
                                    className="mr-2"
                                    htmlType="button" 
                                >ยกเลิก</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            )
        } else {
            return <div></div>
        }
    }
}

const WrappedEditForm = Form.create({ name: 'edit_profile' })(Edit);

export default WrappedEditForm;