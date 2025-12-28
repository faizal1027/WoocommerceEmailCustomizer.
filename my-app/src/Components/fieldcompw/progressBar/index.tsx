import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface ProgressBarFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const ProgressBarFieldComponent: React.FC<ProgressBarFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { progressBarEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        padding: '16px',
        position: 'relative',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          {progressBarEditorOptions.title || 'Progress'}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {progressBarEditorOptions.progress || 50}%
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: `${progressBarEditorOptions.height || 20}px`,
          backgroundColor: progressBarEditorOptions.backgroundColor || '#e9ecef',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: `${progressBarEditorOptions.progress || 50}%`,
            height: '100%',
            backgroundColor: progressBarEditorOptions.barColor || '#007bff',
            borderRadius: '10px',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
          }}
        >
          {progressBarEditorOptions.progress && progressBarEditorOptions.progress > 20 && (
            <Typography
              variant="caption"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '10px',
              }}
            >
              {progressBarEditorOptions.progress}%
            </Typography>
          )}
        </Box>
        {(!progressBarEditorOptions.progress || progressBarEditorOptions.progress <= 20) && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          >
            {progressBarEditorOptions.progress || 50}%
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProgressBarFieldComponent;