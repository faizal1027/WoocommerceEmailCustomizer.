import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface LinkBoxFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const LinkBoxFieldComponent: React.FC<LinkBoxFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { linkBoxEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        backgroundColor: linkBoxEditorOptions.backgroundColor || '#f9f9f9',
        padding: `${linkBoxEditorOptions.padding || 10}px`,
        borderRadius: `${linkBoxEditorOptions.borderRadius || 5}px`,
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        position: 'relative',
      }}
    >
      {(linkBoxEditorOptions.links || []).map((link, index) => (
        <Box
          key={index}
          sx={{
            padding: '8px 0',
            borderBottom: index < (linkBoxEditorOptions.links?.length || 0) - 1 ? '1px solid #eee' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.02)',
            },
          }}
        >
          <Typography
            component="a"
            href={link.url || '#'}
            onClick={(e) => e.stopPropagation()}
            sx={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
              display: 'block',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {link.text || 'Link'}
          </Typography>
        </Box>
      ))}
      {(!linkBoxEditorOptions.links || linkBoxEditorOptions.links.length === 0) && (
        <Typography sx={{ color: '#999', fontSize: '14px', textAlign: 'center', py: 2 }}>
          No links added
        </Typography>
      )}
    </Box>
  );
};

export default LinkBoxFieldComponent;