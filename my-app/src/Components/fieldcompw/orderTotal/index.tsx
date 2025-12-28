import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface Props {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
}

const OrderTotalFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { orderTotalEditorOptions } = useSelector((state: RootState) => state.workspace);
    const dispatch = useDispatch();

    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onWidgetClick(e);
                onClick();
                dispatch(setSelectedBlockId(blockId));
            }}
            sx={{
                border: isSelected ? '2px dashed blue' : '1px transparent',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: orderTotalEditorOptions.textAlign as any,
                paddingTop: `${orderTotalEditorOptions.spacing || 0}px`,
                paddingBottom: `${orderTotalEditorOptions.spacing || 0}px`,
                width: '100%',
                backgroundColor: orderTotalEditorOptions.backgroundColor && orderTotalEditorOptions.backgroundColor !== 'transparent' ? orderTotalEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Typography sx={{
                fontFamily: orderTotalEditorOptions.fontFamily === 'inherit' || !orderTotalEditorOptions.fontFamily ? 'inherit' : orderTotalEditorOptions.fontFamily,
                fontSize: orderTotalEditorOptions.fontSize,
                color: orderTotalEditorOptions.textColor,
                fontWeight: 'bold'
            }}>
                {orderTotalEditorOptions.label}
            </Typography>
            <Typography sx={{
                fontFamily: orderTotalEditorOptions.fontFamily === 'inherit' || !orderTotalEditorOptions.fontFamily ? 'inherit' : orderTotalEditorOptions.fontFamily,
                fontSize: orderTotalEditorOptions.fontSize,
                color: orderTotalEditorOptions.textColor,
                fontWeight: 'bold'
            }}>
                {orderTotalEditorOptions.value === '{{order_total}}' ? '₹55.00' : orderTotalEditorOptions.value}
            </Typography>
        </Box>
    );
};

export default OrderTotalFieldComponent;
