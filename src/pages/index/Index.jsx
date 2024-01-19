import React, {useEffect, useMemo, useState} from 'react';
import "./Index.scss";
import Search from "../../components/search/Search";
import {useParams} from "react-router-dom";
import {useEventTypes} from "../../services/endpoints/eventTypes";
import {useMetadata} from "../../services/endpoints/metadata";
import Result from "../../components/result/Result";
import {Grid} from "@mui/material";
import Result2 from "../../components/result/Result2";


const Index = () => {

    const {indexId} = useParams();
    const {getEventTypes, eventTypes} = useEventTypes();
    const {getMetadata, metadata} = useMetadata();
    const [stats, setStats] = useState(undefined);
    const [loadingStats, setLoadingStats] = useState(undefined);
    const [detection, setDetection] = useState(undefined);
    const [loadingDetection, setLoadingDetection] = useState(undefined);
    const [detectionError, setDetectionError] = useState(undefined);
    const [timeoutError, setTimeoutError] = useState(undefined);
    const [searchTabValue, setSearchTabValue] = useState("1");
    const [criteria, setCriteria] = useState([]);
    const [criteria2, setCriteria2] = useState([]);
    const [wnm, setWnm] = useState(undefined);
    const [explore, setExplore] = useState([]);
    const [exploreLoading, setExploreLoading] = useState(undefined);

    const onStatsResult = (value) => {
        setStats(value);
    };

    const onLoadingStats = (value) => {
        setLoadingStats(value);
    };

    const onDetectionResult = (value) => {
        setDetection(value);
    };

    const onLoadingDetection = (value) => {
        setLoadingDetection(value);
    };

    const onDetectionError = (value) => {
        setDetectionError(value);
    };

    const onTimeoutError = (value) => {
        setTimeoutError(value);
    };

    const onSearchTabValueChange = (value) => {
        setSearchTabValue(value);
    };

    const onCriteriaChange = (value) => {
        setCriteria(value);
    };

    const onCriteriaChange2 = (value) => {
        setCriteria2(value);
    };

    const onWnmChange = (value) => {
        setWnm(value);
    };

    const onExploreResult = (value) => {
        setExplore(value);
    };

    const onExploreLoading = (value) => {
        setExploreLoading(value);
    };

    const getCriteria = useMemo(() => {
        if (criteria && criteria.length > 0) {
            let criteriaString = "";
            criteria.forEach((criterium) => {
                criteriaString += criterium.name;
            });
            return criteriaString;
        }
        return "";
    }, [criteria]);

    useEffect(() => {
        getEventTypes(indexId);
        getMetadata(indexId);
        setStats(undefined)
        setLoadingStats(undefined)
        setDetection(undefined)
        setLoadingDetection(undefined)
        setExplore(undefined)
        setExploreLoading(undefined)
        setSearchTabValue("1")
    }, [getEventTypes, getMetadata, indexId]);

    return (
        <Grid
            item
            container
            justifyContent={"space-between"}
        >
            <Grid
                item
                className="listContainer"
                xs={12}
            >
                <Search
                    events={eventTypes.sort()}
                    indexId={indexId}
                    metadata={metadata}
                    onStatsResult={onStatsResult}
                    onLoadingStats={onLoadingStats}
                    onDetectionResult={onDetectionResult}
                    onLoadingDetection={onLoadingDetection}
                    onDetectionError={onDetectionError}
                    onTimeoutError={onTimeoutError}
                    onTabValueChange={onSearchTabValueChange}
                    onCriteriaChange={onCriteriaChange}
                    onCriteriaChange2={onCriteriaChange2}
                    onWnmChange={onWnmChange}
                    onExploreResult={onExploreResult}
                    onExploreLoading={onExploreLoading}
                />
            </Grid>

            {(stats || detection || loadingStats || loadingDetection) && searchTabValue === "2" && (
                <Grid
                    item
                    className="listContainer"
                    xs={12}
                >
                    <Result
                        stats={stats}
                        loadingStats={loadingStats}
                        detection={detection}
                        loadingDetection={loadingDetection}
                        detectionError={detectionError}
                        timeoutError={timeoutError}
                        criteria={getCriteria}
                        wnm={wnm}
                    />
                </Grid>
            )}

            {(explore || exploreLoading) && searchTabValue === "3" && (
                <Grid
                    item
                    className="listContainer"
                    xs={12}
                >
                    <Result2
                        explore={explore}
                        exploreLoading={exploreLoading}
                        criteria={criteria2}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default Index;
