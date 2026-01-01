import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { Box, Tooltip } from '@mui/material';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { reorderColumnContent, copyColumnContent, deleteColumnContent } from '../../../Store/Slice/workspaceSlice';

interface DraggableWidgetWrapperProps {
    blockId: string;
    columnIndex: number;
    widgetIndex: number;
    children: React.ReactNode;
    isSelected: boolean;
    previewMode: boolean;
    onWidgetClick: (e: React.MouseEvent) => void;
}

interface DragItem {
    index: number;
    type: string;
    blockId: string;
    columnIndex: number;
}

const DraggableWidgetWrapper: React.FC<DraggableWidgetWrapperProps> = ({
    blockId,
    columnIndex,
    widgetIndex,
    children,
    isSelected,
    previewMode,
    onWidgetClick
}) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: `WIDGET_${blockId}_${columnIndex}`, // Unique type per column to prevent dragging between columns for now
        item: { type: `WIDGET_${blockId}_${columnIndex}`, index: widgetIndex, blockId, columnIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !previewMode,
    });

    const [, drop] = useDrop({
        accept: `WIDGET_${blockId}_${columnIndex}`,
        hover: (item: DragItem, monitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = widgetIndex;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            dispatch(reorderColumnContent({ blockId, columnIndex, sourceIndex: dragIndex, targetIndex: hoverIndex }));
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(copyColumnContent({ blockId, columnIndex, widgetIndex }));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(deleteColumnContent({ blockId, columnIndex, widgetIndex }));
    };

    return (
        <Box
            ref={ref}
            sx={{
                position: 'relative',
                width: '100%',
                opacity: isDragging ? 0.5 : 1,
                cursor: previewMode ? 'default' : 'grab',
                '&:hover .widget-actions': {
                    display: !previewMode ? 'flex' : 'none',
                },
                boxShadow: isSelected ? 'inset 0 0 0 2px #2196F3' : 'none',
            }}
            onClick={(e) => {
                // Ensure click selects the widget
                // We don't stop propagation immediately if we want children to handle it first?
                // Actually, we WANT to stop propagation so it doesn't go to Column.
                // If a child handled it and stopped propagation, this won't run.
                // If a child didn't handle it, this runs.
                e.stopPropagation();
                onWidgetClick(e);
            }}
        >
            {isSelected && !previewMode && (
                <Box
                    className="widget-actions"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#2196F3',
                        borderRadius: '4px',
                        display: 'flex',
                        zIndex: 10,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    <Tooltip title="Duplicate" placement="top">
                        <ContentCopyTwoToneIcon
                            sx={{ color: '#fff', fontSize: 20, p: 0.5, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                            onClick={handleCopy}
                        />
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                        <DeleteOutlineTwoToneIcon
                            sx={{ color: '#fff', fontSize: 20, p: 0.5, cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                            onClick={handleDelete}
                        />
                    </Tooltip>
                </Box>
            )}
            {children}
        </Box>
    );
};

export default DraggableWidgetWrapper;
