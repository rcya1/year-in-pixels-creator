import React from 'react';

import '../../css/Cell.css'

export default class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        let className = "cell cell-inactive";
        if(this.props.active) className = "cell cell-active";

        let generatedStyle;
        if(this.props.data) {
            let length = this.props.options.length;
            let value = parseInt(this.props.data) - 1;

            if(value >= 0 && value < length) {
                let color = this.props.options[value];
                generatedStyle = {
                    backgroundColor: "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"
                }
            }
        }

        return (
            <td 
                className={className}
                ref={this.ref}
                style={generatedStyle}
                onClick = {(e) => {
                    if(this.props.valid) {
                        e.stopPropagation();
                        this.props.handleClick(() => {
                                let rect = this.ref.current.getBoundingClientRect();
                                return [rect.x + rect.width * 3 / 4, rect.y + rect.height / 2];
                            },
                            this.props.month, this.props.day)}
                    }
                }
            >
            </td>
        )
    }
}