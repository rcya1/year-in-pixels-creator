import React, { Component } from 'react';
import Switch from "react-switch";

export default class MaterialSwitch extends Component {

    render() {
        return <label    
            className="w-75 mx-auto d-block"
        >
            <Switch 
                onColor="#86d3ff"
                onHandleColor="#007bff"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={14}
                width={40}
                className="pr-3"
                {...this.props}
            />
            <span>{this.props.label}</span>
        </label>
    }
}
