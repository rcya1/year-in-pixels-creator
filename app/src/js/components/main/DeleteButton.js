import React from 'react';

import { FaTrashAlt } from "react-icons/fa"

export default class DeleteButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }
    }

    componentDidMount() {

    }

    getIconStyle(hover, disabled, style) {
        return {
            fontSize: this.props.inLg ? "2rem" : "2.25rem",
            cursor: disabled ? "" : "pointer",
            color: (hover && !disabled) ? "#FFFFFF" : "#6c757d",
            margin: "auto 0 auto 0.5rem",
            border: "1px solid",
            backgroundColor: (hover && !disabled) ? "#6c757d" : "transparent",
            opacity: disabled ? ".65" : "1.0",
            padding: "0.25rem",
            borderRadius: ".2rem",
            ...style
        }
    }

    render() {
        return (
            <FaTrashAlt
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
                onClick={this.props.disabled ? null : this.props.handleClick}
                style={this.getIconStyle(this.state.hover, this.props.disabled, this.props.style)}
            />
        );
    }
}