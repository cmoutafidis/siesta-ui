import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {LOGNAMES} from "../../core/constants";
import ConfigContext from "../../core/contexts/ConfigContext";

export const useLognames = () => {

    const {config} = useContext(ConfigContext);
    const [lognames, setLognames] = useState([]);

    const getLognames = useCallback(() => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.get(config.BASE_URL + LOGNAMES).then((response) => response.data).then((resp) => {
            setLognames(resp);
        })
    }, [config]);

    return {
        getLognames,
        lognames
    }

};
