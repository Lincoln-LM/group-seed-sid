import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LotteryForm from "./components/LotteryForm";
import SidSearchForm from "./components/SidSearchForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";
import { useState } from "react";
import ResultTable from "./components/ResultTable";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [groupSeed, setGroupSeed] = useState(0);
  const [rows, setRows] = useState<[number, number][]>([]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <h1>Group Seed to SID</h1>
        <div>
          <LotteryForm onResult={setGroupSeed} />
          <SidSearchForm
            onSearch={() => setRows([])}
            onResult={(seed, sid) => setRows([...rows, [seed, sid]])}
            groupSeed={groupSeed}
          />
          <ResultTable rows={rows} />
        </div>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
