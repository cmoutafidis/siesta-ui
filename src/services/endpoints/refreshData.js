import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {REFRESH_DATA} from "../../core/constants";
import ConfigContext from "../../core/contexts/ConfigContext";

export const useRefreshData = () => {

    const {config} = useContext(ConfigContext);
    const [loading, setLoading] = useState(false);

    const refreshData = useCallback(() => {
        setLoading(true);
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.get(config.BASE_URL + REFRESH_DATA).then((response) => response.data).then(() => {
            setLoading(false);
        })
    }, [config]);

    return {
        refreshData,
        loading
    };

};
