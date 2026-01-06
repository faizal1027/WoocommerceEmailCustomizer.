
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId, updateWidgetContentData, openEditor } from '../../../Store/Slice/workspaceSlice';
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
  path?: Array<{ colIdx: number; childIdx: number }>;
}

const RowFieldComponent: React.FC<RowFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData,
  path = []
}) => {
  const dispatch = useDispatch();
  const selectedNestedPath = useSelector((state: RootState) => state.workspace.selectedNestedPath);

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

  // This change is in RowFieldComponent, but I need to fix workspaceSlice first.
  // I will perform the workspaceSlice fix in the next tool call then.
  // Wait, I can do it here if I verify the logic. 
  // Yes, JSON.parse(action.payload.data) makes sense because previously we were just assigning the string. 
  // Now we want to MERGE expected properties into the nested one.
  // Since RowFieldComponent sends the full object stringified, merging it spread over the old one is effectively a replace/update.

  const handleDrop = (item: any, colIndex: number) => {
    let newWidgetContentData = "{}";
    if (item.widgetType === "image") newWidgetContentData = item.initialContent || "";

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
      data: JSON.stringify(updatedRowOptions),
      nestedPath: path
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
      data: JSON.stringify(updatedRowOptions),
      nestedPath: path
    }));
  };

  return (
    <Box
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
          onDrop={(item: any) => handleDrop(item, colIdx)}
          onDeleteChild={(e: React.MouseEvent, childIdx: number) => handleDeleteChild(e, colIdx, childIdx)}
          blockId={blockId}
          columnIndex={columnIndex}
          widgetIndex={widgetIndex}
          selectedNestedPath={selectedNestedPath}
          path={path}
        />
      ))}
    </Box>
  );
};

// Sub-component for individual column drop target
const ColumnDropTarget = ({ colData, colIdx, onDrop, onDeleteChild, blockId, columnIndex, widgetIndex, selectedNestedPath, path }: any) => {
  const dispatch = useDispatch();
  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'content',
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onDrop]);

  drop(dropRef);

  const isCurrentSelection = (childIdx: number) => {
    if (!selectedNestedPath || selectedNestedPath.length !== path.length + 1) return false;
    for (let i = 0; i < path.length; i++) {
      if (selectedNestedPath[i].colIdx !== path[i].colIdx || selectedNestedPath[i].childIdx !== path[i].childIdx) return false;
    }
    const lastPart = selectedNestedPath[selectedNestedPath.length - 1];
    return lastPart.colIdx === colIdx && lastPart.childIdx === childIdx;
  };

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

          const isChildSelected = isCurrentSelection(idx);
          const childPath = [...path, { colIdx, childIdx: idx }];

          return (
            <Box key={child.id || idx} sx={{ position: 'relative', width: '100%', mb: 1, '&:hover .delete-btn': { display: 'flex' } }}>
              <WidgetComponent
                blockId={blockId}
                columnIndex={columnIndex}
                widgetIndex={widgetIndex}
                widgetData={child}
                isSelected={isChildSelected}
                path={childPath}
                onClick={() => {
                  dispatch(openEditor({
                    blockId,
                    columnIndex,
                    contentType: child.contentType,
                    widgetIndex: widgetIndex,
                    nestedPath: childPath
                  }));
                }}
                onWidgetClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch(openEditor({
                    blockId,
                    columnIndex,
                    contentType: child.contentType,
                    widgetIndex: widgetIndex,
                    nestedPath: childPath
                  }));
                }}
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
