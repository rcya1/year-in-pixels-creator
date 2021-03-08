import React from 'react';

let squareLength = 30;

let getCellStyle = (active, backgroundColor) => {
    return {
        width: squareLength + "px",
        height: squareLength + "px",
        cursor: "pointer",
        border: active ? "3px solid rgba(0, 0, 0, 0.7)" : "1px solid rgb(0, 0, 0)",
        backgroundColor: backgroundColor
    }
};

export default class Cell extends React.Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        let backgroundColor = "";
        if(this.props.value) {
            let length = this.props.options.length;
            let value = parseInt(this.props.value) - 1;

            if(value >= 0 && value < length) {
                let color = this.props.options[value];
                backgroundColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
            }
        }

        return (
            <td 
                style={getCellStyle(this.props.active, backgroundColor)}
                ref={this.ref}
                onClick = {(e) => {
                    if(this.props.valid) {
                        e.stopPropagation();
                        this.props.handleClick(() => {
                                let rect = this.ref.current.getBoundingClientRect();
                                return [rect.x + rect.width * 3 / 4, rect.y + rect.height / 2];
                            }, this.props.month, this.props.day)}
                    }
                }
            >
            </td>
        )
    }
}