
import React, { useRef, useEffect } from 'react'; 
import { Box, Typography } from '@mui/material';
import { useDrag } from 'react-dnd';

const TextWidget = () => {
  const dragRef = useRef<HTMLDivElement>(null); 

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'content', 
    item: {
      widgetType: 'text',
      initialContent: 'Click to edit text', 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current); 
    }
  }, [dragRef, drag]); 

  return (
    <Box
      ref={dragRef} 
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
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "12px", fontWeight: 800 }} color="textSecondary">
        T
      </Typography>
      <Typography variant="subtitle2" sx={{ fontSize: "12px" }} color="textSecondary">
        Text
      </Typography>
    </Box>
  );
};

export default TextWidget;