import React from "react";
import "./DrawerComponent.scss";
import {Drawer} from "@mui/material";

const DrawerComponent = (props) => {

    return (
        <>
            <Drawer
                anchor={"right"}
                open={props.open}
                onClose={props.onClose}
                classes={{paper: "drawer"}}
            >
                {props.children}
            </Drawer>
        </>
    )
};

export default DrawerComponent;