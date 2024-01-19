import React, {useEffect} from 'react';
import "./TableView.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Radio} from "@mui/material";


const PreprocessTableView = ({processes, getProcesses, loading, onSelect}) => {
    const [selectedValue, setSelectedValue] = React.useState('a');

    const handleChange = (event, error) => {
        setSelectedValue(event.target.value);
        onSelect(event.target.value, error);
    };

    useEffect(() => {
        getProcesses();
    }, [getProcesses]);

    return (
        <>
            {processes && (
                <TableContainer className="table" component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableCell"></TableCell>
                                <TableCell className="tableCell">ID</TableCell>
                                <TableCell className="tableCell">Status</TableCell>
                                <TableCell className="tableCell">Output</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processes.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell padding="checkbox">
                                        <Radio
                                            checked={selectedValue === row.id}
                                            onChange={(e) => handleChange(e, row.error)}
                                            value={row.id}
                                            name="radio-buttons"
                                        />
                                    </TableCell>
                                    <TableCell className="tableCell">{row.id}</TableCell>
                                    <TableCell className="tableCell">{row.status}</TableCell>
                                    <TableCell className="tableCell">{row.output}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
};

export default PreprocessTableView;
