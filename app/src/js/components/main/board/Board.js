import React from 'react';

import Cell from './Cell';
import { ABBR_MONTH_NAMES, DAYS_PER_MONTH } from 'js/components/main/Constants'
import { getIndex } from 'js/util/DateUtils'

// TODO Make an option for showing it in month form
export default class Board extends React.Component {
    
    render() {
        let chartData = [];
        for(let d = 0; d < 31; d++) {
            let rowData = [
                <th className="text-right pr-2" key={"-1:" + d}>{d + 1}</th>
            ];
            for(let m = 0; m < 12; m++) {
                let value = "";
                let valid = d + 1 <= DAYS_PER_MONTH[m];
                let active = this.props.currentlySelected[0] === m && this.props.currentlySelected[1] === d;
                let showTodayMarker = (m * 31 + d === this.props.currentDay) && this.props.showTodayMarker;

                if(valid) value = this.props.values[getIndex(m, d)];

                rowData.push(<Cell value={value}
                    month={m}
                    day={d}
                    handleClick={this.props.handleClick}
                    valid={valid}
                    invalidCellsDisplayType={this.props.invalidCellsDisplayType}
                    active={active}
                    showTodayMarker={showTodayMarker}
                    colorSchemes={this.props.colorSchemes}
                    key={m + ":" + d}
                />);
            }
            chartData.push(<tr key={d}>{rowData}</tr>);
        }

        return (
            <div>
                <table className="mt-3 mx-auto mb-4">
                    <thead className="text-center" style={{fontSize: "0.9rem"}}>
                        <tr>
                            <th></th>
                            {
                                ABBR_MONTH_NAMES.map((value, index) => {
                                    return <th key={index} className="pb-1">{value}</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {chartData}
                    </tbody>
                </table>
            </div>
        )
    }
}
