import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';

import AccountSettings from './AccountSettings';
import BoardSettings from './BoardSettings';
import ExportData from './ExportData';

import withRedirect from 'js/util/react/WithRedirect';

class Settings extends Component {
    
    componentDidUpdate() {
        if(!this.props.loggedIn) {
            this.props.setRedirect("/");
            return;
        }
    }

    render() {
        return (
            <Container className="mt-3 form">
                <BoardSettings
                    boardSettings={this.props.boardSettings}
                    updateBoardSettings={this.props.updateBoardSettings}
                />

                <br></br>
                
                <AccountSettings
                    name={this.props.name}
                    username={this.props.username}
                    checkUsernameAvailable={this.props.checkUsernameAvailable}
                    updateAccountInfo={this.props.updateAccountInfo}
                    changePassword={this.props.changePassword}
                    deleteAccount={this.props.deleteAccount}

                    setRedirect={this.props.setRedirect}
                    inLg={this.props.inLg}
                />

                <br></br>
                
                <ExportData
                    exportUserData={this.props.exportUserData}
                />

                <br></br>
            </Container>
        );
    }
}

export default withRedirect(Settings);
