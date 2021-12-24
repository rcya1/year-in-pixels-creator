import { Component } from "react";
import {
  BarChart,
  Bar,
  Cell,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import chroma from "chroma-js";

export default class CountBarGraph extends Component {
  render() {
    let dataExists = false;

    let data = this.props.data.freq.map((freq, index) => {
      if(freq > 0) dataExists = true;
      return {
        name: this.props.data.colorSchemes[index][3],
        value: freq,
      };
    });

    if(!dataExists) {
      return <h4 className="mx-auto">No Data</h4>
    }

    return (
      <ResponsiveContainer width="100%" aspect={1.0}>
        <BarChart width="100%" height="100%" data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => {
              return [value, "Frequency"];
            }}
            labelFormatter={(index) => {
              return this.props.data.colorSchemes[index][3];
            }}
          />
          <Bar dataKey="value" fill="#212529">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chroma(
                  this.props.data.colorSchemes[index].slice(0, 3)
                ).hex()}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
