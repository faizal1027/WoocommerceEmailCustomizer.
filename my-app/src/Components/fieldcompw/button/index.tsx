import { Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, updateColumnHeight } from '../../../Store/Slice/workspaceSlice';
import { useRef, useEffect, useCallback } from 'react';
import { ButtonEditorOptions } from '../../../Store/Slice/workspaceSlice';

interface ButtonFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;

}

const ButtonFieldComponent: React.FC<ButtonFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
}) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const widgetContent = useSelector((state: RootState) =>
    state.workspace.blocks.find((block) => block.id === blockId)?.columns[columnIndex]?.widgetContents[widgetIndex] || null
  );
  const buttonData: ButtonEditorOptions | null = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : null;

  const buttonContent = buttonData?.text || 'Button';
  const bgColor = buttonData?.bgColor || '#1976d2';
  const textColor = buttonData?.textColor || '#ffffff';
  const fontSize = buttonData?.fontSize || 14;
  const fontWeight = buttonData?.fontWeight || '400';
  const textAlign = buttonData?.textAlign || 'center';
  const fontStyle = buttonData?.fontStyle || 'normal';
  const width = buttonData?.widthAuto === false && buttonData?.width ? `${buttonData.width}%` : undefined;

  // Ensure padding exists
  const padding = buttonData?.padding || { top: 8, right: 16, bottom: 8, left: 16 };

  const borderRadius = buttonData?.borderRadius || { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 };
  const urlDisabled = buttonData?.urlDisabled || false;
  const url = buttonData?.url || '#';

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      dispatch(updateColumnHeight({ blockId, columnIndex, height: contentHeight }));
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

    measureHeight();

    if (contentRef.current) {
      resizeObserver = new ResizeObserver(debouncedMeasureHeight);
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener('resize', debouncedMeasureHeight);
    const timer = setTimeout(measureHeight, 0);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', debouncedMeasureHeight);
      clearTimeout(timer);
    };
  }, [measureHeight]);

  return (
    <Box
      ref={contentRef}
      display="flex"
      justifyContent={
        textAlign === 'left'
          ? 'flex-start'
          : textAlign === 'right'
            ? 'flex-end'
            : 'center'
      }
      alignItems="center"
      height="auto"
      width="100%"
      px={`${padding.left}px`}
      py={`${padding.top}px`}
      onClick={(e) => {
        // Allow bubbling to wrapper
      }}
      sx={{
        cursor: 'pointer',
        "&:hover": {
          border: "1px solid green",
        },
      }}
    >
      <Button
        variant="contained"
        disabled={urlDisabled}
        href={urlDisabled ? undefined : url}
        sx={{
          backgroundColor: bgColor,
          color: textColor,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          fontStyle: fontStyle,
          textAlign: textAlign,
          width: width,
          height: "auto",
          minWidth: '64px',
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          borderRadius: `${borderRadius?.topLeft ?? 4}px ${borderRadius?.topRight ?? 4}px ${borderRadius?.bottomRight ?? 4}px ${borderRadius?.bottomLeft ?? 4}px`,
          '&:hover': {
            backgroundColor: bgColor,
            opacity: urlDisabled ? 1 : 0.9,
          },
          '&.Mui-disabled': {
            backgroundColor: bgColor,
            color: textColor,
            opacity: 0.7,
          },
          transition: 'all 0.2s ease',
        }}
      >
        {buttonContent}
      </Button>
    </Box>
  );
};

export default ButtonFieldComponent;