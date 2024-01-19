import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import "./UI.scss";
import {Grid} from "@mui/material";

const UI = (props) => {
    return (
        <div className="list">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <Grid
                    container
                    className="children"
                >
                    {props.children}
                </Grid>
            </div>
        </div>
    )
};

export default UI;
