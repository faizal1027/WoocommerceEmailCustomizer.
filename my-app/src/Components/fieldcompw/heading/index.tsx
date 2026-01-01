import { Box, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import {
  updateWidgetContentData,
  updateColumnHeight,
  openEditor,
  setSelectedBlockId,
  defaultHeadingEditorOptions,
} from '../../../Store/Slice/workspaceSlice';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeadingFieldComponentProps {
  blockId: string;
  columnIndex: number;
  onClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const HeadingFieldComponent: React.FC<HeadingFieldComponentProps> = ({ blockId, columnIndex, onClick, widgetIndex }) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const { selectedBlockForEditor, selectedColumnIndex } = useSelector((state: RootState) => state.workspace);
  const isSelected = selectedBlockForEditor === blockId && selectedColumnIndex === columnIndex;
  const column = useSelector((state: RootState) =>
    state.workspace.blocks.find(block => block.id === blockId)?.columns[columnIndex]
  );
  const widgetContent = column?.widgetContents[widgetIndex] || null;
  const headingContent = widgetContent?.contentData ? JSON.parse(widgetContent.contentData) : {
    ...defaultHeadingEditorOptions,
    ...defaultHeadingEditorOptions,
    content: widgetContent ? "" : "Heading"
  };

  // Ensure padding exists
  if (!headingContent.padding) {
    headingContent.padding = { top: 10, right: 10, bottom: 10, left: 10 };
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedContent = event.target.value;
    const updatedData = { ...headingContent, content: updatedContent }
    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify(updatedData),
    }));
  };

  const handleSelectTextField = () => {
    if (!isSelected) {
      dispatch(openEditor({ blockId, columnIndex, widgetIndex }));
    }
  };

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const inputElement = contentRef.current.querySelector('textarea') || contentRef.current.querySelector('input');
      if (inputElement) {
        const contentHeight = inputElement.scrollHeight;
        dispatch(updateColumnHeight({
          blockId,
          columnIndex,
          height: contentHeight,
        }));
      }
    }
  }, [blockId, columnIndex, dispatch]);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    const debounce = (func: () => void, delay: number) => {
      let timeoutId: any;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
      };
    };

    const debouncedMeasureHeight = debounce(measureHeight, 100);

    if (contentRef.current) {
      resizeObserver = new ResizeObserver(debouncedMeasureHeight);
      resizeObserver.observe(contentRef.current);
    }

    measureHeight();
    window.addEventListener('resize', debouncedMeasureHeight);
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', debouncedMeasureHeight);
    };
  }, [measureHeight]);

  const { fontFamily, fontWeight, fontSize, color, textAlign, lineHeight, letterSpace, content, backgroundColor } = headingContent;
  const padding = headingContent.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const hasContent = widgetContent?.contentType === "heading";

  return (
    <Box
      ref={contentRef}
      onClick={(e) => {
        // Allow bubbling
      }}
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
        alignItems: "flex-start",
        "&:hover": { border: "1px solid green" },
      }}
    >
      {hasContent ? (
        <TextField
          multiline
          fullWidth
          variant="standard"
          value={content || ""}
          onChange={handleTextChange}
          placeholder="Type your heading here..."
          InputProps={{
            disableUnderline: true,

            sx: {
              fontFamily: fontFamily === "global" ? "inherit" : fontFamily,
              fontWeight: fontWeight,
              fontSize: `${fontSize}px`,
              color: color,
              lineHeight: `${lineHeight}%`,
              letterSpacing: `${letterSpace}px`,
              padding: 0,
              '& .MuiInputBase-input': { textAlign: textAlign, padding: 0 },
              '& .MuiInputBase-inputMultiline': { textAlign: textAlign, padding: 0, minHeight: "auto" },
            },
          }}
          sx={{
            '.MuiInputBase-root': { height: "100%", alignItems: "flex-start" },
            '.MuiInputBase-inputMultiline': { height: "auto", overflowY: "auto", resize: "none" },
          }}
          onClick={handleSelectTextField}
        />
      ) : (
        <Box sx={{ color: "text.secondary", textAlign: "center", fontStyle: "italic" }}>
          No content here. Drag content from .
        </Box>
      )}
    </Box>
  );
}

export default HeadingFieldComponent;