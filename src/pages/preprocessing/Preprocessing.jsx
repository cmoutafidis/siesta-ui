import React, {useEffect, useMemo, useRef, useState} from 'react';
import "./Preprocessing.scss";
import PreprocessTableView from "../../components/preprocesstable-view/TableView";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Popper,
    Select,
    List,
    Step,
    StepLabel,
    Stepper,
    styled,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography, Checkbox, FormGroup, FormControlLabel
} from "@mui/material";
import {useProcesses} from "../../services/endpoints/processes";
import {useLognames} from "../../services/endpoints/lognames";
import CircularProgress from "@mui/material/CircularProgress";
import {Refresh} from "@mui/icons-material";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Preprocessing = () => {
    const {submitFile, submitProcess, getVars, varsResponse, setVars, processes, getProcesses, loading} = useProcesses();
    const {getLognames, lognames} = useLognames();

    const [logs, setLogs] = useState();
    const [open, setOpen] = useState(false);
    const [nextLoading, setNextLoading] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState();
    const [activeStep, setActiveStep] = useState(0);
    const [file, setFile] = useState(undefined);
    const [fileSubmitted, setFileSubmitted] = useState(false);
    const [localVars, setLocalVars] = useState({});
    const [processData, setProcessData] = useState({});
    const [openPopper, setOpenPopper] = useState(false);
    const popperRef = useRef(null);

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

    const handleClose = () => {
        setOpen(false);
        setFileSubmitted(false);
        setFile(undefined);
    };

    const handleOpen = () => {
        setOpen(true);
        setActiveStep(0);
        getVars();
        getLognames();
        setProcessData({
            spark_master: "local[*]",
            database: "s3",
            mode: "positions",
            system: "siesta",
            compression: "snappy",
            spark_parameters: "",
            file: "",
            logname: "",
            delete_all: false,
            delete_prev: false,
            split_every_days: 30,
            lookback: 30,
        });
    };

    const handleSelect = (process, error) => {
        setSelectedProcess(process);
        setLogs(error);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            handleSubmitFile();
        } else if (activeStep === 1) {
            handleSetVars();
        } else if (activeStep === 2) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else if (activeStep === 3) {
            handleProcessSubmit();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmitFile = () => {
        if (!fileSubmitted) {
            setNextLoading(true);
            submitFile(file).then((resp) => {
                handleProcessDataInputChange("file", resp.uuid + "/" + file.name);
                setFileSubmitted(true);
                setNextLoading(false);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            });
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleProcessSubmit = () => {
        setNextLoading(true);
        submitProcess(processData).then(() => {
            setNextLoading(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setTimeout(() => {
                setOpen(false);
                getProcesses();
            }, 3000);
        });
    };

    const handleSetVars = () => {
        setNextLoading(true);
        setVars(localVars).then(() => {
            setNextLoading(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
    };

    const handleToggleChange = (e) => {
        handleProcessDataInputChange("database", e.target.value);
    };

    const handleVarInputChange = (field, value) => {
        setLocalVars({...localVars, [field]: value});
    };

    const handleProcessDataInputChange = (field, value) => {
        setProcessData({...processData, [field]: value});
    };

    const handleLognameClick = (logname) => {
        handleProcessDataInputChange("logname", logname);
        setOpenPopper(false);
    }

    const disableNextButton = useMemo(() => {
        return (activeStep === 0 && !file) || (activeStep === 2 && !processData.logname);
    }, [activeStep, file, processData.logname]);

    const showLognameMoreFields = useMemo(() => {
        return processData.logname && !lognames?.includes(processData.logname);
    }, [lognames, processData.logname]);

    useEffect(() => {
        setFileSubmitted(false);
    }, [file]);

    useEffect(() => {
        setLocalVars({...varsResponse});
    }, [varsResponse]);

    useEffect(() => {
        getLognames();
    }, [getLognames]);

    const steps = ['Upload file', 'Update database settings', 'Update process setting', 'Submit process'];

    const views = [
        <>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload file
                <VisuallyHiddenInput onChange={(e) => setFile(e.target.files[0])} type="file" />
            </Button>
            <span className="ml1">{file?.name}</span>
        </>,
        <Grid
            container
            direction={"column"}
        >
            <Grid item>
                <ToggleButtonGroup
                    color="primary"
                    value={processData.database}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="s3">{"S3"}</ToggleButton>
                    <ToggleButton value="cassandra">{"Cassandra"}</ToggleButton>
                </ToggleButtonGroup>
            </Grid>

            <Grid item>
                {processData.database === "s3" && (
                    <Grid
                        container
                        spacing={1}
                        className="mt1"
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.s3accessKeyAws}
                                id="s3-access-key-aws"
                                label="Access Key"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("s3accessKeyAws", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.s3secretKeyAws}
                                id="s3-secret-key-aws"
                                label="Secret Key"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("s3secretKeyAws", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.s3ConnectionTimeout}
                                id="s3-connection-timeout"
                                label="Connection Timeout"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("s3ConnectionTimeout", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.s3endPointLoc}
                                id="s3-endpoint-location"
                                label="Endpoint Location"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("s3endPointLoc", e.target.value)}
                            />
                        </Grid>
                    </Grid>
                )}

                {processData.database === "cassandra" && (
                    <Grid
                        container
                        spacing={1}
                        className="mt1"
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_host}
                                id="cassandra-host"
                                label="Host"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_host", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_port}
                                id="cassandra-port"
                                label="Port"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_port", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_user}
                                id="cassandra-user"
                                label="User"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_user", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_pass}
                                id="cassandra-password"
                                label="Password"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_pass", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_replication_factor}
                                id="cassandra-replication-factor"
                                label="Replication Factor"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_replication_factor", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={localVars.cassandra_gc_grace_seconds}
                                id="cassandra-gc-grace-seconds"
                                label="GC Grace Seconds"
                                variant="outlined"
                                onChange={(e) => handleVarInputChange("cassandra_gc_grace_seconds", e.target.value)}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>,
        <>
            <Grid
                container
                direction={"column"}
            >
                <Grid item>
                    <Grid
                        container
                        spacing={1}
                        className="mt1"
                    >
                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={processData.spark_master}
                                id="spark_master"
                                label="Spark master"
                                variant="outlined"
                                onChange={(e) => handleProcessDataInputChange("spark_master", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <FormControl>
                                <InputLabel id="mode-label">Mode</InputLabel>
                                <Select
                                    labelId={"mode-label"}
                                    id="mode-select"
                                    value={processData.mode}
                                    label="Mode"
                                    onChange={(e) => handleProcessDataInputChange("mode", e.target.value)}
                                >
                                    <MenuItem value={"positions"}>Positions</MenuItem>
                                    <MenuItem value={"timestamps"}>Timestamps</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                value={processData.spark_parameters}
                                id="spark_parameters"
                                label="Spark parameters"
                                variant="outlined"
                                onChange={(e) => handleProcessDataInputChange("spark_parameters", e.target.value)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={6}
                        >
                            <TextField
                                ref={popperRef}
                                value={processData.logname}
                                id="logname"
                                label="Logname"
                                variant="outlined"
                                onChange={(e) => handleProcessDataInputChange("logname", e.target.value)}
                                onFocus={() => setOpenPopper(true)}
                                onBlur={(e) => !e?.relatedTarget?.className?.includes("thisisthelistclass") && setOpenPopper(false)}
                            />

                            {lognames?.filter(name => name.includes(processData.logname)).length > 0 && (
                                <Popper style={{zIndex: 9999}} placement={"bottom-start"} id={"logname-popper"} open={openPopper} anchorEl={popperRef?.current}>
                                    <div className="popper-wrapper">
                                        <List>
                                            {lognames.filter(name => name.includes(processData.logname)).map((logname) => (
                                                <ListItem
                                                    key={logname}
                                                    disablePadding
                                                    onClick={() => handleLognameClick(logname)}
                                                >
                                                    <ListItemButton className={"thisisthelistclass"}>
                                                        <ListItemText primary={logname} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>
                                </Popper>
                            )}
                        </Grid>

                        {showLognameMoreFields && (
                            <>
                                <Grid
                                    item
                                    xs={6}
                                >
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Checkbox
                                                checked={processData.delete_all}
                                                onChange={(e) => handleProcessDataInputChange("delete_all", e.target.checked)}
                                            />
                                        } label="Delete all" />
                                    </FormGroup>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Checkbox
                                                checked={processData.delete_prev}
                                                onChange={(e) => handleProcessDataInputChange("delete_prev", e.target.checked)}
                                            />
                                        } label="Delete previous" />
                                    </FormGroup>
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <TextField
                                        value={processData.split_every_days}
                                        id="split_every_days"
                                        label="Split every days"
                                        variant="outlined"
                                        type={"number"}
                                        onChange={(e) => handleProcessDataInputChange("split_every_days", e.target.value)}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                >
                                    <TextField
                                        value={processData.lookback}
                                        id="lookback"
                                        label="Lookback"
                                        variant="outlined"
                                        type={"number"}
                                        onChange={(e) => handleProcessDataInputChange("lookback", e.target.value)}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </>,
        <>
            <Grid
                className="summaryContainer"
                container
            >
                <Grid
                    item
                    xs={12}
                    className="mb1"
                >
                    <h4>Summary</h4>
                </Grid>

                {item("Spark master", processData.spark_master)}
                {item("Database", processData.database)}
                {item("Mode", processData.mode)}
                {item("System", processData.system)}
                {item("Compression", processData.compression)}
                {item("Spark parameters", processData.spark_parameters)}
                {item("File", processData.file)}
                {item("Logname all", processData.logname)}
                {item("Delete all", processData.delete_all ? "true" : "false")}
                {item("Delete prev", processData.delete_prev ? "true" : "false")}
                {item("Split every days", processData.split_every_days)}
                {item("lookback", processData.lookback)}
            </Grid>
        </>
    ];

    return (
        <>
            <Grid className="listContainer">
                <Grid
                    container
                    item
                    alignItems={"baseline"}
                    spacing={1}
                >
                    <Grid item>
                        <div className="listTitle">Processes</div>
                    </Grid>

                    <Grid item>
                        <Chip
                            label={"Add +"}
                            clickable
                            variant="outlined"
                            onClick={handleOpen}
                        />
                    </Grid>

                    <Grid item>
                        <Button
                            size="small"
                            className="refresh-icon"
                            onClick={getProcesses}
                        >
                            {loading ? (
                                <CircularProgress size={24} className="mui-icon" />
                            ) : (
                                <Refresh className="mui-icon" />
                            )}
                        </Button>
                    </Grid>
                </Grid>

                <PreprocessTableView
                    processes={processes}
                    getProcesses={getProcesses}
                    loading={loading}
                    onSelect={handleSelect}
                />
            </Grid>

            <Grid
                item
                style={{"width": "100%"}}
            >

            </Grid>

            {selectedProcess && (
                <div className="listContainer">
                    <div className="listTitle">Logs</div>
                    <p>{logs}</p>
                </div>
            )}

            <Dialog classes={{ paper: "dialog"}} onClose={handleClose} open={open} disableEnforceFocus>
                <DialogTitle>Create new process</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => {
                            return (
                                <Step key={label}>
                                    <StepLabel >{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>{views[activeStep]}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button
                                    onClick={handleNext}
                                    disabled={disableNextButton}
                                >
                                    {nextLoading ? (
                                        <CircularProgress size={24} className="mui-icon" />
                                    ) : (
                                        activeStep === steps.length - 1 ? 'Submit' : 'Next'
                                    )}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Preprocessing;
