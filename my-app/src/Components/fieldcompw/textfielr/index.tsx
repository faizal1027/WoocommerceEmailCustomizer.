import React, { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, updateColumnHeight, updateWidgetContentData } from '../../../Store/Slice/workspaceSlice';

interface TextFieldComponentProps {
  blockId: string;
  columnIndex: number;
  widgetIndex: number;
  previewMode?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ blockId, columnIndex, widgetIndex, onClick }) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const column = useSelector((state: RootState) =>
    state.workspace.blocks.find(block => block.id === blockId)?.columns[columnIndex]
  );
  const widgetContent = column?.widgetContents[widgetIndex];
  const textEditorOptions = widgetContent?.contentData ? JSON.parse(widgetContent.contentData) : {
    fontFamily: "global",
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: "#d32f2f",
    backgroundColor: "transparent",
    textAlign: "left",
    lineHeight: 140,
    letterSpace: 1,
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
    content: '<p>Click to edit text</p>',
  };

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      dispatch(updateColumnHeight({
        blockId,
        columnIndex,
        height: contentHeight,
      }));
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
  }, [measureHeight, textEditorOptions.content]);

  const { fontFamily, fontSize, fontWeight, fontStyle, color, textAlign, lineHeight, letterSpace, backgroundColor, content } = textEditorOptions;
  const padding = textEditorOptions.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const hasContent = widgetContent?.contentType === 'text';

  const handleContentChange = (newContent: string) => {
    dispatch(updateWidgetContentData({
      blockId,
      columnIndex,
      widgetIndex,
      data: JSON.stringify({ ...textEditorOptions, content: newContent }),
    }));
  };

  return (
    <Box
      ref={contentRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: "100%",
        backgroundColor: backgroundColor,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        height: 'auto',
        position: 'relative',
        cursor: 'pointer',
        boxSizing: 'border-box',
        minHeight: 'auto',
        "&:hover": {
          border: "1px solid green",
        },
        fontFamily: fontFamily === 'global' ? 'inherit' : fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight || 'normal',
        fontStyle: fontStyle || 'normal',
        color: color,
        textAlign: textAlign,
        lineHeight: `${lineHeight / 100}`,
        letterSpacing: `${letterSpace}px`,
      }}
    >
      {hasContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Box sx={{ color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}>
          No content here. Drag content from left.
        </Box>
      )}
    </Box>
  );
};

export default TextFieldComponent;