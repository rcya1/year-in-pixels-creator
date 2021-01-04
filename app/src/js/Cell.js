import React from 'react';

import '../css/Cell.css'

export default class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    render() {
        let className = "inactive";
        if(this.props.active) className = "active";

        return (
            <td 
                className={className}
                ref={this.ref}
                onClick = {() => {
                    let rect = this.ref.current.getBoundingClientRect();
                    console.log(this.ref.current.getBoundingClientRect());
                    if(this.props.valid) {
                        this.props.handleClick(rect.x + rect.width * 3 / 4, rect.y + rect.height / 2, 
                            this.props.month, this.props.day)}
                    }
                }
            >
                {this.props.data}
            </td>
        )
    }
}