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

interface ContainerFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
  path?: Array<{ colIdx: number; childIdx: number }>;
}

const ContainerFieldComponent: React.FC<ContainerFieldComponentProps> = ({
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

  const containerOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      maxWidth: '800px',
      backgroundColor: '#ffffff',
      padding: 20,
      children: []
    };

  const dropRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'content',
    drop: (item: any) => handleDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [containerOptions, blockId, columnIndex, widgetIndex, dispatch]);

  drop(dropRef);

  const handleDrop = (item: any) => {
    let newWidgetContentData = "{}";
    if (item.widgetType === "image") newWidgetContentData = item.initialContent || "";

    const newChild = {
      id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentType: item.widgetType,
      contentData: newWidgetContentData
    };

    const updatedOptions = {
      ...containerOptions,
      children: [...(containerOptions.children || []), newChild]
    };

    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedOptions),
      nestedPath: path
    }));
  };

  const handleDeleteChild = (e: React.MouseEvent, childIndex: number) => {
    e.stopPropagation();
    const updatedChildren = (containerOptions.children || []).filter((_: any, idx: number) => idx !== childIndex);
    const updatedOptions = { ...containerOptions, children: updatedChildren };

    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedOptions),
      nestedPath: path
    }));
  };

  const isCurrentSelection = (childIdx: number) => {
    if (!selectedNestedPath || selectedNestedPath.length !== path.length + 1) return false;
    for (let i = 0; i < path.length; i++) {
      if (selectedNestedPath[i].colIdx !== path[i].colIdx || selectedNestedPath[i].childIdx !== path[i].childIdx) return false;
    }
    const lastPart = selectedNestedPath[selectedNestedPath.length - 1];
    return lastPart.colIdx === -1 && lastPart.childIdx === childIdx;
  };

  const normalizedPadding = typeof containerOptions.padding === 'object' ? containerOptions.padding : {
    top: containerOptions.padding || 20,
    right: containerOptions.padding || 20,
    bottom: containerOptions.padding || 20,
    left: containerOptions.padding || 20
  };

  return (
    <Box
      ref={dropRef}
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: '100%',
        maxWidth: containerOptions.maxWidth || '800px',
        margin: '0 auto',
        backgroundColor: containerOptions.backgroundColor || '#ffffff',
        paddingTop: `${normalizedPadding.top}px`,
        paddingRight: `${normalizedPadding.right}px`,
        paddingBottom: `${normalizedPadding.bottom}px`,
        paddingLeft: `${normalizedPadding.left}px`,
        border: isSelected ? '2px dashed blue' :
          containerOptions.border?.style === 'none' ? (isOver ? '2px dashed green' : '1px solid #ddd') :
            `${containerOptions.border?.width || 1}px ${containerOptions.border?.style || 'solid'} ${containerOptions.border?.color || '#ddd'}`,
        borderRadius: '4px',
        position: 'relative',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {(!containerOptions.children || containerOptions.children.length === 0) ? (
        <Box sx={{ color: '#999', fontSize: '14px', textAlign: 'center', py: 2 }}>
          Container Content Area
        </Box>
      ) : (
        containerOptions.children.map((child: any, idx: number) => {
          const WidgetComponent = getWidgetComponent(child.contentType);
          if (!WidgetComponent) return null;

          const isChildSelected = isCurrentSelection(idx);
          const childPath = [...path, { colIdx: -1, childIdx: idx }];

          return (
            <Box key={child.id || idx} sx={{ position: 'relative', width: '100%', mb: 1, '&:hover .delete-btn-container': { display: 'flex' } }}>
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
                className="delete-btn-container"
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
                <IconButton size="small" onClick={(e) => handleDeleteChild(e, idx)}>
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

export default ContainerFieldComponent;
