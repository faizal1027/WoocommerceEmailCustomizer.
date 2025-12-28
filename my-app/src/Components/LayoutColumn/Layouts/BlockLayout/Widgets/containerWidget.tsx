import { Box, Typography } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import ContainerIcon from '@mui/icons-material/ViewQuilt';

const ContainerWidget = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: 'layout',
    item: { widgetType: 'container', columns: 1 },
  }));

  useEffect(() => {
    if (ref.current) drag(ref.current);
  }, [drag]);

  return (
    <Box
      ref={ref}
      sx={{
        backgroundColor: '#eef2f7',
        border: '1px solid #ccc',
        borderRadius: 1,
        paddingY: 4,
        textAlign: 'center',
        width: '70px',
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
      }}
    >
      <ContainerIcon fontSize="small" sx={{ fontSize: '16px' }} />
      <Typography variant="subtitle2" sx={{ fontSize: '8px' }} color="textSecondary">
        Container
      </Typography>
    </Box>
  );
};

export default ContainerWidget;