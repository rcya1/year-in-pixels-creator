import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export default class LoadingIndicator extends React.Component {

    render() {
        if(this.props.messages.length > 0) {
            return (
                <div style={{
                    position: "absolute",
                    top: "5.0rem",
                    right: "1.5rem",
                    height: "100%"
                }}>
                    <OverlayTrigger
                        overlay={
                            <Tooltip id="tooltip-disabled">
                                {
                                    this.props.messages.map((message) => {
                                        return (<p className="mb-1">
                                            {message}
                                        </p>)
                                    })
                                }
                            </Tooltip>
                        }
                        placement="bottom"
                    >
                        <Spinner animation="border" variant="primary"
                            style={{
                                position: "sticky",
                                top: ".5rem"
                            }}
                        />
                    </OverlayTrigger>
                </div>
            );
        }
        else {
            return null;
        }
    }
}
