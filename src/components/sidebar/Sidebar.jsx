import React, {useEffect, useState} from 'react';
import './Sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {Link, useLocation} from "react-router-dom";
import {useLognames} from "../../services/endpoints/lognames";
import {Refresh} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useRefreshData} from "../../services/endpoints/refreshData";
import CircularProgress from '@mui/material/CircularProgress';
import clsx from "clsx";

const Sidebar = () => {

    const [indexId, setIndexId] = useState(undefined);
    const {getLognames, lognames} = useLognames();
    const {refreshData, loading} = useRefreshData();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            getLognames();
        }
    }, [loading, getLognames]);

    useEffect(() => {
        setIndexId(location.pathname.split("/")[2]);
    }, [location.pathname]);

    return (
        <div className="sidebar">
            <div className="top">
                <Link className="link" to="/">
                    <span className="logo">Siesta</span>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <div className="button-container">
                        <p className="title button-container-item">Indexes</p>

                        <Button
                            size="small"
                            className="refresh-icon"
                            onClick={refreshData}
                        >
                            {loading ? (
                                <CircularProgress size={24} className="mui-icon" />
                            ) : (
                                <Refresh className="mui-icon" />
                            )}
                        </Button>
                    </div>
                    {lognames.map((index) => (
                        <Link
                            key={index}
                            className={clsx("link", {"selected": index === indexId})}
                            to={"/indexes/" + index}
                        >
                            <li>
                                <DashboardIcon className="icon" />
                                <span>{index}</span>
                            </li>
                        </Link>
                    ))}
                    <p className="title">Actions</p>

                    <Link
                        className="link"
                        to={"/preprocessing"}
                    >
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Preprocessing</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
