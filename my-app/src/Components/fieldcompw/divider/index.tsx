import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, updateColumnHeight } from '../../../Store/Slice/workspaceSlice';

interface DividerFieldComponentProps {
  blockId: string;
  columnIndex: number;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const DividerFieldComponent: React.FC<DividerFieldComponentProps> = ({ blockId, columnIndex, onClick, onWidgetClick, widgetIndex }) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const widgetContent = useSelector((state: RootState) => {
    const block = state.workspace.blocks.find((b) => b.id === blockId);
    return block?.columns[columnIndex]?.widgetContents[widgetIndex] || null;
  });

  const dividerOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      width: '75',
      style: 'solid',
      thickness: 2,
      color: '#000000',
      alignment: 'center',
      padding: { top: 10, right: 0, bottom: 10, left: 0 },
    };

  // Ensure padding exists
  if (!dividerOptions.padding) {
    dividerOptions.padding = { top: 10, right: 0, bottom: 10, left: 0 };
  }

  // Ensure padding exists
  if (!dividerOptions.padding) {
    dividerOptions.padding = { top: 10, right: 0, bottom: 10, left: 0 };
  }

  const { width, style, thickness, color, alignment, padding } = dividerOptions;

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
      let timeoutId: NodeJS.Timeout;
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
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedMeasureHeight);
    };
  }, [measureHeight]);

  return (
    <Box
      ref={contentRef}
      onClick={(e) => {
        // Allow bubbling
      }}
      sx={{
        width: '100%',
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        display: 'flex',
        justifyContent:
          alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
        "&:hover": {
          border: "1px solid green",
        },
      }}
    >
      <Box
        sx={{
          width: `${width}%`,
          borderTop: `${thickness}px ${style} ${color}`,
          height: 0,
        }}
      />
    </Box>
  );
};

export default DividerFieldComponent;