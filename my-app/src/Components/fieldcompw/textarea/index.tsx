import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface TextareaFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const TextareaFieldComponent: React.FC<TextareaFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { textareaEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        padding: '8px',
        position: 'relative',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 'medium',
          color: '#333',
        }}
      >
        {textareaEditorOptions?.label || 'Message'}
        {textareaEditorOptions?.required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
        )}
      </Typography>
      <TextField
        multiline
        rows={textareaEditorOptions?.rows || 4}
        placeholder={textareaEditorOptions?.placeholder || 'Enter your message here...'}
        size="small"
        fullWidth
        disabled={textareaEditorOptions?.disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: textareaEditorOptions?.disabled ? '#f5f5f5' : '#fff',
            '&.Mui-disabled': {
              backgroundColor: '#f5f5f5',
            },
          },
        }}
      />

    </Box>
  );
};

export default TextareaFieldComponent;