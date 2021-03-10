import React from 'react';
import Select from 'react-select'

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

        return (<Select
            value={{value: this.props.year, label: this.props.year}}
            options={options}
            onChange={this.onChangeYear}
            styles={selectStyles}
            style={{maxWidth: "250px"}}
            {...this.props}
        />);
    }
}
