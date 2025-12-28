import { Box, Typography } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const RadioWidget = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: 'content',
    item: { widgetType: 'radio' },
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
      <RadioButtonCheckedIcon fontSize="small" sx={{ fontSize: '16px' }} />
      <Typography variant="subtitle2" sx={{ fontSize: '8px' }} color="textSecondary">
        Radio
      </Typography>
    </Box>
  );
};

export default RadioWidget;