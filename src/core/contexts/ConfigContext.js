import {createContext, useEffect, useState} from 'react';

const ConfigContext = createContext({});
export default ConfigContext;

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/config.json')
            .then((response) => response.json())
            .then((configData) => {
                setConfig(configData);
                setLoading(false);
            })
            .catch(() => {
                setConfig({
                    "BASE_URL": "http://localhost:8090",
                    "PREPROCESS_BASE_URL": "http://localhost:8000",
                });
                setLoading(false);
            });
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
