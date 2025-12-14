
import { Container, TextField, Button, Typography, Stack } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Submit() {
  const [form, setForm] = useState({});
  const submit = async () => {
    await axios.post("https://wedogood-assignment.onrender.com", form);
    alert("Report submitted");
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5">Submit Monthly Report</Typography>
      <Stack spacing={2} mt={2}>
        <TextField label="NGO ID" onChange={e => setForm({...form, ngo_id: e.target.value})} />
        <TextField label="Month (YYYY-MM)" onChange={e => setForm({...form, month: e.target.value})} />
        <TextField label="People Helped" type="number" onChange={e => setForm({...form, people_helped: e.target.value})} />
        <TextField label="Events Conducted" type="number" onChange={e => setForm({...form, events_conducted: e.target.value})} />
        <TextField label="Funds Utilized" type="number" onChange={e => setForm({...form, funds_utilized: e.target.value})} />
        <Button variant="contained" onClick={submit}>Submit</Button>
      </Stack>
    </Container>
  );
}
