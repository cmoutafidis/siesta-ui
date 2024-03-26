import React, {useEffect, useMemo, useRef, useState} from "react";
import "./Search.scss";
import {
    Box,
    Checkbox,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Popper,
    Select,
    Slider,
    Tab,
    Typography
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
import ModesTable from "../result/ModesTable";
import {useModes} from "../../services/endpoints/modes";

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
    const [modesFilterObject, setModesFiltersObject] = useState({
        support: "0.9",
        positionsTemplates: [],
        existencesTemplates: [],
        orderedTemplates: [],
        orderedAlternateTemplates: [],
        orderedChainTemplates: [],
    });
    const [allChecked, setAllChecked] = useState({
        positions: false,
        existences: false,
        ordered: false
    });
    const {getStats, stats, loadingStats, resetStatsState} = useStats();
    const {getDetection, detection, loadingDetection, detectionError, timeoutError, resetDetectionState} = useDetection();
    const {getModes, positionPatterns, existencePatterns, orderedRelations, orderedRelationsAlternate, orderedRelationsChain, loadingModes, resetModesState} = useModes();
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

    const allModesSelected = useMemo(() => {
        return (modesFilterObject.orderedTemplates.length ? 1 : 0) + (modesFilterObject.orderedAlternateTemplates.length ? 1 : 0) + (modesFilterObject.orderedChainTemplates.length ? 1 : 0) > 1;
    }, [modesFilterObject]);

    const disableModesButton = useMemo(() => {
        return modesFilterObject.positionsTemplates.length + modesFilterObject.existencesTemplates.length + modesFilterObject.orderedTemplates.length + modesFilterObject.orderedAlternateTemplates.length + modesFilterObject.orderedChainTemplates.length  === 0;
    }, [modesFilterObject]);

    const modes = useMemo(() => {
        return {
            "position patterns": positionPatterns,
            "existence patterns": existencePatterns,
            "ordered relations": orderedRelations,
            "ordered relations alternate": orderedRelationsAlternate,
            "ordered relations chain": orderedRelationsChain,
        };
    }, [positionPatterns, existencePatterns, orderedRelations, orderedRelationsAlternate, orderedRelationsChain]);

    useEffect(() => {
        resetStatsState();
        resetDetectionState();
        resetModesState();
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
        setModesFiltersObject({
            support: "0.9",
            positionsTemplates: [],
            existencesTemplates: [],
            orderedTemplates: [],
            orderedAlternateTemplates: [],
            orderedChainTemplates: [],
        });
        setAllChecked({
            positions: false,
            existences: false,
            ordered: false
        });
    }, [indexId, resetDetectionState, resetModesState, resetStatsState]);

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

    const handleModeFiltersChange = (key, value) => {
        const newState = {
            ...modesFilterObject,
            [key]: value
        };
        setModesFiltersObject(newState);

        let positionsCheck = newState.positionsTemplates.length === 2;
        let existencesCheck = newState.existencesTemplates.length === 8;
        let orderedCheck = newState.orderedTemplates.length + newState.orderedAlternateTemplates.length + newState.orderedChainTemplates.length === 11;

        setAllChecked({
            positions: positionsCheck,
            existences: existencesCheck,
            ordered: orderedCheck
        });
    }

    const onSliderSupportChange = (event, newValue) => {
        setModesFiltersObject({
            ...modesFilterObject,
            support: newValue.toFixed(2).toString()
        });
    };

    const onSupportChange = (event) => {
        let finalValue = parseFloat(event.target.value);

        if (!event.nativeEvent.inputType) {
            let value;
            if (modesFilterObject.support === "") {
                if (parseFloat(event.target.value) > 0) {
                    value = "0.10";
                } else {
                    value = "0.00";
                }
                setModesFiltersObject({
                    ...modesFilterObject,
                    support: value
                });
                return;
            } else if (parseFloat(event.target.value) - parseFloat(modesFilterObject.support) > 0) {
                value = 0.01;
            } else {
                value = -0.01;
            }

            finalValue = ((parseFloat(modesFilterObject.support) + value).toFixed(2));
        }

        if (!isNaN(finalValue)) {
            if (finalValue > 1.00) {
                finalValue = "1.00";
            } else if (finalValue < 0) {
                finalValue = "0.00";
            }
        } else {
            finalValue = event.target.value;
        }

        setModesFiltersObject({
            ...modesFilterObject,
            support: finalValue.toString()
        });
    }

    const handleAllChecked = (key, checked) => {
        switch (key) {
            case "positions":
                if (checked) {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        positionsTemplates: ["first", "last"]
                    });
                } else {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        positionsTemplates: []
                    });
                }
                break;
            case "existences":
                if (checked) {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        existencesTemplates: [
                            "existence",
                            "absence",
                            "exactly",
                            "co-existence",
                            "not co-existence",
                            "choice",
                            "exclusive choice",
                            "responded existence"
                        ]
                    });
                } else {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        existencesTemplates: []
                    });
                }
                break;
            case "ordered":
                if (checked) {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        orderedTemplates: [
                            "response",
                            "precedence",
                            "succession",
                            "notSuccession"
                        ],
                        orderedAlternateTemplates: [
                            "response",
                            "precedence",
                            "succession",
                        ],
                        orderedChainTemplates: [
                            "response",
                            "precedence",
                            "succession",
                            "notSuccession"
                        ],
                    });
                } else {
                    setModesFiltersObject({
                        ...modesFilterObject,
                        orderedTemplates: [],
                        orderedAlternateTemplates: [],
                        orderedChainTemplates: [],
                    });
                }
                break;
            default:
                break;
        }
        setAllChecked({...allChecked, [key]: checked})
    };

    const getGroupCheckbox = (key, len) => {
        let counter = 0;

        Object.keys(modesFilterObject).forEach((item) => {
            if (item.startsWith(key)) {
                counter += modesFilterObject[item].length;
            }
        });

        return (
            <Grid
                item
                className="inline-block"
            >
                <Checkbox
                    checked={allChecked[key]}
                    indeterminate={counter < len && counter > 0}
                    onChange={(event, checked) => handleAllChecked(key, checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Grid>
        );
    }

    const getListCheckbox = (key, value, label) => {
        const keyChecked = modesFilterObject[key].includes(value);
        const checked = !!keyChecked;

        return (
            <Grid item>
                <Checkbox
                    checked={checked}
                    onChange={() => handleModeFiltersChange(key, modesFilterObject[key].includes(value) ? modesFilterObject[key].filter(i => i !== value) : modesFilterObject[key].concat(value))}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <span>{label ? label : value}</span>
            </Grid>
        );
    }

    const handleGetModes = () => {
        getModes(indexId, modesFilterObject, allModesSelected);
    }

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
                        <Tab label="Mining Constraint" value="4" />
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

                <TabPanel value="4">
                    {loadingDetection ? (
                        <CircularProgress />
                    ) : (
                        <Grid
                            container
                            direction={"column"}
                            spacing={1}
                        >
                            <Grid item>
                                <span>{"Support"}</span>
                            </Grid>

                            <Grid
                                item
                                container
                                spacing={1}
                            >
                                <Grid
                                    item
                                    className="slider-width"
                                >
                                    <Slider
                                        value={modesFilterObject.support ? parseFloat(modesFilterObject.support) : 0}
                                        onChange={onSliderSupportChange}
                                        aria-labelledby="input-slider"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                    />
                                </Grid>

                                <Grid item>
                                    <Input
                                        value={modesFilterObject.support}
                                        size="small"
                                        onChange={onSupportChange}
                                        className="slider-input-width"
                                        inputProps={{
                                            step: 0.1,
                                            min: 0,
                                            max: 1,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                        placeholder={"0.5"}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item>
                                &nbsp;
                            </Grid>

                            <Grid item>
                                <Grid
                                    container
                                    spacing={1}
                                >
                                    <Grid item>
                                        <Typography variant={"subtitle1"}>
                                            {getGroupCheckbox("positions", 2)}
                                            {"Positions"}
                                        </Typography>
                                        {getListCheckbox("positionsTemplates", "first", "init")}
                                        {getListCheckbox("positionsTemplates", "last")}
                                    </Grid>

                                    <Grid item>
                                        <Typography variant={"subtitle1"}>
                                            {getGroupCheckbox("existences", 8)}
                                            {"Existences"}
                                        </Typography>
                                        {getListCheckbox("existencesTemplates", "existence")}
                                        {getListCheckbox("existencesTemplates", "absence")}
                                        {getListCheckbox("existencesTemplates", "exactly")}
                                        {getListCheckbox("existencesTemplates", "co-existence")}
                                        {getListCheckbox("existencesTemplates", "not co-existence")}
                                        {getListCheckbox("existencesTemplates", "choice")}
                                        {getListCheckbox("existencesTemplates", "exclusive choice")}
                                        {getListCheckbox("existencesTemplates", "responded existence")}
                                    </Grid>

                                    <Grid item>
                                        <Typography variant={"subtitle1"}>
                                            {getGroupCheckbox("ordered", 11)}
                                            {"Ordered"}
                                        </Typography>

                                        <Grid
                                            container
                                            className={"width-unset"}
                                        >
                                            <Grid item>
                                                {getListCheckbox("orderedTemplates", "response")}
                                                {getListCheckbox("orderedTemplates", "precedence")}
                                                {getListCheckbox("orderedTemplates", "succession")}
                                                {getListCheckbox("orderedTemplates", "notSuccession", "not succession")}
                                            </Grid>

                                            <Grid item>
                                                {getListCheckbox("orderedAlternateTemplates", "response", "alternate response")}
                                                {getListCheckbox("orderedAlternateTemplates", "precedence", "alternate precedence")}
                                                {getListCheckbox("orderedAlternateTemplates", "succession", "alternate succession")}
                                            </Grid>

                                            <Grid item>
                                                {getListCheckbox("orderedChainTemplates", "response", "chain response")}
                                                {getListCheckbox("orderedChainTemplates", "precedence", "chain precedence")}
                                                {getListCheckbox("orderedChainTemplates", "succession", "chain succession")}
                                                {getListCheckbox("orderedChainTemplates", "notSuccession", "not chain succession")}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Chip
                                    label={"Submit Query"}
                                    clickable={criteria.length > 1}
                                    onClick={handleGetModes}
                                    disabled={disableModesButton}
                                />
                            </Grid>

                            {(modes["position patterns"] || modes["existence patterns"] || modes["ordered relations"] || modes["ordered relations alternate"] ||modes["ordered relations chain"] || loadingModes) && (
                                <Grid item>
                                    {loadingModes ? (
                                        <CircularProgress />
                                    ) : (
                                        <ModesTable
                                            modes={modes}
                                        />
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    )}
                </TabPanel>
            </TabContext>
        </Grid>
    );
}

export default Search;
