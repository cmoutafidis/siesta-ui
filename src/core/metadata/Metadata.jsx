import React, {useState} from "react";
import "./Metadata.scss";
import {Grid} from "@mui/material";
import clsx from "clsx";

const Metadata = ({metadata, indexId, events}) => {

    const [inputValue, setInputValue] = useState();

    const item = (title, value) => {
        return (
            <Grid
                item
                container
                xs={6}
            >
                <Grid
                    item
                    xs={12}
                    className="title"
                >
                    {title}
                </Grid>
                <Grid
                    item
                    xs={12}
                    className="mb2"
                >
                    {value}
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid
            className="metadataContainer"
            container
        >
            <Grid
                item
                xs={12}
                className="mb1"
            >
                <h4>Parameters</h4>
            </Grid>

            {item("index", indexId)}
            {item("compression", metadata.compression)}
            {item("has_previous_stored", metadata.has_previous_stored.toString())}
            {item("lookback", metadata.lookback)}
            {item("mode", metadata.mode)}
            {item("split_every_days", metadata.split_every_days)}

            <Grid
                item
                xs={12}
                className="mb1"
            >
                <hr />
            </Grid>

            <Grid
                item
                xs={12}
                className="mb1"
            >
                <h4>Metadata</h4>
            </Grid>
            {item("start_ts", metadata.start_ts)}
            {item("last_ts", metadata.last_ts)}
            {item("events", parseInt(metadata.events).toLocaleString())}
            {item("pairs", parseInt(metadata.pairs).toLocaleString())}
            {item("traces", parseInt(metadata.traces).toLocaleString())}

            <Grid
                item
                xs={12}
                className="mb1"
            >
                <hr />
            </Grid>

            <Grid
                item
                xs={12}
                className="mb1"
            >
                <h4>Event types</h4>
            </Grid>



            <Grid>
                <Grid item>
                    <input
                        onChange={(event) => setInputValue(event.target.value)}
                        type="text"
                        placeholder="Search event..."
                    />
                </Grid>

                <Grid
                    container
                    wrap="nowrap"
                    className="eventList"
                    direction={"column"}
                >
                    {events.filter((item) => item.toLowerCase().includes(inputValue ? inputValue.toLowerCase() : "")).map((item) => (
                        <Grid
                            xs={12}
                            key={item}
                            item
                            className={clsx("eventItem")}
                        >
                            {item}
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Metadata;
