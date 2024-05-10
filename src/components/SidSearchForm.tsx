import { Box, Button } from "@mui/material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import NumericalInput from "./NumericalInput";
import { Dayjs } from "dayjs";
import ProgressBar from "./ProgressBar";

function SidSearchForm({
  onSearch,
  groupSeed,
  onResult,
}: {
  onSearch: () => void;
  groupSeed: number;
  onResult: (
    seed: number,
    sid: number,
    hour: number,
    min_sec: number,
    advances: number,
    delay: number
  ) => void;
}) {
  const [formData, setFormData] = useState({
    tid: 0,
    day: 0,
    month: 0,
    delay_min: 5000,
    delay_max: 65536,
    max_advances: 1 << 15,
  });
  const [progress, setProgress] = useState(0);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
    const { tid, day, month, delay_min, delay_max, max_advances } = formData;
    const worker = new Worker(
      new URL("../workers/SidSearchWorker.js", import.meta.url),
      { type: "module" }
    );
    let loaded = false;
    // TODO: more sensible communication
    worker.onmessage = (event) => {
      if (loaded) {
        if (typeof event.data === "number") {
          setProgress(
            event.data / ((formData.delay_max - formData.delay_min) * 24 * 1.19)
          );
        } else if (Array.isArray(event.data)) {
          onResult(
            event.data[0],
            event.data[1],
            event.data[2],
            event.data[3],
            event.data[4],
            event.data[5]
          );
        }
        return;
      }
      if (event.data === "Loaded") {
        loaded = true;
        worker.postMessage([
          tid,
          groupSeed,
          day,
          month,
          delay_min,
          delay_max,
          max_advances,
        ]);
      }
    };
    worker.postMessage("Load");
  };

  const handleTIDChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    setFormData({
      ...formData,
      tid: value,
    });
  };
  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;
    setFormData({
      ...formData,
      day: date.date(),
      month: date.month() + 1,
    });
  };
  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <NumericalInput
        label="Trainer ID"
        name="tid"
        minimumValue={0}
        maximumValue={65535}
        changeSignal={handleTIDChange}
      ></NumericalInput>
      <DatePicker
        label="Save Creation Date"
        slotProps={{ textField: { fullWidth: true } }}
        onChange={handleDateChange}
      ></DatePicker>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Search
      </Button>
      <ProgressBar progress={progress}></ProgressBar>
    </Box>
  );
}

export default SidSearchForm;
