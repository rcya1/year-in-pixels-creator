import { squareLength} from './Cell';
import { FULL_MONTH_NAMES, ABBR_WEEKDAY_NAMES } from 'js/components/main/Constants'

function getTable() {
    let tableData = [];
    for(let w = 0; w < 5; w++) {
        let rowData = [
            
        ];
        
        for(let d = 0; d < 7; d++) {
            rowData.push(<td key={d} style={{
                width: squareLength + "px",
                height: squareLength + "px",
                border: "1px solid rgb(0, 0, 0)",   
                cursor: "pointer"
            }}>

            </td>)
        }

        tableData.push(<tr key={w}>{rowData}</tr>);
    }

    return <table>
        <thead className="text-center" style={{fontSize: "0.9rem"}}>
            <tr>
                {
                    ABBR_WEEKDAY_NAMES.map((value, index) => {
                        return <th key={index} className="pb-1">{value}</th>
                    })
                }
            </tr>
        </thead>
        <tbody>
            {tableData}
        </tbody>
    </table>
}

export default function getBoardCalendarLayout(getCell) {
    let calendarData = [];
    
    for(let m = 0; m < 12; m++) {
        calendarData.push(<div key={m} className="mx-3 mb-3">
            <h4>{FULL_MONTH_NAMES[m]}</h4>
            {getTable()}
        </div>)
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            {calendarData}
        </div>
    )
}