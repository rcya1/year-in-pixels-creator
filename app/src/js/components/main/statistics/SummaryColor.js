import React, { Component, Fragment } from "react";
import Table from "react-bootstrap/Table";
import { FULL_MONTH_NAMES } from "js/components/main/Constants";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default class SummaryColor extends Component {
  getItemColorPreviewStyle(colorScheme) {
    return {
      backgroundColor:
        "rgb(" +
        colorScheme[0] +
        "," +
        colorScheme[1] +
        "," +
        colorScheme[2] +
        ")",
      border: "1px solid black",
      height: "1.5em",
      width: "1.5em",
      margin: "auto 0.5em auto 0.4em",
      display: "inline-block",
      verticalAlign: "middle",
    };
  }

  render() {
    let colorBestMonths = [];
    for (let index in this.props.colorSchemes) {
      let bestMonths = [-1];
      let bestMonthFreq = 0;

      for (let month = 0; month < 12; month++) {
        let freq = 0;
        for (let day = 0; day < 31; day++) {
          if (this.props.values[month * 31 + day] - 1 === index) freq++;
        }

        if (freq > 0) {
          if (bestMonths === [-1] || freq > bestMonthFreq) {
            bestMonths = [month];
            bestMonthFreq = freq;
          } else if (freq === bestMonthFreq) {
            bestMonths.push(month);
          }
        }
      }

      colorBestMonths.push([bestMonths, bestMonthFreq]);
    }

    let tableBody = colorBestMonths.map((bestMonthsData, index) => {
      return (
        <tr>
          <td>
            <span
              style={this.getItemColorPreviewStyle(
                this.props.colorSchemes[index]
              )}
            ></span>
          </td>
          <td>
            {this.props.colorSchemes[index][3]}
          </td>
          <td>
            {bestMonthsData[0].reduce((prev, curr) => {
              return prev + (prev === "" ? "" : ", ") + FULL_MONTH_NAMES[curr];
            }, "") + " (" + bestMonthsData[1] + ")"}
          </td>
        </tr>
      );
    });

    return (
      <Fragment>
        <h5>Most Common Month(s) per Color</h5>
        <Table striped hover>
          <thead>
            <th>Color</th>
            <th>Label</th>
            <th>
              <text>Month(s)</text>
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    <p className="mb-0">
                      Month(s) with the most occurrences of this color
                    </p>
                  </Tooltip>
                }
                placement="bottom"
              >
                <AiOutlineQuestionCircle className="ml-1" />
              </OverlayTrigger>
            </th>
          </thead>
          <tbody>{tableBody}</tbody>
        </Table>
      </Fragment>
    );
  }
}
