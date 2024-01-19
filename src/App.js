import Home from "./pages/home/Home";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Index from "./pages/index/Index";
import List from "./pages/list/List";
import UI from "./components/ui/UI";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'chart.js/auto';
import Preprocessing from "./pages/preprocessing/Preprocessing";
import ConfigContext from "./core/contexts/ConfigContext";
import {useContext} from "react";

function App() {

    const {loading} = useContext(ConfigContext);

    if (loading) {
        return <div>Loading configuration...</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="App">
                    <BrowserRouter>
                        <UI>
                            <Routes>
                                <Route path="/">
                                    <Route index element={<Home />} />

                                    <Route path="/indexes">
                                        <Route index element={<List />} />

                                        <Route path=":indexId" element={<Index />} />
                                    </Route>
                                    <Route path="/preprocessing" element={<Preprocessing />} />
                                </Route>
                            </Routes>
                        </UI>
                    </BrowserRouter>
                </div>
        </LocalizationProvider>
  );
}

export default App;
