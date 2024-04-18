import "./App.css";
import MainContent from "./components/MainContent";

// MUI IMPORTS
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
  },
  typography: {
    fontFamily: ["Alexandria"],
  },
});

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
        }}
      >
        <ThemeProvider theme={theme}>
          <Container maxWidth={"xl"}>
            <MainContent />
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
