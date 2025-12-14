
import { Container, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>NGO Reporting Dashboard</Typography>
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => router.push("/submit")}>Submit Report</Button>
        <Button variant="contained" onClick={() => router.push("/upload")}>Bulk Upload</Button>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>Admin Dashboard</Button>
      </Stack>
    </Container>
  );
}
