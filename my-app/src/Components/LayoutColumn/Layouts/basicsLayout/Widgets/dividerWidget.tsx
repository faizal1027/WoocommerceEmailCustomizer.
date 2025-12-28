import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDrag } from 'react-dnd';

const DividerWidget = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'content',
    item: {
      widgetType: 'divider',
      initialContent: 'divider', 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <Box
      ref={ref}
      sx={{
        backgroundColor: '#eef2f7',
        border: '1px solid #ccc',
        borderRadius: 1,
        py: 4,
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
        userSelect: 'none', 
      }}
    >
      <Typography variant="h6" sx={{ fontSize: '12px' }} color="textSecondary">
        ─
      </Typography>
      <Typography variant="subtitle2" sx={{ fontSize: '12px' }} color="textSecondary">
        Divider
      </Typography>
    </Box>
  );
};

export default DividerWidget;