import React from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface SpacerFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick?: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
}

const SpacerFieldComponent: React.FC<SpacerFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();

  const storeSpacerOptions = useSelector((state: RootState) => state.workspace.spacerEditorOptions);

  const spacerEditorOptions = widgetData?.contentData
    ? JSON.parse(widgetData.contentData)
    : storeSpacerOptions;

  return (
    <Box
      onClick={(e) => {
        if (onWidgetClick) {
          onWidgetClick(e);
        } else if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      sx={{
        width: '100%',
        height: `${spacerEditorOptions.height || 20}px`,
        backgroundColor: spacerEditorOptions.backgroundColor || 'transparent',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.5,
        }}
      >
        <Box
          sx={{
            width: '80%',
            height: '1px',
            backgroundColor: '#ddd',
            borderTop: '1px dashed #aaa',
          }}
        />
      </Box>
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {spacerEditorOptions.height || 20}px
        </Box>
      )}
    </Box>
  );
};

export default SpacerFieldComponent;