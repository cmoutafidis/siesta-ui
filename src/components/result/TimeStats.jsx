import {useMemo} from "react";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Doughnut } from 'react-chartjs-2';


const TimeStats = ({timeStats}) => {

    const data = useMemo(() => {
        if (timeStats) {
            return {
                labels: [
                    'Pruning Time (ms)',
                    'Validation Time (ms)'
                ],
                datasets: [{
                    label: 'Time stats',
                    data: [timeStats["time for pruning in ms"], timeStats["time for validation in ms"]],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            }
        }
        return undefined;
    }, [timeStats]);

    const plugin = useMemo(() => {
        return {
            beforeDraw: (chart) => {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                ctx.restore();
                var fontSize = (height / 160).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "top";
                var text = timeStats["response time in ms"] + "ms",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }
    }, [timeStats]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                sx={{ width: '400px', mb: 2 }}
                elevation={0}
            >
                {data && (
                    <Doughnut data={data} plugins={[plugin]} />
                )}
            </Paper>
        </Box>
    );
}

export default TimeStats;
