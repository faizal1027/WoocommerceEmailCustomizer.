import React from 'react';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, defaultImageEditorOptions } from '../../../Store/Slice/workspaceSlice';
import { useCallback, useEffect, useRef } from 'react';

interface ImageFieldComponentProps {
  blockId: string;
  columnIndex: number;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
  widgetData?: any;
}

const ImageFieldComponent: React.FC<ImageFieldComponentProps> = ({
  blockId,
  columnIndex,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const storeWidgetContent = useSelector((state: RootState) =>
    state.workspace.blocks.find((block) => block.id === blockId)?.columns[columnIndex]?.widgetContents[widgetIndex] || null
  );

  const widgetContent = widgetData || storeWidgetContent;

  const imageOptions = widgetContent?.contentData
    ? { ...defaultImageEditorOptions, ...JSON.parse(widgetContent.contentData) }
    : defaultImageEditorOptions;

  // Ensure padding exists if it's missing from the JSON
  if (!imageOptions.padding) {
    imageOptions.padding = { top: 0, bottom: 0, left: 0, right: 0 };
  }



  return (
    <Box
      ref={contentRef}
      onClick={(e) => {
        if (onWidgetClick) {
          onWidgetClick(e);
        } else if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      sx={{
        cursor: 'pointer',
        textAlign: imageOptions.align,
        paddingTop: `${imageOptions.padding.top}px`,
        paddingBottom: `${imageOptions.padding.bottom}px`,
        paddingLeft: `${imageOptions.padding.left}px`,
        paddingRight: `${imageOptions.padding.right}px`,
      }}
    >
      <Box
        component="img"
        src={imageOptions.src}
        alt={imageOptions.altText}
        sx={{
          width: imageOptions.autoWidth ? '100%' : imageOptions.width || '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'inline-block',
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://cdn.tools.unlayer.com/image/placeholder.png';
        }}
      />
    </Box>
  );
};

export default ImageFieldComponent;