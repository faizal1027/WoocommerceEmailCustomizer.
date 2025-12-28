import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface CardFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
}

const CardFieldComponent: React.FC<CardFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();
  // const { cardEditorOptions } = useSelector((state: RootState) => state.workspace); // Don't use global selector

  // Parse options from widgetData
  let cardEditorOptions = {
    title: 'Card Title',
    content: 'This is a nice card description.',
    imageUrl: '',
    image: '',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderColor: '#ddd',
    borderRadius: 8,
    border: true,
    shadow: true
  };

  if (widgetData && widgetData.contentData) {
    try {
      cardEditorOptions = JSON.parse(widgetData.contentData);
    } catch (e) {
      console.error("Error parsing card data", e);
    }
  }

  // Helper to get the image URL (support both image and imageUrl for backward compatibility)
  const getImageUrl = () => {
    return cardEditorOptions.imageUrl || cardEditorOptions.image || '';
  };

  // Determine border style based on border property
  const getBorderStyle = () => {
    if (cardEditorOptions.border) {
      return `1px solid ${cardEditorOptions.borderColor || '#ddd'}`;
    }
    return 'none';
  };

  // Determine box shadow based on shadow property
  const getBoxShadow = () => {
    if (cardEditorOptions.shadow) {
      return '0 2px 8px rgba(0,0,0,0.1)';
    }
    return 'none';
  };

  // Get hover box shadow
  const getHoverBoxShadow = () => {
    if (cardEditorOptions.shadow) {
      return '0 8px 16px rgba(0,0,0,0.15)';
    }
    return 'none';
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
        maxWidth: '400px',
        border: getBorderStyle(),
        outline: isSelected ? '2px dashed blue' : 'none',
        outlineOffset: '2px',
        borderRadius: `${cardEditorOptions.borderRadius || 8}px`,
        backgroundColor: cardEditorOptions.backgroundColor || '#ffffff',
        color: cardEditorOptions.textColor || '#333333',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: getBoxShadow(),
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: getHoverBoxShadow(),
        },
      }}
    >
      {/* Card Image */}
      {getImageUrl() && (
        <Box
          component="img"
          src={getImageUrl()}
          alt={cardEditorOptions.title || 'Card Image'}
          sx={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      {/* Card Content */}
      <Box sx={{ padding: '20px' }}>
        {/* Card Title */}
        {cardEditorOptions.title && (
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: cardEditorOptions.textColor || '#333333'
            }}
          >
            {cardEditorOptions.title}
          </Typography>
        )}

        {/* Card Content Text */}
        {cardEditorOptions.content && (
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              color: cardEditorOptions.textColor || '#666666'
            }}
          >
            {cardEditorOptions.content}
          </Typography>
        )}

        {/* Default content if no title or content provided */}
        {!cardEditorOptions.title && !cardEditorOptions.content && (
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              color: cardEditorOptions.textColor || '#666666',
              fontStyle: 'italic'
            }}
          >
            Card content will appear here. Edit the card to add title and content.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CardFieldComponent;