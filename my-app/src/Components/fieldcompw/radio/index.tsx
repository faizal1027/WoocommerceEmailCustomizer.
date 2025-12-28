import React from 'react';
import { Box, Typography, Radio as MuiRadio } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface RadioFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const RadioFieldComponent: React.FC<RadioFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { radioEditorOptions } = useSelector((state: RootState) => state.workspace);

  const sampleOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const options = radioEditorOptions.options?.length > 0 ? radioEditorOptions.options : sampleOptions;

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
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          fontWeight: 'medium',
          color: '#333',
        }}
      >
        {radioEditorOptions.label || 'Radio Group'}
        {radioEditorOptions.required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
        )}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: radioEditorOptions.inline ? 'row' : 'column',
          flexWrap: radioEditorOptions.inline ? 'wrap' : 'nowrap',
          gap: radioEditorOptions.inline ? 3 : 1,
        }}
      >
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <MuiRadio disabled size="small" />
            <Typography variant="body2">{option}</Typography>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default RadioFieldComponent;