import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import NumericalInput from "./NumericalInput";
import wasmLibrary from "../wasm/load";

function LotteryForm({ onResult }: { onResult: (groupSeed: number) => void }) {
  const lib = wasmLibrary();
  const [formData, setFormData] = useState({
    lottery1: 0,
    lottery2: 0,
    lottery3: 0,
  });
  const [groupSeed, setGroupSeed] = useState<number | undefined>(undefined);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    const { name } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = lib?.find_group_seed(
      formData.lottery1,
      formData.lottery2,
      formData.lottery3
    );
    if (result !== undefined) {
      setGroupSeed(result);
      onResult(result);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={2}>
      <NumericalInput
        label="Lottery #1"
        name="lottery1"
        minimumValue={0}
        maximumValue={65535}
        changeSignal={handleChange}
      ></NumericalInput>
      <NumericalInput
        label="Lottery #2"
        name="lottery2"
        minimumValue={0}
        maximumValue={65535}
        changeSignal={handleChange}
      ></NumericalInput>
      <NumericalInput
        label="Lottery #3"
        name="lottery3"
        minimumValue={0}
        maximumValue={65535}
        changeSignal={handleChange}
      ></NumericalInput>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Calculate Group Seed
      </Button>
      {isValid ? (
        groupSeed !== undefined ? (
          <h4>Group Seed: {groupSeed.toString(16)}</h4>
        ) : null
      ) : (
        <h4>Invalid input, no group seed found</h4>
      )}
    </Box>
  );
}

export default LotteryForm;
