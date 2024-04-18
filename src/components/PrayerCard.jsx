// MUI IMPORTS
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function PrayerCard({ name, time, image }) {
  return (
    <Card sx={{ width: 280, marginTop: "20px" }}>
      <CardMedia sx={{ height: 140 }} image={image} title="Prayer Times" />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        <Typography
          variant="h2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
