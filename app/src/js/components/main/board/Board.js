import React from 'react';

import { Cell, squareLength} from './Cell';
import { ABBR_MONTH_NAMES, DAYS_PER_MONTH } from 'js/components/main/Constants'
import { getIndex, isLeapYear } from 'js/util/DateUtils'

export default class Board extends React.Component {
    
    render() {
        let chartData = [];
        for(let d = 0; d < 31; d++) {
            let rowData = [
                <th className="text-right pr-2" key={"-1:" + d} style={{ width: squareLength }}>{d + 1}</th>
            ];
            for(let m = 0; m < 12; m++) {
                let value = "";
                 // add on one to days per month if it's a leap year
                let valid = d + 1 <= DAYS_PER_MONTH[m] + (isLeapYear(this.props.year) && m === 1 ? 1 : 0);
                let active = this.props.currentlySelected[0] === m && this.props.currentlySelected[1] === d;
                let isToday = (m * 31 + d === this.props.currentDay);
                let showTodayMarker = isToday && this.props.showTodayMarker
                    && String(new Date().getFullYear()) === String(this.props.year);

                if(valid) value = this.props.values[getIndex(m, d)];

                rowData.push(<Cell value={value}
                    month={m}
                    day={d}
                    handleClick={this.props.showEditing ? this.props.handleClick : () => {}}
                    valid={valid}
                    invalidCellsDisplayType={this.props.invalidCellsDisplayType}
                    active={active}
                    showTodayMarker={showTodayMarker}
                    setCurrentDayXYProvider={isToday ? this.props.setCurrentDayXYProvider : function() {}}
                    colorSchemes={this.props.colorSchemes}
                    key={m + ":" + d}
                />);
            }
            chartData.push(<tr key={d}>{rowData}</tr>);
        }

        return (
            <div>
                <table className="mt-3 mx-auto mb-4" style={{
                    transform: "translateX(-" + (squareLength / 2) + "px)"
                }}>
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
