import React from 'react';
import Select from 'react-select'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

let selectStyles = require('./YearSelectStyle').selectStyles;

export default class YearSelector extends React.Component {
    
    onChangeYear = (option) => {
        let newYear = option.value;

        if(newYear === "Add") {
            this.props.showAddYearModal();
            return;
        }
        
        this.props.changeYear(newYear);
    }

    addOverlay = (component) => {
        return (<OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">Create an account to access multiple years!</Tooltip>}
        >
            <div className="flex-grow-1" style={{maxWidth: "250px"}}>
                {component}
            </div>
        </OverlayTrigger>);
    }
    
    render() {
        let options = this.props.years.map((option) => {
            return {
                value: String(option),
                label: String(option),
            };
        });

        options.push({
            value: "Add",
            label: "Add Year"
        });

        let select = (<Select
            value={{value: this.props.year, label: this.props.year}}
            options={options}
            isDisabled={this.props.disabled}
            onChange={this.onChangeYear}
            styles={selectStyles}
            className="flex-grow-1"
            isSearchable={false}
            style={{maxWidth: "250px"}}
        />);

        select = this.props.disabled ? this.addOverlay(select) : select;

        return (
        <Container className={this.props.className}>
            <Row>
                <Col className="d-flex justify-content-center px-0"
                >
                    <p className="text-right my-auto mr-2"
                        style={{fontWeight: 520, fontSize: "1.15rem"}}    
                    >
                        Select Year: 
                    </p>
                    {select}
                </Col>
            </Row>
        </Container>);
    }
}
