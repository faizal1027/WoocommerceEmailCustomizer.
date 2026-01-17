import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import OverallLayout from "./Layouts";
import EditorPanel from "./Layouts/EditorPanel";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../Constants/Theme";
import EmailIcon from "@mui/icons-material/Email";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{
        height: 'calc(100% - 48px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        // Hide scrollbar for Chrome, Safari and Opera
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        // Hide scrollbar for IE, Edge and Firefox
        '-ms-overflow-style': 'none',  /* IE and Edge */
        'scrollbar-width': 'none',  /* Firefox */
      }}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

const LayoutColumn = () => {
  const [value, setValue] = useState(0);
  const editorOpen = useSelector((state: RootState) => state.workspace.editorOpen);

  // Auto-switch to Editor tab when editorOpen becomes true
  useEffect(() => {
    if (editorOpen) {
      setValue(1);
    }
  }, [editorOpen]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          overflow: "hidden", // Changed to hidden so Tabs handle scroll
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f0f0f0' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="sidebar tabs"
            variant="fullWidth"
            TabIndicatorProps={{ sx: { display: 'none' } }} // Hide default underline indicator
            sx={{
              minHeight: '48px',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'normal',
                color: '#666',
                borderRight: '1px solid #e0e0e0',
                borderBottom: '1px solid #e0e0e0', // Default border for inactive
                bgcolor: '#f5f5f5', // Gray background for inactive tabs
                '&.Mui-selected': {
                  color: '#000',
                  fontWeight: 'bold',
                  bgcolor: '#fff', // White background for active
                  borderBottom: 'none', // Remove bottom border for active to blend with content
                }
              }
            }}
          >
            <Tab label="Components" />
            <Tab label="Editor" />
            <Tab
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <span>Custom</span>
                  <span>CSS</span>
                </Box>
              }
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <OverallLayout />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EditorPanel />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Box sx={{ p: 2 }}>
            <Typography>Custom CSS (Coming Soon)</Typography>
          </Box>
        </CustomTabPanel>

      </Box>
    </ThemeProvider>
  );
};

export default LayoutColumn;
