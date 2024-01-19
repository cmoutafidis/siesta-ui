import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {EXPLORE} from "../../core/constants";
import ConfigContext from "../../core/contexts/ConfigContext";

export const useExplore = () => {

    const {config} = useContext(ConfigContext);
    const [explore, setExplore] = useState(undefined);
    const [loadingExplore, setLoadingExplore] = useState(undefined);

    const getExplore = useCallback((logName, criteria, mode, k) => {
        setLoadingExplore(true);
        const data = {
            log_name: logName,
            pattern: {
                events: criteria.map((item, index)=>({"name": item.name, "position": index}))
            },
            mode: mode
        };
        if (k) {
            data["k"] = parseInt(k);
        }

        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.post(config.BASE_URL + EXPLORE, data).then((response) => response.data)
            .then((resp) => {
                setExplore(resp);
                setLoadingExplore(false);
        });
    }, [config]);

    return {
        getExplore,
        explore,
        loadingExplore
    }

};
