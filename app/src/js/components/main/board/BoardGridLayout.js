import { squareLength} from './Cell';
import { ABBR_MONTH_NAMES } from 'js/components/main/Constants'

export default function getBoardGridLayout(getCell) {
    let chartData = [];
    for(let d = 0; d < 31; d++) {
        let rowData = [
            <th className="text-right pr-2" key={"-1:" + d} style={{ width: squareLength }}>{d + 1}</th>
        ];
        for(let m = 0; m < 12; m++) {
            rowData.push(getCell(m, d))
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