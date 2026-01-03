
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId, updateWidgetContentData } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';
import { useDrop } from 'react-dnd';
import { getWidgetComponent } from '../../utils/getWidgetComponent';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  defaultTextEditorOptions,
  defaultButtonEditorOptions,
  defaultHeadingEditorOptions,
  defaultDividerEditorOptions,
} from '../../../Store/Slice/workspaceSlice';

interface RowFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
}

const RowFieldComponent: React.FC<RowFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();

  const storeWidgetContent = useSelector((state: RootState) => {
    const block = state.workspace.blocks.find((b) => b.id === blockId);
    return block?.columns[columnIndex]?.widgetContents[widgetIndex] || null;
  });

  const widgetContent = widgetData || storeWidgetContent;

  const rowOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      backgroundColor: 'transparent',
      columns: 2,
      gap: 20
    };

  const numColumns = rowOptions.columns || 2;

  // Initialize columnsData if missing or length mismatch
  if (!rowOptions.columnsData || rowOptions.columnsData.length !== numColumns) {
    rowOptions.columnsData = Array(numColumns).fill(0).map((_, i) => (rowOptions.columnsData && rowOptions.columnsData[i]) || { id: `col_${i}_${Date.now()}`, children: [] });
  }

  const handleDrop = (item: any, colIndex: number) => {
    let newWidgetContentData = "{}";
    if (item.widgetType === "text") newWidgetContentData = JSON.stringify(defaultTextEditorOptions);
    else if (item.widgetType === "button") newWidgetContentData = JSON.stringify(defaultButtonEditorOptions);
    else if (item.widgetType === "heading") newWidgetContentData = JSON.stringify(defaultHeadingEditorOptions);
    else if (item.widgetType === "divider") newWidgetContentData = JSON.stringify(defaultDividerEditorOptions);
    else if (item.widgetType === "image") newWidgetContentData = item.initialContent || "";
    else if (item.widgetType === "spacer") newWidgetContentData = JSON.stringify({});

    const newChild = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentType: item.widgetType,
      contentData: newWidgetContentData
    };

    const updatedColumnsData = [...rowOptions.columnsData];
    updatedColumnsData[colIndex] = {
      ...updatedColumnsData[colIndex],
      children: [...(updatedColumnsData[colIndex].children || []), newChild]
    };

    const updatedRowOptions = { ...rowOptions, columnsData: updatedColumnsData };

    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedRowOptions)
    }));
  };

  const handleDeleteChild = (e: React.MouseEvent, colIndex: number, childIndex: number) => {
    e.stopPropagation();
    const updatedColumnsData = [...rowOptions.columnsData];
    const colChildren = updatedColumnsData[colIndex].children.filter((_: any, idx: number) => idx !== childIndex);
    updatedColumnsData[colIndex] = { ...updatedColumnsData[colIndex], children: colChildren };

    const updatedRowOptions = { ...rowOptions, columnsData: updatedColumnsData };

    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedRowOptions)
    }));
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: '100%',
        backgroundColor: rowOptions.backgroundColor || 'transparent',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        padding: `${rowOptions.gap || 20}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
        gap: `${rowOptions.gap || 20}px`,
        position: 'relative',
        minHeight: '100px',
      }}
    >
      {rowOptions.columnsData.map((colData: any, colIdx: number) => (
        <ColumnDropTarget
          key={colData.id || colIdx}
          colData={colData}
          colIdx={colIdx}
          onDrop={(item: any) => handleDrop(item, colIdx)} // Added type annotation
          onDeleteChild={(e: React.MouseEvent, childIdx: number) => handleDeleteChild(e, colIdx, childIdx)} // Added type annotation
          blockId={blockId}
          columnIndex={columnIndex}
        />
      ))}
    </Box>
  );
};

// Sub-component for individual column drop target
const ColumnDropTarget = ({ colData, colIdx, onDrop, onDeleteChild, blockId, columnIndex }: any) => {
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'content',
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(dropRef);

  return (
    <Box
      ref={dropRef}
      sx={{
        backgroundColor: 'rgba(0,0,0,0.05)',
        border: isOver ? '2px dashed green' : '1px dashed #ccc',
        borderRadius: '2px',
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: colData.children && colData.children.length > 0 ? 'flex-start' : 'center',
        alignItems: 'center',
        p: 1
      }}
    >
      {(!colData.children || colData.children.length === 0) ? (
        <Typography sx={{ fontSize: '12px', color: '#999' }}>Column {colIdx + 1}</Typography>
      ) : (
        colData.children.map((child: any, idx: number) => {
          const WidgetComponent = getWidgetComponent(child.contentType);
          if (!WidgetComponent) return null;
          return (
            <Box key={child.id || idx} sx={{ position: 'relative', width: '100%', mb: 1, '&:hover .delete-btn': { display: 'flex' } }}>
              <WidgetComponent
                blockId={blockId} // Passing parent block/column context
                columnIndex={columnIndex}
                widgetIndex={-1}
                widgetData={child}
                isSelected={false}
                onClick={() => { }}
                onWidgetClick={(e: React.MouseEvent) => e.stopPropagation()} // Added type annotation
              />
              <Box
                className="delete-btn"
                sx={{
                  display: 'none',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: 1,
                  zIndex: 10,
                  cursor: 'pointer'
                }}
              >
                <IconButton size="small" onClick={(e) => onDeleteChild(e, idx)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default RowFieldComponent;
