import React from 'react';

import Constants from './Constants'
import DateUtils from './DateUtils';

import '../css/CellMenu.css';

// TODO Fix how if you scroll, this shows up in the wrong place
// TODO Fix that if it will go of screen, then it will still show up correctly
export default class CellMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            comment: ""
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeValue(e) {
        this.setState({
            value: e.target.value
        })
    }

    onChangeComment(e) {
        this.setState({
            comment: e.target.value
        })
    }
    
    onSubmit(e) {
        e.preventDefault();
        this.props.handleMenuClose();
    }

    render() {
        if(this.props.visible) {
            let title = Constants.fullMonthNames[this.props.month] + " " + (this.props.day + 1) + 
                DateUtils.getOrdinalEnding(this.props.day + 1);

            return (
                <div className="menu"
                    style={{
                        top: this.props.yPos,
                        left: this.props.xPos
                    }}>
                    <form onSubmit={this.onSubmit}>
                        <h4 className="menu-title">{title}</h4>
                        <div className="form-group menu-item">
                            <select required
                                onChange={this.onChangeValue}
                                className="form-control">
                                <option value={0}>Unselected</option>
                                <option value={1}>Test 1</option>
                                <option value={2}>Test 2</option>
                                <option value={3}>Test 3</option>
                            </select>
                        </div>
                        <div className="form-group menu-item">
                            <textarea className="form-control"
                                onChange={this.onChangeComment}
                                placeholder="Comment">
                            </textarea>
                        </div>
                        <div className="form-group menu-submit">
                            <input type="submit" value="Save" className="btn btn-primary btn-block" />
                        </div>
                    </form>
                    <div className="menu-close"
                        onClick={this.props.handleMenuClose}
                    >
                        <div className="menu-close-x" >
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}