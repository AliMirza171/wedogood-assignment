
import { Container, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Dashboard() {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
 const res = await axios.get(
  "https://wedogood-assignment.onrender.com/dashboard?month=" + month
);

    setData(res.data);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5">Admin Dashboard</Typography>
      <TextField label="Month (YYYY-MM)" onChange={e => setMonth(e.target.value)} />
      <Button onClick={load}>Load</Button>
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </Container>
  );
}
