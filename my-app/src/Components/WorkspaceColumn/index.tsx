import { Box, } from '@mui/material';
import WorkspaceArea from './workspaceArea';
import WorkspaceTop from './workspaceTop';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/store';

const Workspace = () => {
  const bodyStyle = useSelector((state: RootState) => state.workspace.bodyStyle);

  return (
    <Box
      sx={{
        width: '90%',
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#f5f7f9', // Default app background
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <WorkspaceTop />
      <Box sx={{ flex: 1, overflow: 'auto', width: '100%', height: '100%' }}>
        <WorkspaceArea viewMode={'desktop'} />
      </Box>
    </Box>
  );
};

export default Workspace;