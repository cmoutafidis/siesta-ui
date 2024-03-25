import React, {useEffect, useMemo, useState} from "react";
import "./DetectionTable.scss";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, Grid, Radio, TablePagination, Alert, TableSortLabel} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import {CSVLink} from "react-csv";
import {useParams} from "react-router-dom";
import {visuallyHidden} from "@mui/utils";


function createData(
    id,
    detectedPattern,
    occurrencesLength,
    occurrences
) {
    return {
        id,
        detectedPattern,
        occurrencesLength,
        occurrences
    };
}

const headCells = [
    {
        id: 'id',
        label: 'Trace ID',
    },
    {
        id: 'detectedPattern',
        label: 'Detected Pattern',
    },
    {
        id: 'occurrencesLength',
        label: 'Occurrences Length',
    },
];

const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "detectedPattern") {
        if (b[orderBy].split(",").length < a[orderBy].split(",").length) {
            return -1;
        }
        if (b[orderBy].split(",").length > a[orderBy].split(",").length) {
            return 1;
        }
        return 0;
    } else {
        if (parseInt(b[orderBy]) < parseInt(a[orderBy])) {
            return -1;
        }
        if (parseInt(b[orderBy]) > parseInt(a[orderBy])) {
            return 1;
        }
        return 0;
    }
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
                <TableCell className="tableCell"></TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'right'}
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

const DetectionTable = ({detection, detectionError, timeoutError, criteria}) => {

    const {indexId} = useParams();
    const [detectionRows, setDetectionRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [selectedValue, setSelectedValue] = useState(undefined);
    const [orderBy, setOrderBy] = useState("id");
    const [order, setOrder] = useState('asc');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChange = (event, id) => {
        if (id === selectedValue) {
            setSelectedValue(undefined);
        }
        setSelectedValue(id);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo (() => {
        return stableSort(detectionRows, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        );
    }, [order, orderBy, detectionRows, page, rowsPerPage]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - detectionRows.length) : 0;

    const csvData = useMemo(() => {
        const isTrace = !!detection[0]?.traceID;
        return [
            [isTrace ? "Trace ID" : "Group ID", "Detected Pattern", "Occurrences Length", "Occurrences"],
            ...detectionRows.map(({ id, detectedPattern, occurrencesLength, occurrences }) => [
                id.toString(),
                detectedPattern,
                occurrencesLength.toString(),
                occurrences.replaceAll("\"", "\"\"")
            ]),
        ];
    }, [detection, detectionRows]);

    useEffect(() => {
        const rows = [];
        const isTrace = detection[0]?.traceID !== undefined;
        if (!isTrace) {
            headCells[0].label = "Group ID";
        } else {
            headCells[0].label = "Trace ID";
        }
        detection?.forEach((occurrence) => {
            let pattern = "";
            let occurrences = {occurrences: {}};
            occurrence?.occurrences[0]?.occurrence?.forEach((event) => {
                pattern += event?.name + ", "
            });
            pattern = pattern.slice(0, -2);

            occurrence?.occurrences.forEach((o, index) => {
               occurrences.occurrences[index] = o.occurrence;
            });

            rows.push(createData(occurrence[(isTrace ? "traceID" : "Group ID")], pattern, occurrence?.occurrences?.length, JSON.stringify(occurrences)));
        });

        setDetectionRows(rows);
    }, [detection]);

    return (
        <>
            {(detectionError || timeoutError) ? (
                <>

                    <Grid
                        container
                        spacing={1}
                        direction={"column"}
                    >
                    {detectionError && (
                        <>
                            {detectionError["Constraints between events that cannot been fulfilled"].map((constraint, index) => (
                                <Grid
                                    item
                                    key={index}
                                >
                                    <Alert className={"alert"} severity="error">{`Constraint '${constraint.constraint.method} ${constraint.constraint.constraint} ${constraint.constraint.granularity}' between events ${constraint.eventA.name} and ${constraint.eventB.name} cannot be fulfilled`}</Alert>
                                </Grid>
                            ))}
                            {detectionError["Pair of events that do not exist"].map((constraint, index) => (
                                <Grid
                                    item
                                    key={index}
                                >
                                    <Alert className={"alert"} severity="error">{`Event ${constraint.eventA.name} never occurred before Event ${constraint.eventB.name} in this log.`}</Alert>
                                </Grid>
                            ))}
                        </>
                    )}

                    {timeoutError && (
                        <Grid
                            item
                        >
                            <Alert className={"alert"} severity="error">{timeoutError}</Alert>
                        </Grid>
                    )}
                    </Grid>
                </>
            ) : (
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
                                    {visibleRows?.map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={row.id}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Radio
                                                        checked={selectedValue === row.id}
                                                        onClick={(e) => handleChange(e, row.id)}
                                                        value={index}
                                                        name="radio-buttons"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row.id}</TableCell>
                                                <TableCell align="right">{row.detectedPattern}</TableCell>
                                                <TableCell align="right">{row.occurrencesLength}</TableCell>
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
                                    count={detectionRows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>

                        {selectedValue !== undefined && (
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 750 }}
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                >
                                    <TableHead>
                                        <TableRow>
                                            {detection.find((occurance) => occurance?.traceID === selectedValue).occurrences[0].occurrence.map((occurence, index) => (
                                                <TableCell
                                                    key={index}
                                                    padding={'normal'}
                                                >
                                                    {"Event " + occurence.name}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {detection.find((occurance) => occurance?.traceID === selectedValue).occurrences.map((occurrences, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}
                                                >
                                                    {occurrences.occurrence?.map((occurence, index2) => {
                                                        return (
                                                            <TableCell key={index2}>
                                                                {"Position: " + occurence.position}
                                                                {occurence.timestamp && (
                                                                    <>
                                                                        <br/>
                                                                        {"Timestamp: " + occurence.timestamp}
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
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
                        )}
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default DetectionTable;
