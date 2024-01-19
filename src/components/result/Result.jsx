import React, {useEffect, useState} from "react";
import "./Result.scss";
import {Box, CircularProgress, Grid, Tab} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import StatsTable from "./StatsTable";
import DetectionTable from "./DetectionTable";
import TimeStats from "./TimeStats";
import AlmostOccurrences from "./AlmostOccurrences";

const Result = ({stats, loadingStats, detection, loadingDetection, detectionError, timeoutError, criteria, wnm}) => {

    const [tabValue, setTabValue] = useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (!wnm && tabValue === "4") {
            setTabValue("1");
        }
    }, [wnm, tabValue]);

    return (
        <Grid
            item
            className="result"
        >
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                        <Tab label="Stats" value="1" />
                        <Tab label="Detection" value="2" />
                        <Tab label="Almost Match" value="4" disabled={!wnm}/>
                        <Tab label="Time stats" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {loadingStats ? (
                        <CircularProgress />
                    ) : (
                        <StatsTable stats={stats} />
                    )}
                </TabPanel>
                <TabPanel value="2">
                    {loadingDetection ? (
                        <CircularProgress />
                    ) : (
                        <DetectionTable
                            detection={detection?.occurrences}
                            detectionError={detectionError}
                            timeoutError={timeoutError}
                            criteria={criteria}
                        />
                    )}
                </TabPanel>
                <TabPanel value="3">
                    {loadingDetection ? (
                        <CircularProgress />
                    ) : (
                        <TimeStats timeStats={detection?.timeStats} />
                    )}
                </TabPanel>
                <TabPanel value="4">
                    {loadingDetection ? (
                        <CircularProgress />
                    ) : (
                        <AlmostOccurrences
                            almostOccurrences={detection?.almostOccurrences}
                            criteria={criteria}
                        />
                    )}
                </TabPanel>
            </TabContext>
        </Grid>
    );
}

export default Result;
