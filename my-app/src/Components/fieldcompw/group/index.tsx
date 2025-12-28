import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface GroupFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const GroupFieldComponent: React.FC<GroupFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { groupEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getAlignmentStyle = () => {
    switch (groupEditorOptions.alignment) {
      case 'center':
        return { justifyContent: 'center' };
      case 'right':
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'flex-start' };
    }
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: '100%',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        padding: '16px',
        position: 'relative',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: `${groupEditorOptions.spacing || 10}px`,
          flexWrap: 'wrap',
          ...getAlignmentStyle(),
        }}
      >
        {(groupEditorOptions.elements || []).map((element, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '8px 16px',
              minWidth: '80px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="body2">{element}</Typography>
          </Box>
        ))}

      </Box>
    </Box>
  );
};

export default GroupFieldComponent;