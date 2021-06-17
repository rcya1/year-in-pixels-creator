import { Component } from 'react';
import { Container } from 'react-bootstrap';

let headerClassName = "display-5 text-left mx-auto mb-4";
let paragraphClassName = "mb-5"

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

            <h3 className={headerClassName}>Information Stored</h3>
            <p className={paragraphClassName}>
                Year in Pixels only stores account information and collects no other data.
                We do not collect any IP addresses or any other information besides those that the user explicitly provides in making their account or using the website.
            </p>

            <h3 className={headerClassName}>Use and Sharing of Information</h3>
            <p className={paragraphClassName}>
                Under no circumstances will user data ever be looked at by any third parties or developers without explicit permission from the user.
                The only time the data will be accessed is through the API running on the web server, which is open source and can be viewed in the GitHub repository (see link in navbar).
            </p>

            <h3 className={headerClassName}>Cookies</h3>
            <p className={paragraphClassName}>
                Year in Pixels uses a single session cookie to store whether or not the user is logged into the app or not.
                This is purely for providing a better user experience by preventing them from having to log in after every action.
                These cookies are in no way whatsoever used for tracking or collecting information.
            </p>
            
            <h3 className={headerClassName}>Information Security</h3>
            <p className={paragraphClassName}>
                All data is stored in a MongoDB database and we use Secure Socket Layer (SSL) certificates to encrypt the transmission of data between the frontend and backend.
                Further security details can be seen in the source code of the project, as it is completely open source.
                If one suspects there are security issues, please email the developer at <span className="mark">chang.ryan10145@gmail.com</span> or make an issue in the GitHub repository.
            </p>
        </Container>);
    }
}
