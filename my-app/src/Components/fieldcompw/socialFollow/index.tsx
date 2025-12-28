import React from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PinterestIcon from '@mui/icons-material/Pinterest';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';

interface SocialFollowFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const SocialFollowFieldComponent: React.FC<SocialFollowFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { socialFollowEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return FacebookIcon;
      case 'twitter':
        return TwitterIcon;
      case 'instagram':
        return InstagramIcon;
      case 'linkedin':
        return LinkedInIcon;
      case 'youtube':
        return YouTubeIcon;
      case 'pinterest':
        return PinterestIcon;
      case 'whatsapp':
        return WhatsAppIcon;
      case 'telegram':
        return TelegramIcon;
      case 'github':
        return GitHubIcon;
      default:
        return FacebookIcon;
    }
  };

  const handleIconClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank');
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
        border: isSelected ? '2px dashed blue' : 'none',
        borderRadius: '4px',
        padding: '16px',
        position: 'relative',
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: `${socialFollowEditorOptions.spacing || 10}px`,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {(socialFollowEditorOptions.platforms || []).map((platform, index) => {
          const IconComponent = getIconComponent(platform.icon);
          return (
            <Box
              key={index}
              onClick={(e) => handleIconClick(e, platform.url)}
              sx={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                padding: '8px',
                backgroundColor: '#f0f0f0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <IconComponent
                sx={{
                  fontSize: socialFollowEditorOptions.iconSize || 24,
                  color: socialFollowEditorOptions.iconColor || '#000000',
                }}
              />
            </Box>
          );
        })}
        {(!socialFollowEditorOptions.platforms || socialFollowEditorOptions.platforms.length === 0) && (
          <Box
            sx={{
              color: '#999',
              fontSize: '14px',
              textAlign: 'center',
              width: '100%',
              py: 2,
            }}
          >
            No social platforms added
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SocialFollowFieldComponent;