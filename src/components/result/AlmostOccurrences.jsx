import React, {useEffect, useMemo, useState} from "react";
import "./AlmostOccurrences.scss";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, Grid, TablePagination} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import {CSVLink} from "react-csv";
import {useParams} from "react-router-dom";


function createData(
    traceId,
    message
) {
    return {
        traceId,
        message
    };
}

const headCells = [
    {
        id: 'traceId',
        label: 'Trace ID',
    },
    {
        id: 'message',
        label: '',
    }
];

const AlmostOccurrences = ({almostOccurrences, criteria}) => {

    const {indexId} = useParams();
    const [occurrencesRows, setOccurrencesRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo (() => {
        return occurrencesRows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [occurrencesRows, page, rowsPerPage]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - occurrencesRows.length) : 0;

    const csvData = useMemo(() => {
        return [
            ["Trace ID", ""],
            ...Object.entries(occurrencesRows).map((message) => [
                message[1].traceId.toString(),
                message[1].message.toString().replaceAll("\n", "")
            ]),
        ];
    }, [occurrencesRows]);

    useEffect(() => {
        const rows = [];
        Object.entries(almostOccurrences)?.forEach((message) => {
            rows.push(createData(message[0], message[1]));
        });

        setOccurrencesRows(rows);
    }, [almostOccurrences]);

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Paper
                    sx={{ width: '100%', mb: 2 }}
                    elevation={0}
                >
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={'right'}
                                            padding={'normal'}
                                        >
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleRows?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.traceId}
                                        >
                                            <TableCell align="right">{row.traceId}</TableCell>
                                            <TableCell align="left"><pre>{row.message}</pre></TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid
                        container
                        justifyContent={"space-between"}
                    >
                        <Grid item>
                            <CSVLink className="downloadbtn" filename={`${indexId}-${criteria}-${new Date().toISOString().split('T')[0]}.csv`} data={csvData}>
                                <DownloadIcon
                                    className={"download-icon"}
                                />
                            </CSVLink>
                        </Grid>

                        <Grid item>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={occurrencesRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}

export default AlmostOccurrences;
