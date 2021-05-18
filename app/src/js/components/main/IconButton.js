import React, { Component } from 'react';
import { FaTrashAlt, FaCalendarDay } from "react-icons/fa"
import { TiExport } from "react-icons/ti"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export let DeleteButton = asIconButton(FaTrashAlt);
export let ExportImageButton = asIconButton(TiExport);
export let SelectCurrentDayButton = asIconButton(FaCalendarDay);

export function asIconButton(Icon) {
    return class extends Component {

        constructor(props) {
            super(props);
    
            this.state = {
                hover: false
            }
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
            let iconButton = (<Icon
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
                onClick={this.props.disabled ? null : this.props.handleClick}
                style={this.getIconStyle(this.state.hover, this.props.disabled, this.props.style)}
                {...this.props}
            />);

            if(this.props.overlayText == null) {
                return iconButton;
            }

            return (<OverlayTrigger
                overlay={<Tooltip id="tooltip-button-text">{this.props.overlayText}</Tooltip>}
            >
                {iconButton}
            </OverlayTrigger>);
        }
    }
}
