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
    // e.stopPropagation(); // Bubbling allowed
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
      sx={{
        textAlign: linkEditorOptions.textAlign || 'left',
        width: '100%',
      }}
    >
      <a
        href={linkEditorOptions.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={{
          display: 'inline-block',
          border: isSelected ? '2px dashed blue' : 'none',
          borderRadius: '4px',
          paddingTop: `${linkEditorOptions.padding?.top || 0}px`,
          paddingRight: `${linkEditorOptions.padding?.right || 0}px`,
          paddingBottom: `${linkEditorOptions.padding?.bottom || 0}px`,
          paddingLeft: `${linkEditorOptions.padding?.left || 0}px`,
          backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
          cursor: 'pointer',
          textDecoration: linkEditorOptions.underline ? 'underline' : 'none',
          fontSize: `${linkEditorOptions.fontSize || 14}px`,
          color: linkEditorOptions.color || '#007bff',
          fontWeight: 'normal',
        }}
      >
        {linkEditorOptions.text || 'Click here'}
      </a>
    </Box>
  );

};

export default LinkFieldComponent;