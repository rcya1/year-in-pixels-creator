import { Component } from 'react';
import { CardDeck, Container } from 'react-bootstrap';
import { createInfoCard } from 'js/util/react/CustomCard'

let headerClassName = "display-4 text-center mx-auto mb-4";

export default class About extends Component {
    render() {
        return (<Container>
            <div className="text-center mx-auto px-3 py-3 mb-3">
                <h1 className="display-4">
                    Year in Pixels
                </h1>
                <p className="lead mb-3">
                    A tool for keeping track of your mood through colors
                </p>
                <p className="lead mb-0">
                    Created by Ryan Chang
                </p>
                <p className="lead">
                    Inspired by and made for Lillian Jiang
                </p>
            </div>

            <hr></hr>

            <h2 className={headerClassName}>
                Features
            </h2>
            <CardDeck className="mb-5">
                {createInfoCard("Unlimited Boards", ["One board per year", "Unlimited years per account"])}
                {createInfoCard("Custom Color Schemes", ["Freely choose labels and colors for boards", "Unlimited colors per account"])}
                {createInfoCard("Online Saving", ["Access your boards from any device", "Account data is stored on a server"])}
            </CardDeck>
            
            <hr></hr>

            <h2 className={headerClassName}>
                Planned Features
            </h2>
            <CardDeck className="mb-5">
                {createInfoCard("Statistics", ["See how many times you have a color", "View data in a variety of formats such as pie and bar charts"])}
                {createInfoCard("Different Board Layouts", ["Choose the standard chart view or a calendar view"])}
            </CardDeck>

            <hr></hr>

            <h2 className={headerClassName}>
                Technology
            </h2>
            <CardDeck className="mb-3">
                {createInfoCard("Frontend", [
                        <div><a href="https://reactjs.org/">React JS</a> as primary frontend library</div>,
                        <div><a href="https://react-bootstrap.github.io/">React Bootstrap</a> for formatting</div>,
                        <div><a href="https://reactrouter.com/">React Router</a> for routing</div>,
                        <div><a href="https://github.com/axios/axios/">Axios</a> for HTTP requests</div>,
                        <div><a href="https://react-select.com/home">React Select</a> for selector component</div>,
                        <div><a href="https://chadly.github.io/react-bs-notifier/">React Bootstrap Notifier</a> for notification system</div>,
                        <div><a href="https://casesandberg.github.io/react-color/">React Color</a> for color picker component</div>,
                        <div><a href="https://github.com/atlassian/react-beautiful-dnd">react-beautiful-dnd</a> for drag n drop components</div>,
                    ])}
                {createInfoCard("Backend", [
                        <div><a href="https://expressjs.com/">Express</a> for running API web server</div>,
                        <div><a href="https://www.mongodb.com/">MongoDB</a> as database to store data</div>,
                        <div><a href="https://mongoosejs.com/">Mongoose</a> to interface with MongoDB database</div>,
                        <div><a href="http://www.passportjs.org/">Passport JS</a> for user authentication</div>,
                        <div><a href="https://github.com/saintedlama/passport-local-mongoose">Passport-Local Mongoose</a> for user authentication with Mongoose</div>
                    ])}
            </CardDeck>
            <p className="lead text-center mb-4">
                See <a href="https://github.com/Ryan10145/year-in-pixels-creator">GitHub repository</a> for full source code
            </p>
        </Container>);
    }
}
