import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface ImageBoxFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const ImageBoxFieldComponent: React.FC<ImageBoxFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { imageBoxEditorOptions } = useSelector((state: RootState) => state.workspace);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWidgetClick(e);
    onClick();
    dispatch(setSelectedBlockId(blockId));
    
    // If link is provided, open in new tab
    if (imageBoxEditorOptions.link) {
      window.open(imageBoxEditorOptions.link, '_blank');
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: '100%',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        cursor: imageBoxEditorOptions.link ? 'pointer' : 'default',
        '&:hover': {
          opacity: imageBoxEditorOptions.link ? 0.9 : 1,
        },
      }}
    >
      <Box
        component="img"
        src={imageBoxEditorOptions.src || 'https://cdn.tools.unlayer.com/image/placeholder.png'}
        alt={imageBoxEditorOptions.alt || 'Image'}
        sx={{
          width: imageBoxEditorOptions.width || '100%',
          height: imageBoxEditorOptions.height || 'auto',
          display: 'block',
          maxWidth: '100%',
        }}
      />
      {imageBoxEditorOptions.caption && (
        <Box
          sx={{
            padding: '8px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">{imageBoxEditorOptions.caption}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageBoxFieldComponent;