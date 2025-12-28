import { Box, Typography } from "@mui/material";
import OverallLayout from "./Layouts";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../Constants/Theme";
import EmailIcon from "@mui/icons-material/Email";

const LayoutColumn = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100%",
          background: "#fff",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          boxShadow: "4px 0 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 3,
            py: 2,
            borderBottom: "1px solid #ccc",
          }}
        >
          <EmailIcon sx={{ color: "orange", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: 17 }}>
            Email Customizer
          </Typography>
        </Box>
        <OverallLayout />
      </Box>
    </ThemeProvider>
  );
};

export default LayoutColumn;
