import React from "react";

import { BoardDisplayType } from "js/util/SettingsUtils";
import getBoardGridLayout from "./BoardGridLayout";
import getBoardCalendarLayout from "./BoardCalendarLayout";

import { Cell } from "./Cell";
import { DAYS_PER_MONTH } from "js/components/main/Constants";
import { getIndex, isLeapYear } from "js/util/DateUtils";

export default class Board extends React.Component {
  getCell = (m, d) => {
    let value = "";
    // add on one to days per month if it's a leap year
    let numDays =
      DAYS_PER_MONTH[m] + (isLeapYear(this.props.year) && m === 1 ? 1 : 0);

    let valid = d >= 0 && d + 1 <= numDays;
    let active =
      this.props.currentlySelected[0] === m &&
      this.props.currentlySelected[1] === d;
    let isToday = m * 31 + d === this.props.currentDay && d < numDays;
    let showTodayMarker =
      isToday &&
      this.props.showTodayMarker &&
      String(new Date().getFullYear()) === String(this.props.year);

    if (valid) value = this.props.values[getIndex(m, d)];

    return (
      <Cell
        value={value}
        month={m}
        day={d}
        handleClick={this.props.showEditing ? this.props.handleClick : () => {}}
        valid={valid}
        invalidCellsDisplayType={this.props.invalidCellsDisplayType}
        showDayNumber={this.props.showDayNumber}
        active={active}
        showTodayMarker={showTodayMarker}
        setCurrentDayXYProvider={
          isToday ? this.props.setCurrentDayXYProvider : function () {}
        }
        colorSchemes={this.props.colorSchemes}
        key={m + ":" + d}
      />
    );
  };

  render() {
    switch (this.props.displayType) {
      case BoardDisplayType.GRID:
        return getBoardGridLayout(this.getCell);
      case BoardDisplayType.CALENDAR:
        return getBoardCalendarLayout(this.getCell, this.props.year);
      default:
        return getBoardGridLayout(this.getCell);
    }
  }
}
