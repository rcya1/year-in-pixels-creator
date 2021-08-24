import { Component } from 'react';
import { Container } from 'react-bootstrap';

let headerClassName = "display-5 text-left mx-auto mb-4";
let paragraphClassName = "mb-5 lead"

export default class Changelog extends Component {
    render() {
        return (<Container>
            <div className="text-center mx-auto px-3 py-3 mb-3">
                <h1 className="display-4">
                    Changelog
                </h1>
            </div>
            
            <h3 className={headerClassName}>v1.3</h3>
            <ul className={paragraphClassName}>
                <li>Added email account support and password resetting</li>
                <li>Fixed vertical scrollbar appearing due to loading indicator</li>
                <li>Added limit to how many alerts could appear on screen</li>
                <li>Add new default calendar view that can be accessed in the settings</li>
                <li>Add limit on username length</li>
                <li>Fix transparent backgrounds on exported PNG images</li>
                <li>Added sizing control for exporting images in the side by side layout</li>
            </ul>
            <h3 className={headerClassName}>v1.2</h3>
            <ul className={paragraphClassName}>
                <li>Added the ability to export board images as SVG, PNG, and PDF files</li>
                <li>Added new day menu system that should hopefully be more stable and less prone to flickering or crashing</li>
                <li>Added the ability to delete years</li>
                <li>Add toolbar for the new select current day button and the exporting feature</li>
            </ul>
            
            <h3 className={headerClassName}>v1.1</h3>
            <ul className={paragraphClassName}>
                <li>Added this changelog :D</li>
                <li>Add loading bar indicator for updating the user on what operations are occurring</li>
                <li>Add the ability to export all account data in a JSON format (WIP, cannot import data)</li>
                <li>Add ability to delete accounts</li>
                <li>Improve color scheme list sizing on mobile view</li>
                <li>Added limits to the day menu size</li>
                <li>Fixed bug where dragging in the day menu would result in closing the menu</li>
            </ul>

            <h3 className={headerClassName}>v1.0</h3>
            <ul className={paragraphClassName}>
                <li>Initial release of the program!</li>
            </ul>
        </Container>);
    }
}
