
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function Upload() {
  const [job, setJob] = useState(null);

  const upload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
  "https://wedogood-assignment.onrender.com/reports/upload",
  formData
);
    setJob(res.data.job_id);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5">Bulk CSV Upload</Typography>
      <input type="file" onChange={upload} />
      {job && <Typography mt={2}>Job ID: {job}</Typography>}
    </Container>
  );
}
