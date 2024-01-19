import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {DETECTION} from "../../core/constants";
import ConfigContext from '../../core/contexts/ConfigContext';

export const useDetection = () => {

    const {config} = useContext(ConfigContext);
    const [detection, setDetection] = useState(undefined);
    const [detectionError, setDetectionError] = useState(undefined);
    const [timeoutError, setTimeoutError] = useState(undefined);
    const [loadingDetection, setLoadingDetection] = useState(null);

    const getDetection = useCallback((logName, criteria, from, till, patternConstraints, returnAll, groups, wnm, timeoutValue) => {
        setLoadingDetection(true);
        setDetectionError(undefined);
        setTimeoutError(undefined);

        let index = 0;
        let flag = false;
        const data = {
            log_name: logName,
            from: from ? from.unix() * 1000 : undefined,
            till: till ? till?.unix() * 1000 : undefined,
            pattern: {
                eventsWithSymbols: criteria.map((c) => {
                    const data = {name: c.name, position: index, symbol: flag ? "_" : c.symbol }
                    if (c.symbol === "_") {
                        flag = false;
                    } else if (c.symbol === "||") {
                        if (!flag) {
                            flag = true;
                        }
                    }

                    if (c.symbol !== "||") {
                        index += 1;
                    }
                    return data;
                }),
                constraints: patternConstraints?.map((item) => ({posA: item.posAIndex, posB: item.posBIndex, type: item.type, constraint_type: item.constraint_type, constraint: parseInt(item.constraint), granularity: item.constraint_type === "timeConstraint" ? item.granularity : null}))
            },
            returnAll: returnAll,
            hasGroups: !!groups,
            "groups-config": groups ? {
                groups: groups
            } : null,
            whyNotMatchFlag: !!wnm,
            "wnm-config": wnm ? {
                granularityK: wnm?.granularityK,
                granularityUncertainty: wnm?.granularityUncertainty,
                k: wnm?.k,
                uncertaintyPerEvent: wnm?.uncertaintyPerEvent,
            } : null
        };
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        if (timeoutValue) {
            axios.defaults.timeout = parseInt(timeoutValue) * 1000;
        } else {
            axios.defaults.timeout = undefined;
        }
        axios.post(config.BASE_URL + DETECTION, data).then((response) => response.data)
            .then((resp) => {
            setDetection(resp);
            setLoadingDetection(false);
        }).catch((error) => {
            if (error.code === "ECONNABORTED") {
                setTimeoutError(error.message);
            } else {
                setDetectionError(error.response.data);
            }
            setLoadingDetection(false);
        });
    }, [config]);

    const resetDetectionState = useCallback(() => {
        setDetection(null);
        setLoadingDetection(null);
    }, []);

    return {
        getDetection,
        detection,
        loadingDetection,
        detectionError,
        timeoutError,
        resetDetectionState
    }

};
