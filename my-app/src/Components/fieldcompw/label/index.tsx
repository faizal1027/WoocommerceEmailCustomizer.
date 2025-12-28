import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface LabelFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const LabelFieldComponent: React.FC<LabelFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { labelEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getLabelStyle = () => {
    switch (labelEditorOptions.type) {
      case 'required':
        return { color: '#dc3545', fontWeight: 'bold' };
      case 'optional':
        return { color: '#6c757d', fontStyle: 'italic' };
      case 'error':
        return { color: '#dc3545', fontWeight: 'bold', borderBottom: '2px solid #dc3545' };
      case 'warning':
        return { color: '#ffc107', fontWeight: 'bold', borderBottom: '2px solid #ffc107' };
      default:
        return { color: labelEditorOptions.color || '#333333' };
    }
  };

  const getLabelText = () => {
    const baseText = labelEditorOptions.text || 'Label Text';
    switch (labelEditorOptions.type) {
      case 'required':
        return `${baseText} *`;
      case 'optional':
        return `${baseText} (optional)`;
      default:
        return baseText;
    }
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
        component="label"
        htmlFor={labelEditorOptions.for || undefined}
        sx={{
          fontSize: `${labelEditorOptions.fontSize || 14}px`,
          display: 'inline-block',
          cursor: 'pointer',
          ...getLabelStyle(),
        }}
      >
        {getLabelText()}
      </Typography>

    </Box>
  );
};

export default LabelFieldComponent;