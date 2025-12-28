import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface NavbarFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const NavbarFieldComponent: React.FC<NavbarFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { navbarEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        border: isSelected ? '2px dashed blue' : 'none',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: `${navbarEditorOptions.height || 60}px`,
          backgroundColor: navbarEditorOptions.backgroundColor || '#343a40',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >

        <Box sx={{ display: 'flex', gap: '20px' }}>
          {(navbarEditorOptions.items || []).map((item, index) => (
            <Typography
              key={index}
              component="a"
              href={item.url || '#'}
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: navbarEditorOptions.textColor || '#ffffff',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.text}
            </Typography>
          ))}
          {(!navbarEditorOptions.items || navbarEditorOptions.items.length === 0) && (
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              No navbar items
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NavbarFieldComponent;