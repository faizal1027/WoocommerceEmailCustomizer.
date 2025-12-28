import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface ProductFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const ProductFieldComponent: React.FC<ProductFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true
}) => {
  const dispatch = useDispatch();
  const { productEditorOptions } = useSelector((state: RootState) => state.workspace);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productEditorOptions.buttonLink && productEditorOptions.buttonLink !== '#') {
      window.open(productEditorOptions.buttonLink, '_blank');
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
        maxWidth: '300px',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        component="img"
        src={productEditorOptions.imageUrl || (previewMode ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' : 'https://via.placeholder.com/400x300?text={{product_image}}')}
        alt={productEditorOptions.name || 'Product'}
        sx={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <Box sx={{ padding: '16px' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          {productEditorOptions.name || (previewMode ? 'Premium Wireless Headphones' : '{{product_name}}')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#666', minHeight: '40px' }}>
          {productEditorOptions.description || (previewMode ? 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.' : '{{product_description}}')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007bff' }}>
            {productEditorOptions.currency || '$'}{productEditorOptions.price || (previewMode ? '129.99' : '{{product_price}}')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              backgroundColor: '#007bff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            {productEditorOptions.buttonText || 'Add to Cart'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductFieldComponent;