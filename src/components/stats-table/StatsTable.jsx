import React from 'react';
import "./StatsTable.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const StatsTable = (props) => {
    return (
        <TableContainer className="table" component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell">Event A</TableCell>
                        <TableCell className="tableCell">Event B</TableCell>
                        <TableCell className="tableCell">Sum Duration</TableCell>
                        <TableCell className="tableCell">Count</TableCell>
                        <TableCell className="tableCell">Min Duration</TableCell>
                        <TableCell className="tableCell">Max Duration</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="tableCell">{row.eventA}</TableCell>
                            <TableCell className="tableCell">{row.eventB}</TableCell>
                            <TableCell className="tableCell">{row.sum_duration}</TableCell>
                            <TableCell className="tableCell">{row.count}</TableCell>
                            <TableCell className="tableCell">{row.min_duration}</TableCell>
                            <TableCell className="tableCell">{row.max_duration}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StatsTable;