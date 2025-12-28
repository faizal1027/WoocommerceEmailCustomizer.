import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface MapFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const MapFieldComponent: React.FC<MapFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { mapEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getGoogleMapsEmbedUrl = () => {
    const location = encodeURIComponent(mapEditorOptions.location || 'New York, NY');
    const zoom = mapEditorOptions.zoom || 12;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location}&zoom=${zoom}`;
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
        width: mapEditorOptions.width || '100%',
        height: mapEditorOptions.height || '300px',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#e0e0e0',
          color: '#666',
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Map Preview
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {mapEditorOptions.location || 'New York, NY'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#999' }}>
          Zoom: {mapEditorOptions.zoom || 12}
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', mt: 1 }}>
          (Google Maps integration requires API key)
        </Typography>
      </Box>
    </Box>
  );
};

export default MapFieldComponent;