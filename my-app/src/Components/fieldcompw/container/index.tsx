import React from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface ContainerFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const ContainerFieldComponent: React.FC<ContainerFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { containerEditorOptions } = useSelector((state: RootState) => state.workspace);

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        maxWidth: containerEditorOptions.maxWidth || '800px',
        margin: '0 auto',
        backgroundColor: containerEditorOptions.backgroundColor || '#ffffff',
        padding: `${containerEditorOptions.padding || 20}px`,
        border: isSelected ? '2px dashed blue' : 
          containerEditorOptions.border?.style === 'none' ? 'none' : 
          `${containerEditorOptions.border?.width || 1}px ${containerEditorOptions.border?.style || 'solid'} ${containerEditorOptions.border?.color || '#ddd'}`,
        borderRadius: '4px',
        position: 'relative',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          color: '#999',
          fontSize: '14px',
          textAlign: 'center',
        }}
      >
        Container Content Area
        <Box sx={{ fontSize: '12px', color: '#666', mt: 0.5 }}>
          {containerEditorOptions.maxWidth || '800px'}
        </Box>
      </Box>
    </Box>
  );
};

export default ContainerFieldComponent;