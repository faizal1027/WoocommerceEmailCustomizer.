
import { Box, } from '@mui/material';
import WorkspaceArea from './workspaceArea';
import WorkspaceTop from './workspaceTop';


const Workspace = () => {
  return (
    <Box
      sx={{
        width: '90%',
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#eaeaea',
        height: "100%",
        overflowY: "auto"
      }}
    >
      <WorkspaceTop />
      <WorkspaceArea viewMode={'desktop'} />
    </Box>
  );
};

export default Workspace;