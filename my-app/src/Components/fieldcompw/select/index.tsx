import React, { useState } from 'react';  // Add useState
import { Box, Typography, Select as MuiSelect, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId, updateWidgetContentData } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface SelectFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const SelectFieldComponent: React.FC<SelectFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  // Add state to track selected value
  const [localValue, setLocalValue] = useState<string | string[]>('');

  const column = useSelector((state: RootState) =>
    state.workspace.blocks.find(block => block.id === blockId)?.columns[columnIndex]
  );
  const widgetContent = column?.widgetContents[widgetIndex];

  // Parse contentData or use default values if not available
  const selectEditorOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      label: 'Select Label',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      required: false,
      name: 'select_field',
      multiple: false,
      color: '#333333',
      backgroundColor: '#ffffff',
      fontSize: 14,
      fontWeight: 'normal',
      borderRadius: 4,
      borderColor: '#cccccc',
      borderWidth: 1,
      borderStyle: 'solid',
      width: '100%',
      height: 'auto'
    };

  const sampleOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
  ];

  const options = selectEditorOptions.options?.length > 0 ? selectEditorOptions.options : sampleOptions;

  // Add this function to handle selection changes
  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    setLocalValue(value);

    // Optional: Save to Redux if you want to persist the selection
    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify({
        ...selectEditorOptions,
        selectedValue: value
      })
    }));
  };

  // Add this to prevent parent clicks when interacting with dropdown
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
        {selectEditorOptions.label || 'Select Option'}
        {selectEditorOptions.required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
        )}
      </Typography>
      <MuiSelect
        size="small"
        fullWidth
        multiple={selectEditorOptions.multiple}
        disabled={false}  // Changed from disabled to disabled={false}
        displayEmpty
        value={localValue}  // Now uses local state instead of hardcoded ''
        onChange={handleSelectChange}  // Added to handle selection
        onClick={handleSelectClick}  // Added to prevent parent click
        MenuProps={{
          disablePortal: false,
          sx: { zIndex: 1300001 },
          style: { zIndex: 1300001 }
        }}
        sx={{
          backgroundColor: selectEditorOptions.backgroundColor || '#ffffff',
          color: selectEditorOptions.color || '#333333',
          fontSize: selectEditorOptions.fontSize || 14,
          fontWeight: selectEditorOptions.fontWeight || 'normal',
          borderRadius: `${selectEditorOptions.borderRadius || 4}px`,
          border: `${selectEditorOptions.borderWidth || 1}px ${selectEditorOptions.borderStyle || 'solid'} ${selectEditorOptions.borderColor || '#cccccc'}`,
          width: selectEditorOptions.width || '100%',
          height: selectEditorOptions.height || 'auto',
          '& .MuiSelect-select': {
            padding: '8px 14px',
          },
          '&.Mui-disabled': {
            backgroundColor: selectEditorOptions.backgroundColor || '#ffffff',
            color: selectEditorOptions.color || '#333333',
            opacity: 0.9
          },
        }}
      >
        <MenuItem value="" disabled>
          Select an option
        </MenuItem>
        {options.map((option: any, index: number) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

    </Box>
  );
};

export default SelectFieldComponent;