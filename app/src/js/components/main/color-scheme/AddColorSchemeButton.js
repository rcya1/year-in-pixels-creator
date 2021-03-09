import React from 'react';

import { BsPlusSquare, BsPlusSquareFill } from "react-icons/bs"

export default class AddColorSchemeButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }
    }

    componentDidMount() {

    }

    getIconStyle(disabled) {
        return {
            fontSize: "1.5rem",
            cursor: disabled ? "" : "pointer",
            color: "#6c757d",
            opacity: disabled ? ".65" : "1.0",
        }
    }

    render() {
        let Icon;
        if(this.state.hover && !this.props.disabled) {
            Icon = BsPlusSquareFill;
        }
        else {
            Icon = BsPlusSquare;
        }

        return (
            <Icon
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
                onClick={this.props.disabled ? null : this.props.handleClick}
                style={this.getIconStyle(this.props.disabled)}
                {...this.props}
            />
        );
    }
}