import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface InputFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const InputFieldComponent: React.FC<InputFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { inputEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        {inputEditorOptions.label || 'Input Label'}
        {inputEditorOptions.required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
        )}
      </Typography>
      <TextField
        type={inputEditorOptions.type || 'text'}
        placeholder={inputEditorOptions.placeholder || 'Enter text here'}
        size="small"
        fullWidth
        disabled
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            '&.Mui-disabled': {
              backgroundColor: '#f5f5f5',
            },
          },
        }}
      />

    </Box>
  );
};

export default InputFieldComponent;