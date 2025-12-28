import { Box, Typography } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';

const PaymentMethodWidget = () => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'content',
        item: { widgetType: 'paymentMethod' },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
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
                paddingY: 4,
                paddingX: 2,
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
            <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 800 }} color="textSecondary">
                💳
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: '10px' }} color="textSecondary">
                Payment method
            </Typography>
        </Box>
    );
};

export default PaymentMethodWidget;
