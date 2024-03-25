import React, {useEffect, useMemo, useState} from "react";
import "./ModesTable.scss";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, Grid, TablePagination, TableSortLabel} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import {CSVLink} from "react-csv";
import {useParams} from "react-router-dom";
import {visuallyHidden} from "@mui/utils";


function createData(
    mode,
    support
) {
    return {
        mode,
        support,
    };
}

const headCells = [
    {
        id: 'mode',
        label: 'Mode',
    },
    {
        id: 'support',
        label: 'Support',
    }
];

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const ModesTable = ({modes}) => {

    const {indexId} = useParams();
    const [modesRows, setModesRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState("mode");
    const [order, setOrder] = useState('asc');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo (() => {
        return stableSort(modesRows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        );
    }, [order, orderBy, modesRows, page, rowsPerPage]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - modesRows.length) : 0;

    const csvData = useMemo(() => {
        return [
            ["Mode", "Support"],
            ...modesRows.map(({mode, support}) => [
                mode,
                support.toString()
            ])
        ];
    }, [modesRows]);

    const parseMode = (key, mode) => {
        const result = [];
        mode?.forEach((item) => {
            result.push({
                mode: (key + "(" + (item?.ev ? ", " + item?.ev : "") + (item?.evA ? ", " + item?.evA : "") + (item?.evB ? ", " + item?.evB : "") + (item?.n ? ", " + item?.n : "") + ")").replace(key + "(, ", key + "(").replace("first(", "init("),
                support: item?.support
            });
        });
        return result;
    }

    useEffect(() => {
        let rows = [];
        const rowsParsed = [];

        ["existence patterns", "position patterns"].forEach(indexKey => {
            if (modes[indexKey]) {
                Object.keys(modes[indexKey])?.forEach((key) => {
                    rows = rows.concat(parseMode(key, modes[indexKey][key]));
                });
            }
        });

        ["ordered relations", "ordered relations alternate", "ordered relations chain"].forEach(indexKey => {
            if (modes[indexKey]) {
                Object.keys(modes[indexKey])?.forEach((key) => {
                    if (key === "mode") {
                        return;
                    }
                    rows = rows.concat(parseMode(modes[indexKey]?.mode + " " + key, modes[indexKey][key]));
                });
            }
        });

        rows?.forEach((row) => {
            rowsParsed.push(createData(row?.mode, row?.support));
        });

        setModesRows(rowsParsed);
    }, [modes]);

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
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows?.map((row) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.mode}
                                    >
                                        <TableCell>{row.mode}</TableCell>
                                        <TableCell>{row.support}</TableCell>
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
                        <CSVLink className="downloadbtn" filename={`${indexId}-${new Date().toISOString().split('T')[0]}.csv`} data={csvData}>
                            <DownloadIcon
                                className={"download-icon"}
                            />
                        </CSVLink>
                    </Grid>

                    <Grid item>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={modesRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>

            </Paper>
        </Box>
    );
}

export default ModesTable;
