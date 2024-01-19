import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {STATS} from "../../core/constants";
import ConfigContext from '../../core/contexts/ConfigContext';

export const useStats = () => {

    const {config} = useContext(ConfigContext);
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(null);

    const getStats = useCallback((logName, criteria) => {
        setLoadingStats(true);
        const data = {
            log_name: logName,
            pattern: {
                events: criteria.map((item)=>({"name": item.name}))
            }
        }
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.post(config.BASE_URL + STATS, data).then((response) => response.data).then((resp) => {
            setStats(resp);
            setLoadingStats(false);
        })
    }, [config]);

    const resetStatsState = useCallback(() => {
        setStats(null);
        setLoadingStats(null);
    }, []);

    return {
        getStats,
        stats,
        loadingStats,
        resetStatsState
    }

};
