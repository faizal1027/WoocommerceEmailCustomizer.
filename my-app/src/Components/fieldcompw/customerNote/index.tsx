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

const CustomerNoteFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { customerNoteEditorOptions } = useSelector((state: RootState) => state.workspace);
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
                textAlign: customerNoteEditorOptions.textAlign as any,
                paddingTop: `${customerNoteEditorOptions.spacing || 0}px`,
                paddingBottom: `${customerNoteEditorOptions.spacing || 0}px`,
                width: '100%',
                backgroundColor: customerNoteEditorOptions.backgroundColor && customerNoteEditorOptions.backgroundColor !== 'transparent' ? customerNoteEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Typography sx={{
                fontFamily: customerNoteEditorOptions.fontFamily === 'inherit' || !customerNoteEditorOptions.fontFamily ? 'inherit' : customerNoteEditorOptions.fontFamily,
                fontSize: customerNoteEditorOptions.fontSize,
                color: customerNoteEditorOptions.textColor,
                fontWeight: 'bold',
            }}>
                {customerNoteEditorOptions.label === 'Customer Note' ? 'Note' : customerNoteEditorOptions.label}
            </Typography>
            <Typography sx={{
                fontFamily: customerNoteEditorOptions.fontFamily === 'inherit' || !customerNoteEditorOptions.fontFamily ? 'inherit' : customerNoteEditorOptions.fontFamily,
                fontSize: customerNoteEditorOptions.fontSize,
                color: customerNoteEditorOptions.textColor,
            }}>
                {customerNoteEditorOptions.value === '{{customer_note}}' ? 'Customer note' : customerNoteEditorOptions.value}
            </Typography>
        </Box>
    );
};

export default CustomerNoteFieldComponent;
