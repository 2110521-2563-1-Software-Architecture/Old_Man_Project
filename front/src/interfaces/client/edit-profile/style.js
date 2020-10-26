import React from "react";
import { Checkbox, Form } from "antd";
import { connect } from "react-redux";
import { setCurrentStyles } from "./actions";
import { availableStyles } from "logic/Styles";

class Style extends React.Component {
   
    onChange = (checkedValues) => {
        this.props.setCurrentStyles(checkedValues);
    }
    
    componentDidMount() {
        const { currentClient } = this.props;
        const styles = currentClient.photographer_style;
        this.props.setCurrentStyles(styles);
    }

    render() {
        const { currentStyles } = this.props;

        return (
            <React.Fragment>
                <h3>Style</h3>
                <Form className="d-flex">
                    <Form.Item className="mr-2 mb-0 full-width">
                        { currentStyles.length > 0 && (
                            <Checkbox.Group 
                                className="vertical"
                                options={availableStyles} 
                                onChange={this.onChange} 
                                defaultValue={currentStyles}
                            />
                        )}
                        { currentStyles.length === 0 && (
                            <Checkbox.Group 
                                className="vertical"
                                options={availableStyles} 
                                onChange={this.onChange} 
                            />
                        )}
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    currentStyles: state.editProfile.currentStyles
})
const mapDispatchToProps = {
    setCurrentStyles
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Style);