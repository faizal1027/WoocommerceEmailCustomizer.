import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { undo, redo, setMobileView, setPreviewMode, setBlocks, setSelectedBlockId, closeEditor, openEditor } from '../../../Store/Slice/workspaceSlice';
import WallpaperIcon from '@mui/icons-material/Wallpaper';

const WorkspaceTop = () => {
  const dispatch = useDispatch();
  const [view, setView] = React.useState('desktop');
  const { blocks, previewMode, past, future, bodyStyle } = useSelector((state: any) => state.workspace);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string
  ) => {
    if (newView !== null) {
      setView(newView);
      dispatch(setMobileView(newView === 'mobile'));
    }
  };

  const handlePreviewClick = () => {
    dispatch(setPreviewMode(!previewMode));
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  const handleClearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      dispatch(setBlocks([]));
    }
  };

  const handleBack = () => {
    if (window.confirm("Go back to template list? Unsaved changes may be lost.")) {
      window.location.href = 'admin.php?page=posts_list_table';
    }
  };

  return (
    <Box
      sx={{
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        width: "100%",
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        zIndex: 100,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Back to List" placement="right">
          <IconButton size="small" onClick={handleBack} sx={{ color: '#333' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Undo" placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handleUndo}
              disabled={!past || past.length === 0}
              sx={{ color: '#333' }}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo" placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handleRedo}
              disabled={!future || future.length === 0}
              sx={{ color: '#333' }}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={previewMode ? "Exit Preview" : "Preview"} placement="top">
          <IconButton size="small" onClick={handlePreviewClick} color={previewMode ? "primary" : "default"} sx={{ color: previewMode ? 'primary' : '#333' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear Canvas" placement="top">
          <IconButton size="small" onClick={handleClearCanvas} sx={{ color: '#333' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default WorkspaceTop;






// import EditIcon from '@mui/icons-material/Edit';
// import ImageIcon from '@mui/icons-material/Image';
// import CodeIcon from '@mui/icons-material/Code';
// import DataObjectIcon from '@mui/icons-material/DataObject';


{/* <Tooltip title="Edit" placement="top">
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Image" placement="top">
          <IconButton size="small">
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Code" placement="top">
          <IconButton size="small">
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="JSON" placement="top">
          <IconButton size="small">
            <DataObjectIcon fontSize="small" />
          </IconButton>
        </Tooltip> */}