import React from 'react';
import ExportColumn from '../Components/ExportColumn';
import LayoutColumn from '../Components/LayoutColumn';
import WorkspaceColumn from '../Components/WorkspaceColumn';
import { Box } from '@mui/material';
import PreviewPage from '../Components/Preview';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';

const Layout: React.FC = () => {
  const { previewMode } = useSelector((state: RootState) => state.workspace);

  return (
    <Box style={{
      height: 'calc(100vh - 32px)',
      display: 'flex',
      width: "100%",
      margin: 0,
      overflow: "hidden",
      backgroundColor: "#f5f5f5"
    }}>
      {!previewMode ? (
        <>
          <Box sx={{ width: "300px", flexShrink: 0, borderRight: "1px solid #e0e0e0", backgroundColor: "#fff", zIndex: 10 }}>
            <LayoutColumn />
          </Box>
          <Box sx={{ flex: 1, height: "100%", overflow: "hidden", position: "relative" }}>
            <WorkspaceColumn />
          </Box>
          <Box sx={{ width: "300px", flexShrink: 0, borderLeft: "1px solid #e0e0e0", backgroundColor: "#fff", zIndex: 10 }}>
            <ExportColumn />
          </Box>
        </>
      ) : (
        <PreviewPage />
      )}
    </Box>
  );
};
export default Layout;
