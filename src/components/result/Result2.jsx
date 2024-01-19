import React from "react";
import "./Result2.scss";
import {CircularProgress, Grid} from "@mui/material";
import ExploreTable from "./ExploreTable";

const Result2 = ({explore, exploreLoading, criteria}) => {

    return (
        <Grid
            item
            className="result"
        >
            {exploreLoading ? (
                <CircularProgress />
            ) : (
                <ExploreTable
                    explore={explore}
                    criteria={criteria}
                />
            )}
        </Grid>
    );
}

export default Result2;
