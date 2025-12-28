import React from 'react';
import { Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface LinkFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const LinkFieldComponent: React.FC<LinkFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { linkEditorOptions } = useSelector((state: RootState) => state.workspace);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWidgetClick(e);
    onClick();
    dispatch(setSelectedBlockId(blockId));
    
    // If not in preview mode, prevent navigation
    if (!linkEditorOptions.url || linkEditorOptions.url === '#') {
      e.preventDefault();
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'inline-block',
        border: isSelected ? '2px dashed blue' : 'none',
        borderRadius: '4px',
        padding: '2px 4px',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
        cursor: 'pointer',
        textDecoration: linkEditorOptions.underline ? 'underline' : 'none',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: `${linkEditorOptions.fontSize || 14}px`,
          color: linkEditorOptions.color || '#007bff',
          fontWeight: 'normal',
        }}
      >
        {linkEditorOptions.text || 'Click here'}
      </Typography>
    </Box>
  );
};

export default LinkFieldComponent;