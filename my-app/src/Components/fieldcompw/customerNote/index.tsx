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
                padding: customerNoteEditorOptions.padding || '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: customerNoteEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: customerNoteEditorOptions.backgroundColor && customerNoteEditorOptions.backgroundColor !== 'transparent' ? customerNoteEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: customerNoteEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: customerNoteEditorOptions.fontSize || '14px',
                color: customerNoteEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                    textAlign: customerNoteEditorOptions.labelAlign as any || 'left',
                    flex: 1,
                    width: '50%'
                }}>
                    {customerNoteEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: customerNoteEditorOptions.valueAlign as any || 'right',
                    flex: 1,
                    width: '50%'
                }}>
                    {customerNoteEditorOptions.value === '{{customer_note}}' ? 'Please deliver between 9 AM and 5 PM.' : customerNoteEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerNoteFieldComponent;
