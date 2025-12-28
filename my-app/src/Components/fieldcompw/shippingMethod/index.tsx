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

const ShippingMethodFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { shippingMethodEditorOptions } = useSelector((state: RootState) => state.workspace);
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
                textAlign: shippingMethodEditorOptions.textAlign as any,
                paddingTop: `${shippingMethodEditorOptions.spacing || 0}px`,
                paddingBottom: `${shippingMethodEditorOptions.spacing || 0}px`,
                width: '100%',
                backgroundColor: shippingMethodEditorOptions.backgroundColor && shippingMethodEditorOptions.backgroundColor !== 'transparent' ? shippingMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Typography sx={{
                fontFamily: shippingMethodEditorOptions.fontFamily === 'inherit' || !shippingMethodEditorOptions.fontFamily ? 'inherit' : shippingMethodEditorOptions.fontFamily,
                fontSize: shippingMethodEditorOptions.fontSize,
                color: shippingMethodEditorOptions.textColor,
                fontWeight: 'bold'
            }}>
                {shippingMethodEditorOptions.label}
            </Typography>
            <Typography sx={{
                fontFamily: shippingMethodEditorOptions.fontFamily === 'inherit' || !shippingMethodEditorOptions.fontFamily ? 'inherit' : shippingMethodEditorOptions.fontFamily,
                fontSize: shippingMethodEditorOptions.fontSize,
                color: shippingMethodEditorOptions.textColor,
            }}>
                {shippingMethodEditorOptions.value === '{{shipping_method}}' ? 'Flat rate' : shippingMethodEditorOptions.value}
            </Typography>
        </Box>
    );
};

export default ShippingMethodFieldComponent;
