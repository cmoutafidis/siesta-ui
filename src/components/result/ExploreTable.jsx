import React, {useEffect, useMemo, useState} from "react";
import "./ExploreTable.scss";
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
    event,
    completions,
    averageDuration
) {
    return {
        event,
        completions,
        averageDuration
    };
}

const headCells = [
    {
        id: 'event',
        label: 'Next Event',
    },
    {
        id: 'completions',
        label: 'Completions',
    },
    {
        id: 'averageDuration',
        label: 'Average Duration',
    },
];

const ExploreTable = ({explore, criteria}) => {

    const {indexId} = useParams();
    const [exploreRows, setExploreRow] = useState([]);
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
        return exploreRows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [exploreRows, page, rowsPerPage]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - exploreRows.length) : 0;

    const csvData = useMemo(() => {
        return [
            ["Next Event", "Completions", "Average Duration"],
            ...exploreRows.map(({event, completions, averageDuration}) => [
                event.toString(),
                completions.toString(),
                averageDuration.toString(),
            ]),
        ];
    }, [exploreRows]);

    useEffect(() => {
        const rows = [];
        explore?.propositions?.forEach((proposition) => {
            rows.push(createData(proposition.event, proposition.completions, proposition.averageDuration.toString() + "s"));
        });

        setExploreRow(rows);
    }, [explore]);

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
                                {visibleRows?.map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                        >
                                            <TableCell align="right">{row.event}</TableCell>
                                            <TableCell align="right">{row.completions}</TableCell>
                                            <TableCell align="right">{row.averageDuration}</TableCell>
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
                            <CSVLink className="downloadbtn" filename={`${indexId}-${criteria.map((c) => c.name).join("")}-${new Date().toISOString().split('T')[0]}.csv`} data={csvData}>
                                <DownloadIcon
                                    className={"download-icon"}
                                />
                            </CSVLink>
                        </Grid>

                        <Grid item>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={exploreRows.length}
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

export default ExploreTable;
