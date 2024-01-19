import {useCallback, useContext, useState} from "react";
import axios from "axios";
import {FILE_UPLOAD, PREPROCESSES, PROCESSES, SETTING_VARS} from "../../core/constants";
import ConfigContext from '../../core/contexts/ConfigContext';

export const useProcesses = () => {

    const {config} = useContext(ConfigContext);
    const [loading, setLoading] = useState(false);
    const [processes, setProcesses] = useState(undefined);
    const [varsResponse, setVarsResponse] = useState(undefined);

    const getProcesses = useCallback(() => {
        setLoading(true);
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.get(config.PREPROCESS_BASE_URL + PROCESSES).then((response) => response.data).then((resp) => {
            setLoading(false);
            setProcesses(resp);
        });
    }, [config]);

    const submitFile = useCallback((file) => {
        const formData = new FormData();
        formData.append("file", file);

        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        return axios.post(config.PREPROCESS_BASE_URL + FILE_UPLOAD, formData).then((response) => response.data);
    }, [config]);

    const submitProcess = useCallback((processData) => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        return axios.post(config.PREPROCESS_BASE_URL + PREPROCESSES, processData).then((response) => response.data);
    }, [config]);

    const getVars = useCallback(() => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        axios.get(config.PREPROCESS_BASE_URL + SETTING_VARS).then((response) => response.data).then((resp) => {
            setVarsResponse(resp);
        });
    }, [config]);

    const setVars = useCallback((data) => {
        axios.defaults.headers.common['requireHeader'] = ['origin', 'x-requested-with'];
        return axios.post(config.PREPROCESS_BASE_URL + SETTING_VARS, data).then((response) => response.data);
    }, [config]);

    return {
        processes,
        getProcesses,
        loading,
        submitFile,
        submitProcess,
        varsResponse,
        getVars,
        setVars,
    };

};
