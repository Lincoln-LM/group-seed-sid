import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ResultTable({
  rows,
}: {
  rows: [number, number, number, number, number, number][];
}) {
  console.log(rows);
  function buildRow(row: [number, number, number, number, number, number]) {
    const [seed, sid, hour, min_sec, advances, delay] = row;
    const max_value = Math.min(59, min_sec);
    const min_value = min_sec - max_value;
    const min_time = `${hour}:${min_value
      .toString()
      .padStart(2, "0")}:${max_value.toString().padStart(2, "0")}`;
    const max_time = `${hour}:${max_value
      .toString()
      .padStart(2, "0")}:${min_value.toString().padStart(2, "0")}`;
    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {seed.toString(16)}
        </TableCell>
        <TableCell component="th" scope="row">
          {sid}
        </TableCell>
        <TableCell component="th" scope="row">
          {min_time} - {max_time}
        </TableCell>
        <TableCell component="th" scope="row">
          {delay} ({(delay / 60).toFixed(2)}s)
        </TableCell>
        <TableCell component="th" scope="row">
          {advances}
        </TableCell>
      </TableRow>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Seed</TableCell>
            <TableCell>Secret ID</TableCell>
            <TableCell>Save Start Time Range</TableCell>
            <TableCell>Save Start Delay</TableCell>
            <TableCell>Total Group Seed Advances</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows.map(buildRow)}</TableBody>
      </Table>
    </TableContainer>
  );
}
