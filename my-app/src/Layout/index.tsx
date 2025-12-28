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
    <Box style={{ height: '100%', display: 'flex', width: "100%", margin: 0, justifyContent: "space-between" }}>
      {!previewMode ? (
        <>
          <LayoutColumn />
          <WorkspaceColumn />
          <ExportColumn />
        </>
      ) : (
        <PreviewPage />
      )}
    </Box>
  );
};
export default Layout;
