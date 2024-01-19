import {useEffect, useMemo, useState} from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, TablePagination} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";


function createData(
    count,
    eventA,
    eventB,
    max_duration,
    min_duration,
    sum_duration,
) {
    return {
        count,
        eventA,
        eventB,
        max_duration,
        min_duration,
        sum_duration,
    };
}

const headCells = [
    {
        id: 'count',
        label: 'Count',
    },
    {
        id: 'eventA',
        label: 'Event A',
    },
    {
        id: 'eventB',
        label: 'Event B',
    },
    {
        id: 'max_duration',
        label: 'Max Duration',
    },
    {
        id: 'min_duration',
        label: 'Min Duration',
    },
    {
        id: 'sum_duration',
        label: 'Sum Duration',
    },
];

const StatsTable = ({stats}) => {

    const [statRows, setStatRows] = useState([]);
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
        return statRows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [statRows, page, rowsPerPage]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - statRows.length) : 0;

    useEffect(() => {
        const rows = [];
        stats?.counts?.forEach((count) => {
            rows.push(createData(count?.count, count?.eventA, count?.eventB, count?.max_duration, count?.min_duration, count?.sum_duration));
        });
        setStatRows(rows);
    }, [stats]);

    return (
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
                                    key={row.eventA + row.eventB}
                                >
                                    <TableCell align="right">{row.count}</TableCell>
                                    <TableCell align="right">{row.eventA}</TableCell>
                                    <TableCell align="right">{row.eventB}</TableCell>
                                    <TableCell align="right">{row.max_duration}</TableCell>
                                    <TableCell align="right">{row.min_duration}</TableCell>
                                    <TableCell align="right">{row.sum_duration}</TableCell>
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={statRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    </Box>
    );
}

export default StatsTable;
