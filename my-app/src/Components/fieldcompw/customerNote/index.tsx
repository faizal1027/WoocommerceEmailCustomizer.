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
                outline: 'none',
                boxShadow: isSelected ? '0 0 0 2px #2196f3' : 'none',
                border: `${customerNoteEditorOptions.borderWidth || 0}px solid ${customerNoteEditorOptions.borderColor || '#eeeeee'}`,
                padding: (customerNoteEditorOptions.borderWidth || 0) > 0 ? '0' : (customerNoteEditorOptions.padding || '10px'),
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: (customerNoteEditorOptions.borderWidth || 0) > 0 ? 'stretch' : 'center',
                textAlign: customerNoteEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: customerNoteEditorOptions.backgroundColor && customerNoteEditorOptions.backgroundColor !== 'transparent' ? customerNoteEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: customerNoteEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: customerNoteEditorOptions.fontSize || '14px',
                fontWeight: customerNoteEditorOptions.fontWeight,
                lineHeight: customerNoteEditorOptions.lineHeight
                    ? (customerNoteEditorOptions.lineHeight > 10
                        ? `${customerNoteEditorOptions.lineHeight}px`
                        : customerNoteEditorOptions.lineHeight)
                    : 'normal',
                color: customerNoteEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    textAlign: customerNoteEditorOptions.labelAlign as any || 'left',
                    justifyContent: (customerNoteEditorOptions.labelAlign === 'center') ? 'center' : (customerNoteEditorOptions.labelAlign === 'right' ? 'flex-end' : 'flex-start'),
                    width: `${100 - (customerNoteEditorOptions.lastColumnWidth || 30)}%`,
                    borderRight: customerNoteEditorOptions.borderWidth ? `${customerNoteEditorOptions.borderWidth}px solid ${customerNoteEditorOptions.borderColor || '#eeeeee'}` : 'none',
                    padding: customerNoteEditorOptions.borderWidth ? (customerNoteEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: customerNoteEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {customerNoteEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: customerNoteEditorOptions.valueAlign as any || 'right',
                    justifyContent: (customerNoteEditorOptions.valueAlign === 'center') ? 'center' : (customerNoteEditorOptions.valueAlign === 'left' ? 'flex-start' : 'flex-end'),
                    width: `${customerNoteEditorOptions.lastColumnWidth || 30}%`,
                    padding: customerNoteEditorOptions.borderWidth ? (customerNoteEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: customerNoteEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {customerNoteEditorOptions.value === '{{customer_note}}' ? 'Please deliver between 9 AM and 5 PM.' : customerNoteEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerNoteFieldComponent;
