import React from 'react';
import "./List.scss";
import StatsTable from "../../components/stats-table/StatsTable";


const List = () => {
    return (
        <div className="listContainer">
            <div className="listTitle">Stats</div>
            <StatsTable rows={[
                {
                    "eventA": "A",
                    "eventB": "B",
                    "sum_duration": 37800,
                    "count": 5,
                    "min_duration": 19800,
                    "max_duration": 19800
                },
                {
                    "eventA": "B",
                    "eventB": "C",
                    "sum_duration": 46800,
                    "count": 5,
                    "min_duration": 18000,
                    "max_duration": 18000
                }
            ]} />
        </div>
    );
};

export default List;