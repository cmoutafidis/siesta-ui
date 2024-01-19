import React, {useEffect, useMemo, useRef, useState} from "react";
import "./Search.scss";
import {
    Box,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Popper,
    Select,
    Tab
} from "@mui/material";
import clsx from "clsx";
import DrawerComponent from "../drawer/DrawerComponent";
import Filters from "../../core/filters/Filters";
import {v4 as uuidv4} from "uuid";
import {useStats} from "../../services/endpoints/stats";
import {useDetection} from "../../services/endpoints/detection";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Metadata from "../../core/metadata/Metadata";
import {useExplore} from "../../services/endpoints/explore";

const Search = ({events, indexId, metadata, onStatsResult, onLoadingStats, onDetectionResult, onLoadingDetection, onDetectionError, onTimeoutError, onExploreResult, onExploreLoading, onTabValueChange, onCriteriaChange, onCriteriaChange2, onWnmChange}) => {

    const [show, setShow] = useState(false);
    const textInputRef = useRef(null);
    const textInputRef2 = useRef(null);
    const popperRef = useRef(null);
    const popperRef2 = useRef(null);
    const [inputValue, setInputValue] = useState();
    const [inputValue2, setInputValue2] = useState();
    const [selectedEvent, setSelectedEvent] = useState();
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isInputFocused2, setIsInputFocused2] = useState(false);
    const [criteria, setCriteria] = useState([]);
    const [criteria2, setCriteria2] = useState([]);
    const [from, setFrom] = useState(null);
    const [till, setTill] = useState(null);
    const [patternConstraints, setPatternConstraints] = useState(null);
    const [returnAll, setReturnAll] = useState(null);
    const [groups, setGroups] = useState(null);
    const [timeoutValue, setTimeoutValue] = useState(null);
    const [wnm, setWnm] = useState(null);
    const [filters, setFilters] = useState([]);
    const [tabValue, setTabValue] = useState("1");
    const [mode, setMode] = useState("");
    const [k, setK] = useState(1);
    const [orEventList, setOrEventList] = useState([]);
    const {getStats, stats, loadingStats, resetStatsState} = useStats();
    const {getDetection, detection, loadingDetection, detectionError, timeoutError, resetDetectionState} = useDetection();
    const {getExplore, explore, loadingExplore} = useExplore();

    const symbols = [
        "_",
        "*",
        "+",
        "!",
        "||"
    ];

    const isLastCriteriumSymbolOR = useMemo(() => {
        return criteria[criteria?.length - 1]?.symbol === "||";
    }, [criteria]);

    const eventsToShow = useMemo(() => {
        return events.filter((item) => item.toLowerCase().includes(inputValue ? inputValue.toLowerCase() : "")).filter((item) => !orEventList.includes(item));
    }, [events, inputValue, orEventList]);

    useEffect(() => {
        resetStatsState();
        resetDetectionState();
        setCriteria([]);
        setCriteria2([]);
        setMode("");
        setK(1);
        setFrom(null);
        setTill(null);
        setPatternConstraints(null);
        setReturnAll(null);
        setTimeoutValue(null);
        setGroups(null);
        setWnm(null);
        setTabValue("1");
    }, [indexId, resetDetectionState, resetStatsState]);

    useEffect(() => {
        onStatsResult(stats);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stats]);

    useEffect(() => {
        onLoadingStats(loadingStats);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingStats]);

    useEffect(() => {
        onDetectionResult(detection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detection]);

    useEffect(() => {
        onExploreResult(explore);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [explore]);

    useEffect(() => {
        onExploreLoading(loadingExplore);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingExplore]);

    useEffect(() => {
        onLoadingDetection(loadingDetection);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingDetection]);

    useEffect(() => {
        onDetectionError(detectionError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detectionError]);

    useEffect(() => {
        onTimeoutError(timeoutError);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeoutError]);

    useEffect(() => {
        onCriteriaChange(criteria);
    }, [onCriteriaChange, criteria]);

    useEffect(() => {
        onCriteriaChange2(criteria2);
    }, [onCriteriaChange2, criteria2]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        onTabValueChange(newValue);
    };

    const toggleShow = () => {
        setShow(!show);
    };

    const appendCriteria = (item) => {
        setCriteria(criteria.concat([item]));
    };

    const appendCriteria2 = (item) => {
        setCriteria2(criteria2.concat([item]));
    };

    const removeCriteria = (index) => {
        const affectedFilters = filters.map((item, index) => ({ item, index })).filter((a) => a.item?.value?.posA === criteria[index].id || a.item?.value?.posB === criteria[index].id).map(({index}) => index);
        affectedFilters.forEach((index) => {
            removeFilter(index);
        });
        const criteriaList = criteria.splice(0);

        if (criteriaList[index].isFirstOr) {
            if (criteriaList[index + 1]?.isMidOr) {
                criteriaList[index + 1].isMidOr = false;
                criteriaList[index + 1].isFirstOr = true;
            } else if (criteriaList[index + 1]?.isLastOr) {
                criteriaList[index + 1].isLastOr = false;
            }
        } else if (criteriaList[index]?.isLastOr) {
            if (criteriaList[index - 1]?.isMidOr) {
                criteriaList[index - 1].isMidOr = false;
                criteriaList[index - 1].isLastOr = true;
                criteriaList[index - 1].symbol = "_";
            } else if (criteriaList[index - 1]?.isFirstOr) {
                criteriaList[index - 1].isFirstOr = false;
                criteriaList[index - 1].symbol = "_";
            }
        }

        setOrEventList(orEventList.filter(e => e !== criteriaList[index].name));
        criteriaList.splice(index, 1);
        setCriteria(criteriaList);
    };

    const removeCriteria2 = (index) => {
        const criteriaList2 = criteria2.splice(0);
        criteriaList2.splice(index, 1);
        setCriteria2(criteriaList2);
    };

    const removePatternConstraints = (index) => {
        const patternConstraintsList = patternConstraints.splice(0);
        patternConstraintsList.splice(index, 1);
        setPatternConstraints(patternConstraintsList);
    };

    const removeFilter = (index) => {
        const filtersList = filters.slice(0);
        const deletedFilter = filtersList.splice(index, 1)[0];
        unsetFilter(deletedFilter);
        setFilters(filtersList);
    };

    const unsetFilter = (filter) => {
        switch (filter.key) {
            case "from":
                setFrom(undefined);
                break;
            case "till":
                setTill(undefined);
                break;
            case "returnAll":
                setReturnAll(undefined);
                break;
            case "groups":
                setGroups(undefined);
                break;
            case "wnm":
                setWnm(undefined);
                break;
            case "timeoutValue":
                setTimeoutValue(undefined);
                break;
            default:
                removePatternConstraints(patternConstraints.findIndex((el) => el.id === filter.key));
        }
    };

    const onFocusHandler = () => {
        setIsInputFocused(true);
    }

    const onFocusHandler2 = () => {
        setIsInputFocused2(true);
    }

    const onBlurHandler = (event) => {
        if (!event.relatedTarget?.id.startsWith("popover")) {
            setIsInputFocused(false);
            setSelectedEvent(false);
        }
    }

    const onBlurHandler2 = (event) => {
        if (!event.relatedTarget?.id.startsWith("popover")) {
            setIsInputFocused2(false);
        }
    }

    const handleAppendCriteria = (name, symbol) => {
        if (symbol === "||") {
            setOrEventList(orEventList.concat([name]));
        } else if (symbol === "_") {
            setOrEventList([]);
        }
        appendCriteria({
            id: uuidv4(),
            name,
            symbol,
            isFirstOr: (symbol === "||") && !isLastCriteriumSymbolOR,
            isMidOr: (symbol === "||") && isLastCriteriumSymbolOR,
            isLastOr: (symbol === "_") && isLastCriteriumSymbolOR
        });
        onBlurHandler({
            event: {
                relatedTarget: {
                    id: "popover"
                }
            }
        });
        setInputValue("");
        textInputRef.current.value = "";
    };

    const handleAppendCriteria2 = (name) => {
        appendCriteria2({
            id: uuidv4(),
            name
        });
        onBlurHandler2({
            event: {
                relatedTarget: {
                    id: "popover"
                }
            }
        });
        setInputValue2("");
        textInputRef2.current.value = "";
    };

    const onSave = (from, till, patternConstraints, returnAll, groups, wnm, timeoutValue) => {
        setFrom(from);
        setTill(till);
        setPatternConstraints(patternConstraints);
        setReturnAll(returnAll);
        setGroups(groups);
        setTimeoutValue(timeoutValue);
        if (wnm?.k || wnm?.uncertaintyPerEvent) {
            if (!wnm.k) {
                wnm.k = "1";
            }
            if (!wnm.uncertaintyPerEvent) {
                wnm.uncertaintyPerEvent = "1";
            }
            setWnm(wnm);
        }
        setShow(false);
    };

    const submitQuery = () => {
        if (criteria.length > 1) {
            getStats(indexId, criteria);
            getDetection(indexId, criteria, from, till, patternConstraints, returnAll, groups, wnm, timeoutValue);
            onWnmChange(wnm);
        }
    };

    const submitQuery2 = () => {
        if (criteria2.length > 0) {
            getExplore(indexId, criteria2, mode, k);
        }
    };

    useEffect(() => {
        const granularityMap = {
            "seconds": "s",
            "minutes": "min",
            "hours": "h"
        };
        const newFilters = [];

        if (from) {
            newFilters.push({
                "key": "from",
                "title": "From: " + from.format("YYYY-MM-DD HH:mm"),
                "value": from
            });
        }

        if (till) {
            newFilters.push({
                "key": "till",
                "title": "Till: " + till.format("YYYY-MM-DD HH:mm"),
                "value": till
            });
        }

        if (patternConstraints) {
            patternConstraints.forEach((pattern) => {
                const eventA = criteria.find(c => c.id === pattern.posA);
                const eventB = criteria.find(c => c.id === pattern.posB);

                let label = eventA.name + (eventA.symbol !== "_" ? eventA.symbol : "");
                label += " is " + pattern.type.replace("tl", "t l");
                label += " " + pattern.constraint + (pattern.constraint_type === "timeConstraint" ? granularityMap[pattern.granularity] : " positions away");
                label += " from " + eventB.name + (eventB.symbol !== "_" ? eventB.symbol : "");
                newFilters.push({
                    "key": pattern.id,
                    "title": label,
                    "value": pattern
                });
            });
        }

        if (returnAll) {
            newFilters.push({
                "key": "returnAll",
                "title": "Return all",
                "value": returnAll
            });
        }

        if (timeoutValue) {
            newFilters.push({
                "key": "timeoutValue",
                "title": "Timeout: " + timeoutValue,
                "value": timeoutValue
            });
        }

        if (groups) {
            newFilters.push({
                "key": "groups",
                "title": "Groups configuration: " + (groups.length > 20 ? (groups.substring(0, 9) + "..." + groups.substring(groups.length - 9)) : groups),
                "value": groups
            });
        }

        if (wnm) {
            newFilters.push({
                "key": "wnm",
                "title": "WNM Configuration (k: " + wnm.k + " " + wnm.granularityK + ", uncertainty: " + wnm.uncertaintyPerEvent + " " + wnm.granularityUncertainty + ")",
                "value": wnm
            });
        }

        setFilters(newFilters);
    }, [criteria, from, till, patternConstraints, returnAll, groups, wnm, timeoutValue]);

    return (
        <Grid
            item
            className="search"
        >
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="Metadata" value="1" />
                        <Tab label="Search" value="2" />
                        <Tab label="Explore" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {!metadata ? (
                        <CircularProgress />
                    ) : (
                        <Metadata
                            metadata={metadata}
                            indexId={indexId}
                            events={events}
                        />
                    )}
                </TabPanel>
                <TabPanel value="2">
                    <Grid
                        container
                        className="searchWrapper"
                        direction="row"
                        alignItems="center"
                    >
                        {criteria.map((item, index) => (
                            <Grid
                                key={index}
                                item
                            >
                                <Chip
                                    className={clsx("filterItem", {
                                        "firstOr": item.isFirstOr,
                                        "midOr": item.isMidOr,
                                        "lastOr": item.isLastOr,
                                    })}
                                    onDelete={() => removeCriteria(index)}
                                    label={item.name + (item.symbol !== "_" ? item.symbol : "")}
                                />
                            </Grid>
                        ))}

                        <Grid item>
                            <input
                                ref={textInputRef}
                                onChange={(event) => setInputValue(event.target.value)}
                                type="text"
                                placeholder="Add event..."
                                onFocus={onFocusHandler}
                                onBlur={onBlurHandler}
                            />
                        </Grid>

                        <Popper
                            ref={popperRef}
                            anchorEl={textInputRef?.current}
                            open={isInputFocused || isLastCriteriumSymbolOR}
                            placement={"bottom-start"}
                            tabIndex="0"
                            id="popover1"
                            onBlur={onBlurHandler}
                        >
                            <Grid
                                container
                                wrap="nowrap"
                                className="eventList"
                                direction={"column"}
                            >
                                {eventsToShow.map((item) => (
                                    <Grid
                                        xs={12}
                                        key={item}
                                        item
                                        className={clsx("eventItem", {"eventSelectedItem": selectedEvent === item})}
                                        onClick={() => setSelectedEvent(item)}
                                    >
                                        {item}
                                    </Grid>
                                ))}
                            </Grid>
                        </Popper>

                        <Popper
                            anchorEl={popperRef?.current}
                            open={!!selectedEvent || isLastCriteriumSymbolOR}
                            placement={"right-start"}
                            tabIndex="0"
                            id="popover2"
                            onBlur={onBlurHandler}
                        >
                            <Grid
                                container
                                className="eventList"
                                direction={"column"}
                            >
                                {((!!wnm || eventsToShow.length === 1) ? ["_"] : (isLastCriteriumSymbolOR ? ["_", "||"] : symbols)).map((item) => (
                                    <Grid
                                        key={item}
                                        item
                                        className={clsx("eventItem", {"eventSelectedItem": selectedEvent === item})}
                                        onClick={() => selectedEvent && handleAppendCriteria(selectedEvent, item)}
                                    >
                                        {item}
                                    </Grid>
                                ))}
                            </Grid>
                        </Popper>
                    </Grid>

                    <Chip
                        label={"Add filters +"}
                        clickable
                        onClick={toggleShow}
                        variant="outlined"
                        className="mr1 mb1"
                    />

                    <Grid
                        container
                        className="mb1"
                    >
                        {filters.map((filter, index) => (
                            <Grid key={index}>
                                <Chip
                                    label={filter.title}
                                    onDelete={() => removeFilter(index)}
                                    variant="outlined"
                                    className="mr1 mb1"
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Chip
                                label={"Submit Query"}
                                clickable={criteria.length > 1}
                                onClick={submitQuery}
                            />
                        </Grid>
                    </Grid>

                    <DrawerComponent
                        onClose={toggleShow}
                        open={show}
                    >
                        <Filters
                            criteria={criteria}
                            filters={filters}
                            onSave={onSave}
                        />
                    </DrawerComponent>
                </TabPanel>
                <TabPanel value="3">
                    <Grid
                        container
                        className="searchWrapper"
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        {criteria2.map((item, index) => (
                            <Grid
                                key={index}
                                item
                            >
                                <Chip
                                    className="filterItem"
                                    onDelete={() => removeCriteria2(index)}
                                    label={item.name}
                                />
                            </Grid>
                        ))}

                        <Grid item>
                            <input
                                ref={textInputRef2}
                                onChange={(event) => setInputValue2(event.target.value)}
                                type="text"
                                placeholder="Add event..."
                                onFocus={onFocusHandler2}
                                onBlur={onBlurHandler2}
                            />
                        </Grid>

                        <Popper
                            ref={popperRef2}
                            anchorEl={textInputRef2?.current}
                            open={isInputFocused2}
                            placement={"bottom-start"}
                            tabIndex="0"
                            id="popover1"
                            onBlur={onBlurHandler2}
                            className={"zIndex"}
                        >
                            <Grid
                                container
                                wrap="nowrap"
                                className="eventList"
                                direction={"column"}
                            >
                                {events.filter((item) => item.toLowerCase().includes(inputValue2 ? inputValue2.toLowerCase() : "")).map((item) => (
                                    <Grid
                                        xs={12}
                                        key={item}
                                        item
                                        className={clsx("eventItem", {"eventSelectedItem": selectedEvent === item})}
                                        onClick={() => handleAppendCriteria2(item)}
                                    >
                                        {item}
                                    </Grid>
                                ))}
                            </Grid>
                        </Popper>
                    </Grid>
                    <Grid
                        container
                        className="searchWrapper"
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="mode-label">Mode</InputLabel>
                                    <Select
                                        labelId="mode-label"
                                        value={mode}
                                        label="Mode"
                                        onChange={(event) => (setMode(event.target.value))}
                                    >
                                        <MenuItem value="fast">fast</MenuItem>
                                        <MenuItem value="accurate">accurate</MenuItem>
                                        <MenuItem value="hybrid">hybrid</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>

                        {mode === "hybrid" && (
                            <Grid item>
                                <input
                                    onChange={(event) => (setK(event.target.value))}
                                    type="number"
                                    placeholder="K"
                                    value={k}
                                />
                            </Grid>
                        )}

                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Chip
                                    label={"Submit Query"}
                                    clickable={criteria2.length > 0}
                                    onClick={submitQuery2}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>
            </TabContext>
        </Grid>
    );
}

export default Search;
