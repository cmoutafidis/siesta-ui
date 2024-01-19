import React, {useCallback, useEffect, useMemo, useState} from "react";
import "./Filters.scss";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button, Checkbox, FormControlLabel,
    Grid,
    MenuItem,
    Select, TextField, ToggleButton,
    ToggleButtonGroup, Typography
} from "@mui/material";
import {DateTimePicker} from "@mui/x-date-pickers";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {v4 as uuidv4} from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from "clsx";

const Filters = (props) => {

    const [from, setFrom] = useState('');
    const [till, setTill] = useState('');
    const [patternConstraints, setPatternConstraints] = useState([]);
    const [returnAll, setReturnAll] = useState(false);
    const [groupsValid, setGroupsValid] = useState(true);
    const [groups, setGroups] = useState('');
    const [timeoutValue, setTimeoutValue] = useState('');
    const [wnm, setWnm] = useState({
        k: "",
        granularityK: "seconds",
        uncertaintyPerEvent: "",
        granularityUncertainty: "seconds",
    });

    const [patternErrors, setPatternErrors] = useState([]);

    const onlySimpleSymbolsExists = useMemo(() => {
        return props.criteria?.filter((c) => c.symbol !== "_")?.length === 0;
    }, [props?.criteria]);

    useEffect(() => {
        const patternConstraintsList = [];
        props.filters.forEach((filter) => {
            if (filter.key === "from") {
                setFrom(filter.value);
            } else if (filter.key === "till") {
                setTill(filter.value);
            } else if (filter.key === "returnAll") {
                setReturnAll(filter.value);
            } else if (filter.key === "groups") {
                checkGroups(filter.value);
            } else if (filter.key === "wnm") {
                setWnm(filter.value);
            } else if (filter.key === "timeoutValue") {
                setTimeoutValue(filter.value);
            } else {
                patternConstraintsList.push(filter.value);
            }
        });
        setPatternConstraints(patternConstraintsList);
    }, [props.filters]);

    const appendPatternConstraints = (item) => {
        setPatternConstraints(patternConstraints.concat([item]));
    };

    const handlePatternConstraintsChange = (event) => {
        const newPatternConstraints = patternConstraints.map((item) => {
            if (item.id === event.id) {
                let updatedItem = {
                    ...item
                };

                event.changes.forEach((change) => {
                    updatedItem = {
                        ...updatedItem,
                        [change.field]: change.value
                    }
                });

                return updatedItem;
            }

            return item;
        });

        setPatternConstraints(newPatternConstraints);
    };

    const removePatternConstraint = (index) => {
        const patternList = patternConstraints.splice(0);
        patternList.splice(index, 1);
        setPatternConstraints(patternList);
    };

    const checkGroups = (value) => {
        setGroupsValid(!value || !!value.match("^\\[(\\((\\d||[\\d,]||[\\d\\-\\d]|| *)*\\)||,|| *)*\\]$"));
        setGroups(value);
    };

    const onSave = useCallback(() => {
        let preventSave = false;
        const patternsValidity = patternConstraints?.map((pattern) => {
            return !pattern?.posA || !pattern?.posB || !pattern?.type || !pattern?.constraint_type || !pattern?.constraint;
        });
        const incompletePatternsExist = patternsValidity.some((flag) => flag);

        setPatternErrors(patternsValidity);
        if (incompletePatternsExist) {
            preventSave = true;
        }
        if (!groupsValid) {
            preventSave = true;
        }

        if (!preventSave) {
            props.onSave(from, till, patternConstraints, returnAll, groups, wnm, timeoutValue);
        }
    }, [from, groups, groupsValid, patternConstraints, props, returnAll, till, timeoutValue, wnm]);

    const handleUserKeyPress = useCallback((event) => {
        if (event.key === "Enter") {
            onSave();
        }
    }, [onSave]);

    useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);

        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    const item = (title, value) => {
        return (
            <Grid
                item
                container
                xs={12}
            >
                <Grid
                    item
                    xs={12}
                    className="title mb1"
                >
                    {title}
                </Grid>
                <Grid
                    item
                    xs={12}
                    className="mb2"
                >
                    {value}
                </Grid>
            </Grid>
        );
    };

    const itemColumn = (title, value) => {
        return (
            <Grid
                item
                container
                justifyContent={"space-between"}
                xs={6}
            >
                <Grid
                    item
                    xs={12}
                    className="title"
                >
                    {title}
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    {value}
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid
            className="filterContainer"
            container
            spacing={2}
        >
            <Grid
                item
                xs={12}
                className="mb1"
            >
                <h4>Filters</h4>
            </Grid>

            {item("Date from:", (
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    <DateTimePicker
                        className="date-time-picker"
                        value={from}
                        onChange={(newValue) => setFrom(newValue)}
                    />
                </Grid>
            ))}

            {item("Date to:", (
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    <DateTimePicker
                        className="date-time-picker"
                        value={till}
                        onChange={(newValue) => setTill(newValue)}
                    />
                </Grid>
            ))}

            {item("Pattern constraints", (
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    {patternConstraints.map((patternConstraint, index1) => (
                        <Accordion
                            key={patternConstraint.id}
                            className={clsx({"red-border": patternErrors[index1]})}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Grid
                                    container
                                    justifyContent={"space-between"}
                                >
                                    <Grid item>
                                        <span>Pattern Constraint {index1 + 1}</span>
                                    </Grid>

                                    <Grid
                                        item
                                        onClick={() => removePatternConstraint(index1)}
                                    >
                                        <DeleteIcon />
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    {item("Event A:", (
                                        <Grid
                                            item
                                            xs={12}
                                            className="mb1"
                                        >
                                            <Select
                                                value={patternConstraint.posA + (patternConstraint.posA ? ("/" + patternConstraint.posAIndex) : "")}
                                                onChange={(event) => {
                                                    handlePatternConstraintsChange({
                                                        id: patternConstraint.id,
                                                        changes: [
                                                            {
                                                                field: "posA",
                                                                value: event.target.value.split("/")[0],
                                                            },
                                                            {
                                                                field: "posAIndex",
                                                                value: parseInt(event.target.value.split("/")[1]),
                                                            },
                                                            {
                                                                field: "posB",
                                                                value: "",
                                                            },
                                                        ]
                                                    });
                                                }}
                                                className="select"
                                            >
                                                {props.criteria.filter((el, i) => (i < props.criteria.length - 1)).map((criteria, index2) => (
                                                    <MenuItem
                                                        key={criteria.id}
                                                        value={criteria.id + "/" + index2}
                                                    >
                                                        {criteria.name + (criteria.symbol !== "_" ? criteria.symbol : "")} ({index2})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container>
                                    {item("Event B:", (
                                        <Grid
                                            item
                                            xs={12}
                                            className="mb1"
                                        >
                                            <Select
                                                value={patternConstraint.posB + (patternConstraint.posB ? ("/" + patternConstraint.posBIndex) : "")}
                                                onChange={(event) => {
                                                    handlePatternConstraintsChange({
                                                        id: patternConstraint.id,
                                                        changes: [
                                                            {
                                                                field: "posB",
                                                                value: event.target.value.split("/")[0],
                                                            },
                                                            {
                                                                field: "posBIndex",
                                                                value: parseInt(event.target.value.split("/")[1]),
                                                            },
                                                        ]
                                                    });
                                                }}
                                                className="select"
                                            >
                                                {props.criteria.filter((el, i) => (i > patternConstraint.posAIndex)).map((criteria, index2) => (
                                                    <MenuItem
                                                        key={criteria.id}
                                                        value={criteria.id + "/" + (index2 + patternConstraint.posAIndex + 1)}
                                                    >
                                                        {criteria.name + (criteria.symbol !== "_" ? criteria.symbol : "")} ({index2 + patternConstraint.posAIndex + 1})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container>
                                    {item("Type", (
                                        <Grid
                                            item
                                            xs={12}
                                            className="mb1"
                                        >
                                            <ToggleButtonGroup
                                                value={patternConstraint.type}
                                                exclusive
                                                onChange={(event, value) => {
                                                    handlePatternConstraintsChange({
                                                        id: patternConstraint.id,
                                                        changes: [
                                                            {
                                                                field: "type",
                                                                value: value,
                                                            }
                                                        ]
                                                    });
                                                }}
                                                aria-label="text alignment"
                                            >
                                                <ToggleButton value="within">
                                                    Within
                                                </ToggleButton>
                                                <ToggleButton value="atleast">
                                                    At least
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container>
                                    {item("Constraint type", (
                                        <Grid
                                            item
                                            xs={12}
                                            className="mb1"
                                        >
                                            <ToggleButtonGroup
                                                value={patternConstraint.constraint_type}
                                                exclusive
                                                onChange={(event, value) => {
                                                    handlePatternConstraintsChange({
                                                        id: patternConstraint.id,
                                                        changes: [
                                                            {
                                                                field: "constraint_type",
                                                                value: value,
                                                            }
                                                        ]
                                                    });
                                                }}
                                                aria-label="text alignment"
                                            >
                                                <ToggleButton value="timeConstraint">
                                                    Time Constraint
                                                </ToggleButton>
                                                <ToggleButton value="gapConstraint">
                                                    Gap Constraint
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid
                                    container
                                    spacing={1}
                                >
                                    {itemColumn("Constraint value", (
                                        <TextField
                                            onChange={(event) => {
                                                handlePatternConstraintsChange({
                                                    id: patternConstraint.id,
                                                    changes: [
                                                        {
                                                            field: "constraint",
                                                            value: event.target.value,
                                                        }
                                                    ]
                                                });
                                            }}
                                            value={patternConstraint.constraint}
                                            type="number"
                                            placeholder={"10"}
                                            variant={"outlined"}
                                        />
                                    ))}

                                    {patternConstraint.constraint_type === "timeConstraint" && (
                                        <>
                                            {itemColumn("Constraint granularity", (
                                                <Select
                                                    value={patternConstraint.granularity}
                                                    onChange={(event) => (
                                                        handlePatternConstraintsChange({
                                                            id: patternConstraint.id,
                                                            changes: [
                                                                {
                                                                    field: "granularity",
                                                                    value: event.target.value,
                                                                }
                                                            ]
                                                        })
                                                    )}
                                                    className="select"
                                                >
                                                    <MenuItem value="seconds">seconds</MenuItem>
                                                    <MenuItem value="minutes">minutes</MenuItem>
                                                    <MenuItem value="hours">hours</MenuItem>
                                                </Select>
                                            ))}
                                        </>
                                    )}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Button
                        variant="outlined"
                        className="addButton mt1"
                        onClick={() => appendPatternConstraints({
                            id: uuidv4(),
                            posA: "",
                            posAIndex: 0,
                            posB: "",
                            posBIndex: 0,
                            type: "",
                            constraint_type: "",
                            constraint: "",
                            granularity: "seconds"
                        })}
                    >
                        Add pattern constraint
                    </Button>
                </Grid>
            ))}

            {item("", (
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={returnAll}
                                onChange={(event) => setReturnAll(event.target.checked)}
                            />}
                        label="Return all" />
                </Grid>
            ))}

            {item("Timeout in seconds", (
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    <TextField
                        onChange={(event) => (setTimeoutValue(event.target.value))}
                        value={timeoutValue}
                        type="number"
                        placeholder={"10"}
                        variant={"outlined"}
                    />
                </Grid>
            ))}

            <Grid
                item
                xs={12}
                className="mb1"
            >
                <hr />
            </Grid>

            {item("Groups", (
                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        onChange={(event) => (checkGroups(event.target.value))}
                        value={groups}
                        type="text"
                        placeholder={"[(1-5,7),(2-8,8-12)]"}
                        variant={"outlined"}
                        disabled={!!wnm.k || !!wnm.uncertaintyPerEvent}
                        error={!groupsValid}
                    />
                </Grid>
            ))}

            <Grid
                item
                xs={12}
                className="title"
            >
                Explain non matches
            </Grid>

            {itemColumn("K", (
                <TextField
                    onChange={(event) => (setWnm({
                        ...wnm,
                        k: event.target.value
                    }))}
                    value={wnm.k}
                    type="number"
                    placeholder={"10"}
                    variant={"outlined"}
                    disabled={!onlySimpleSymbolsExists || !!groups}
                />
            ))}

            {itemColumn("K granularity", (
                <Select
                    value={wnm.granularityK}
                    onChange={(event) => (setWnm({
                        ...wnm,
                        granularityK: event.target.value
                    }))}
                    className="select"
                    disabled={!onlySimpleSymbolsExists || !!groups}
                >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                </Select>
            ))}

            {itemColumn("Uncertainty per event", (
                <TextField
                    onChange={(event) => (setWnm({
                        ...wnm,
                        uncertaintyPerEvent: event.target.value
                    }))}
                    value={wnm.uncertaintyPerEvent}
                    type="number"
                    placeholder={"10"}
                    variant={"outlined"}
                    disabled={!onlySimpleSymbolsExists || !!groups}
                />
            ))}

            {itemColumn("Uncertainty granularity", (
                <Select
                    value={wnm.granularityUncertainty}
                    onChange={(event) => (setWnm({
                        ...wnm,
                        granularityUncertainty: event.target.value
                    }))}
                    className="select"
                    disabled={!onlySimpleSymbolsExists || !!groups}
                >
                    <MenuItem value="seconds">seconds</MenuItem>
                    <MenuItem value="minutes">minutes</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                </Select>
            ))}

            {!onlySimpleSymbolsExists && (
                <Grid item>
                    <Typography variant={"subtitle1"}>
                        {"You can use the \"Explain non matches\" search if you use only the \"_\" symbol in your events."}
                    </Typography>
                </Grid>
            )}

            {(groups || (!!wnm.k || !!wnm.uncertaintyPerEvent)) && (
                <Grid item>
                    <Typography variant={"subtitle1"}>
                        {"You can only use the \"Explain non matches\" search or the \"Groups\" search simultaneously."}
                    </Typography>
                </Grid>
            )}

            <Grid
                item
                container
                justifyContent={"flex-end"}
            >
                <Button
                    variant={"contained"}
                    onClick={onSave}
                >
                    Save filters
                </Button>
            </Grid>
        </Grid>
    );
};

export default Filters;
