import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import {
  updateWidgetContentData,
  openEditor,
  setSelectedBlockId,
  defaultHeadingEditorOptions,
  updateHeadingEditorOptions
} from '../../../Store/Slice/workspaceSlice';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeadingFieldComponentProps {
  blockId: string;
  columnIndex: number;
  onClick: (e: React.MouseEvent) => void;
  onWidgetClick?: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
  widgetData?: any;
}

const HeadingFieldComponent: React.FC<HeadingFieldComponentProps> = ({ blockId, columnIndex, onClick, onWidgetClick, widgetIndex, widgetData, previewMode }) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedBlockForEditor, selectedColumnIndex } = useSelector((state: RootState) => state.workspace);
  const isSelected = selectedBlockForEditor === blockId && selectedColumnIndex === columnIndex;
  const column = useSelector((state: RootState) =>
    state.workspace.blocks.find(block => block.id === blockId)?.columns[columnIndex]
  );
  const storeWidgetContent = column?.widgetContents[widgetIndex] || null;
  const finalContentData = widgetData ? widgetData.contentData : storeWidgetContent?.contentData;
  const headingContent = finalContentData
    ? { ...defaultHeadingEditorOptions, ...JSON.parse(finalContentData) }
    : defaultHeadingEditorOptions;

  // Ensure padding exists
  if (!headingContent.padding) {
    headingContent.padding = { top: 10, right: 10, bottom: 10, left: 10 };
  }

  const handleSelectTextField = (e?: React.MouseEvent) => {
    if (onWidgetClick && e) {
      onWidgetClick(e);
    } else if (onClick && e) {
      e.stopPropagation();
      onClick(e);
    } else {
      // Fallback for standalone usage if any
      if (!isSelected) {
        dispatch(openEditor({ blockId, columnIndex, widgetIndex }));
      }
    }
  };



  const { fontFamily, fontWeight, fontSize, color, textAlign, lineHeight, letterSpace, content, backgroundColor, headingType } = headingContent;
  const padding = headingContent.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const hasContent = true;

  return (
    <Box
      ref={contentRef}
      onClick={(e) => handleSelectTextField(e)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: backgroundColor,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        height: "auto",
        position: "relative",
        cursor: "pointer",
        boxSizing: "border-box",
        minHeight: "auto",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
    >
      {hasContent ? (
        <Typography
          variant={headingType as any || "h1"}
          sx={{
            fontFamily: fontFamily === "global" ? "inherit" : fontFamily,
            fontWeight: fontWeight,
            fontSize: `${fontSize}px`,
            color: color,
            lineHeight: lineHeight ? `${lineHeight}px` : undefined,
            letterSpacing: `${letterSpace}px`,
            textAlign: textAlign,
            width: "100%",
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {content || "Type your heading here..."}
        </Typography>
      ) : (
        <Box sx={{ color: "text.secondary", textAlign: "center", fontStyle: "italic" }}>
          No content here. Drag content from .
        </Box>
      )}
    </Box>
  );
}

export default HeadingFieldComponent;