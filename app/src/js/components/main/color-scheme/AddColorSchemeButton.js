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

    render() {
        let Icon;
        if(this.state.hover) {
            Icon = BsPlusSquareFill;
        }
        else {
            Icon = BsPlusSquare;
        }

        return (
            <Icon
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
                onClick={this.props.handleClick}
                style={{
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#6c757d"
                }}
            />
        );
    }
}