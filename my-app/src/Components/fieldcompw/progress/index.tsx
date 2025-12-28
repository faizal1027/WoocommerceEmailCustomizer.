import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface ProgressFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const ProgressFieldComponent: React.FC<ProgressFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { progressEditorOptions } = useSelector((state: RootState) => state.workspace);

  const progressValue = progressEditorOptions.value || 75;
  const minValue = progressEditorOptions.min || 0;
  const maxValue = progressEditorOptions.max || 100;
  const normalizedValue = ((progressValue - minValue) / (maxValue - minValue)) * 100;

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
        border: isSelected ? '2px dashed blue' : 'none',
        borderRadius: '4px',
        padding: '20px',
        position: 'relative',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
        {progressEditorOptions.label || 'Progress'}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={normalizedValue}
          size={120}
          thickness={4}
          sx={{
            color: progressEditorOptions.color || '#007bff',
          }}
        />
        {progressEditorOptions.showValue !== false && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 'bold', color: progressEditorOptions.color || '#007bff' }}
            >
              {progressValue}%
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {minValue}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {maxValue}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: progressEditorOptions.color || '#007bff',
            },
          }}
        />
      </Box>
      
      <Typography variant="body2" sx={{ mt: 3, color: '#666' }}>
        Progress: {progressValue} of {maxValue}
      </Typography>
    </Box>
  );
};

export default ProgressFieldComponent;