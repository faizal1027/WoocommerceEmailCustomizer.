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

// DEBUG LOGGER





interface SectionFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
  path?: Array<{ colIdx: number; childIdx: number }>;
}

const SectionFieldComponent: React.FC<SectionFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData,
  path = []
}) => {
  // ESCALATION LOG: Verify Entry


  const dispatch = useDispatch();
  const selectedNestedPath = useSelector((state: RootState) => state.workspace.selectedNestedPath);

  const storeWidgetContent = useSelector((state: RootState) => {
    const block = state.workspace.blocks.find((b) => b.id === blockId);
    return block?.columns[columnIndex]?.widgetContents[widgetIndex] || null;
  });

  const widgetContent = widgetData || storeWidgetContent;



  const sectionOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      backgroundColor: '#f5f5f5',
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      border: { width: 1, style: 'solid', color: '#dddddd', radius: 0 },
      children: []
    };

  const dropRef = React.useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'content',
    drop: (item: { widgetType: string, initialContent?: string }) => {
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

      const updatedChildren = [...(sectionOptions.children || []), newChild];
      const updatedSectionOptions = { ...sectionOptions, children: updatedChildren };

      dispatch(updateWidgetContentData({
        blockId,
        columnIndex,
        widgetIndex,
        data: JSON.stringify(updatedSectionOptions)
      }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [sectionOptions, blockId, columnIndex, widgetIndex, dispatch]);

  drop(dropRef);

  const handleDeleteChild = (e: React.MouseEvent, childIndex: number) => {
    e.stopPropagation();
    const updatedChildren = sectionOptions.children.filter((_: any, idx: number) => idx !== childIndex);
    const updatedSectionOptions = { ...sectionOptions, children: updatedChildren };

    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedSectionOptions)
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
        backgroundColor: sectionOptions.backgroundColor || '#f5f5f5',
        paddingTop: `${sectionOptions.padding?.top || 20}px`,
        paddingRight: `${sectionOptions.padding?.right || 20}px`,
        paddingBottom: `${sectionOptions.padding?.bottom || 20}px`,
        paddingLeft: `${sectionOptions.padding?.left || 20}px`,
        border: isSelected ? '2px dashed blue' : `${sectionOptions.border?.width || 1}px ${sectionOptions.border?.style || 'solid'} ${sectionOptions.border?.color || '#dddddd'}`,
        borderRadius: `${sectionOptions.border?.radius || 0}px`,
        position: 'relative',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: (!sectionOptions.children || sectionOptions.children.length === 0) ? 'center' : 'flex-start',
        alignItems: 'stretch',
        outline: isOver ? '2px dashed green' : 'none'
      }}
    >
      {(!sectionOptions.children || sectionOptions.children.length === 0) ? (
        <Typography sx={{
          color: '#999',
          fontSize: '14px',
          width: '100%',
          textAlign: 'center',
          padding: '20px',
          border: '1px dashed #ccc',
          boxSizing: 'border-box'
        }}>
          Drag Content Here
        </Typography>
      ) : (
        sectionOptions.children.map((child: any, idx: number) => {
          const WidgetComponent = getWidgetComponent(child.contentType);
          if (!WidgetComponent) return null;

          const isChildSelected = isCurrentSelection(idx);
          const childPath = [...path, { colIdx: -1, childIdx: idx }];

          return (
            <Box key={child.id || idx} sx={{ position: 'relative', width: '100%', mb: 1, '&:hover .delete-btn-section': { display: 'flex' } }}>
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
                    widgetIndex,
                    contentType: child.contentType,
                    nestedPath: childPath
                  }));
                }}
                onWidgetClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch(openEditor({
                    blockId,
                    columnIndex,
                    widgetIndex,
                    contentType: child.contentType,
                    nestedPath: childPath
                  }));
                }}
              />
              <Box
                className="delete-btn-section"
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

export default SectionFieldComponent;
