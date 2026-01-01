import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface VideoFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const VideoFieldComponent: React.FC<VideoFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { videoEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getVideoId = (url: string) => {
    // YouTube URL parsing
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoEditorOptions.url);

  return (
    <Box
      onClick={(e) => {
        // Allow bubbling
      }}
      sx={{
        width: videoEditorOptions.width || '100%',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
      }}
    >
      {videoId ? (
        <Box
          component="iframe"
          width="100%"
          height={videoEditorOptions.height || '315px'}
          src={`https://www.youtube.com/embed/${videoId}${videoEditorOptions.autoplay ? '?autoplay=1' : ''}${videoEditorOptions.controls === false ? '&controls=0' : ''}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            display: 'block',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: videoEditorOptions.height || '315px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#333',
            color: '#fff',
            flexDirection: 'column',
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>Video Preview</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
            {videoEditorOptions.url || 'No video URL provided'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#aaa' }}>
            Supports YouTube and Vimeo URLs
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoFieldComponent;