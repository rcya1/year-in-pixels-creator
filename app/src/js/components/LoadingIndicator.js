import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

// TODO Make it so that if you hover over it, you get a list of what is currently loading
// When adding messages to the loading thing, use setState((state) => {})) form
export default class LoadingIndicator extends React.Component {

    render() {
        if(this.props.messages.length > 0) {
            return (
                <Spinner animation="border" variant="primary" style={{
                    position: "fixed",
                    top: "5.0rem",
                    right: "1.5rem"
                }}/>
            );
        }
        else {
            return null;
        }
    }
}
