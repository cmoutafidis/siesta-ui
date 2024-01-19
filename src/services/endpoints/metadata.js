import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {METADATA} from "../../core/constants";
import ConfigContext from "../../core/contexts/ConfigContext";

export const useMetadata = () => {

    const {config} = useContext(ConfigContext);
    const [metadata, setMetadata] = useState(undefined);

    const getMetadata = useCallback((logName) => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.post(config.BASE_URL + METADATA, {log_name: logName}).then((response) => response.data).then((resp) => {
            setMetadata({
                ...resp,
                start_ts: resp.start_ts,
                last_ts: resp.last_ts,
            });
        })
    }, [config]);

    return {
        getMetadata,
        metadata
    }

};
