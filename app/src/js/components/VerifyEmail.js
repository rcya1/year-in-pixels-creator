import { Component } from 'react';
import { Container } from 'react-bootstrap';

export default class VerifyEmail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            success: false
        }
    }

    componentDidMount = async () => {
        let username = this.props.match.params.username;
        let token = this.props.match.params.token;

        let success = await this.props.verifyEmail(username, token);
        this.setState({
            success: success
        });
    }

    render() {
        let title = this.state.success ? "Successfully Verified Email!" : "Failed to Verify Email";

        return (<Container>
            <div className="text-center mx-auto px-3 py-3 mb-3">
                <h1 className="display-4">
                    {title}
                </h1>
            </div>
        </Container>);
    }
}
