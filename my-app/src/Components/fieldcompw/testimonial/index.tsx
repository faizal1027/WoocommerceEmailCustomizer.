import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface TestimonialFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const TestimonialFieldComponent: React.FC<TestimonialFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { testimonialEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '12px',
        backgroundColor: testimonialEditorOptions.backgroundColor || '#f8f9fa',
        color: testimonialEditorOptions.textColor || '#333333',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <FormatQuoteIcon
        sx={{
          fontSize: '40px',
          color: '#007bff',
          opacity: 0.2,
          position: 'absolute',
          top: '10px',
          left: '15px',
        }}
      />
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontStyle: 'italic',
          fontSize: '16px',
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        "{testimonialEditorOptions.quote || 'This product changed my life! Highly recommended.'}"
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <Box
          component="img"
          src={testimonialEditorOptions.authorImage || 'https://cdn.tools.unlayer.com/image/placeholder.png'}
          alt={testimonialEditorOptions.author || 'Author'}
          sx={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '12px',
            border: '2px solid #007bff',
          }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {testimonialEditorOptions.author || 'John Doe'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {testimonialEditorOptions.authorTitle || 'Happy Customer'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TestimonialFieldComponent;