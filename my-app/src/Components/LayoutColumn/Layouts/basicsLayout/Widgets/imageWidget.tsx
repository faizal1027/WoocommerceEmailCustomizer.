import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useDrag } from 'react-dnd';

const ImageWidget = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'content',
    item: { 
      widgetType: 'image',
      initialContent: JSON.stringify({
        src: 'https://cdn.tools.unlayer.com/image/placeholder.png',
        altText: '',
        width: '100%',
        align: 'center',
        autoWidth: true,
        padding: { top: 0, left: 0, right: 0, bottom: 0 },
      })
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <Box
      ref={ref}
      sx={{ 
        backgroundColor: '#eef2f7',
        border: '1px solid #ccc',
        borderRadius: 1,
        paddingY: 4,
        m: 0,
        textAlign: 'center',
        width: '70px',
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "12px" }} color="textSecondary">
        📷
      </Typography>
      <Typography variant="subtitle2" sx={{ fontSize: "12px" }} color="textSecondary">
        Image
      </Typography>
    </Box>
  );
};

export default ImageWidget;