import React from 'react';
import { Box, Typography, Checkbox as MuiCheckbox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface CheckboxFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const CheckboxFieldComponent: React.FC<CheckboxFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { checkboxEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        border: isSelected ? '2px dashed blue' : '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '16px',
        position: 'relative',
        backgroundColor: isSelected ? '#f0f8ff' : '#ffffff',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Single Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MuiCheckbox
          checked={checkboxEditorOptions.checked || false}
          disabled
          size="small"
          sx={{
            color: '#1976d2',
            '&.Mui-disabled': {
              color: '#1976d2',
            },
            // Reset WP Admin global styles that might add a duplicate tick
            '& input': {
              appearance: 'none !important',
              '&::before': {
                display: 'none !important',
                content: '"" !important',
              },
              '&::after': {
                display: 'none !important',
                content: '"" !important',
              }
            }
          }}
        />
        <Box sx={{ ml: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#333' }}>
            {checkboxEditorOptions.label || 'Checkbox Label'}
          </Typography>

        </Box>
      </Box>
    </Box>
  );
};

export default CheckboxFieldComponent;