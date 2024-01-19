import React, {useEffect, useState} from 'react';
import './Navbar.scss';
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import {useLocation} from "react-router-dom";
import {Typography} from "@mui/material";

const Navbar = () => {

    const location = useLocation();
    const [indexId, setIndexId] = useState(undefined);

    useEffect(() => {
        setIndexId(location.pathname.split("/")[2]);
    }, [location.pathname]);

    return (
        <div className="navbar">
            <Typography className={"title"}>
                {indexId}
            </Typography>
            {/*<div className="wrapper">*/}
            {/*    <div className="items">*/}
            {/*        <div className="item">*/}
            {/*            <SearchOutlinedIcon className="itemIcon" />*/}
            {/*        </div>*/}

            {/*        <div className="item">*/}
            {/*            <NotificationsNoneOutlinedIcon className="itemIcon" />*/}
            {/*            <div className="counter">1</div>*/}
            {/*        </div>*/}

            {/*        <div className="item">*/}
            {/*            <ListOutlinedIcon className="itemIcon" />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default Navbar;
