import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {EVENT_TYPES} from "../../core/constants";
import ConfigContext from "../../core/contexts/ConfigContext";

export const useEventTypes = () => {

    const {config} = useContext(ConfigContext);
    const [eventTypes, setEventTypes] = useState([]);

    const getEventTypes = useCallback((logName) => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.post(config.BASE_URL + EVENT_TYPES, {log_name: logName}).then((response) => response.data).then((resp) => {
            setEventTypes(resp);
        })
    }, [config]);

    return {
        getEventTypes,
        eventTypes
    }

};
