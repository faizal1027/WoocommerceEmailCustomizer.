import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

interface AlertFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const AlertFieldComponent: React.FC<AlertFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { alertEditorOptions } = useSelector((state: RootState) => state.workspace);
  const [dismissed, setDismissed] = useState(false);

  const getAlertStyles = () => {
    switch (alertEditorOptions.type) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          color: '#155724',
          borderColor: '#c3e6cb',
          Icon: CheckCircleIcon,
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderColor: '#ffeaa7',
          Icon: WarningIcon,
        };
      case 'error':
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderColor: '#f5c6cb',
          Icon: ErrorIcon,
        };
      default: // info
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderColor: '#bee5eb',
          Icon: InfoIcon,
        };
    }
  };

  const alertStyles = getAlertStyles();
  const IconComponent = alertStyles.Icon;

  if (dismissed && alertEditorOptions.dismissible) {
    return null;
  }

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: '100%',
        border: isSelected ? '2px dashed blue' : `1px solid ${alertStyles.borderColor}`,
        borderRadius: '4px',
        backgroundColor: alertStyles.backgroundColor,
        color: alertStyles.color,
        padding: '16px',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <IconComponent sx={{ marginRight: '12px', marginTop: '2px' }} />
      <Box sx={{ flex: 1 }}>
        {alertEditorOptions.title && (
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {alertEditorOptions.title}
          </Typography>
        )}
        <Typography variant="body1">
          {alertEditorOptions.message || 'This is an alert message.'}
        </Typography>
      </Box>
      {alertEditorOptions.dismissible && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          sx={{
            color: alertStyles.color,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default AlertFieldComponent;