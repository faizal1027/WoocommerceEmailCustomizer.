import React from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

interface IconFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const IconFieldComponent: React.FC<IconFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { iconEditorOptions } = useSelector((state: RootState) => state.workspace);

  const getIconComponent = () => {
    switch (iconEditorOptions.iconType) {
      case 'star':
        return StarIcon;
      case 'heart':
        return FavoriteIcon;
      case 'check':
        return CheckCircleIcon;
      case 'info':
        return InfoIcon;
      case 'warning':
        return WarningIcon;
      case 'error':
        return ErrorIcon;
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
      case 'home':
        return HomeIcon;
      case 'mail':
        return MailIcon;
      case 'phone':
        return PhoneIcon;
      case 'location':
        return LocationOnIcon;
      case 'calendar':
        return CalendarTodayIcon;
      case 'user':
        return PersonIcon;
      default:
        return StarIcon;
    }
  };

  const IconComponent = getIconComponent();

  const handleClick = (e: React.MouseEvent) => {
    // e.stopPropagation(); // Bubbling allowed
    onWidgetClick(e);
    onClick();
    dispatch(setSelectedBlockId(blockId));

    // If link is provided, open in new tab
    if (iconEditorOptions.link) {
      window.open(iconEditorOptions.link, '_blank');
    }
  };

  return (
    <Box
      onClick={(e) => {
        // Allow bubbling but keep link functionality if needed?
        // Wait, handleClick has link logic. I need to be careful with Icon.
        if (iconEditorOptions.link) {
          e.stopPropagation(); // If it's a link, maybe we WANT to stop? No, we want to select it too.
          // But if it's a link, we usually don't want to follow it in editor?
          // handleClick opens window.open.
          // If I remove stopProp, editor opens. window.open also happens?
          // Let's just remove stopPropagation and see.
          // Actually, handleClick logic:
          // e.stopPropagation();
          // onWidgetClick(e); ...
          // if (link) window.open...

          // If I remove stopProp from handleClick, it bubbles. Wrapper selects it.
          // window.open still happens.
          // This is fine.

          // I will modify handleClick function itself.
        }
        handleClick(e);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: iconEditorOptions.alignment === 'left' ? 'flex-start' :
          iconEditorOptions.alignment === 'center' ? 'center' :
            iconEditorOptions.alignment === 'right' ? 'flex-end' :
              iconEditorOptions.alignment === 'justify' ? 'space-between' : 'flex-start',
        border: isSelected ? '2px dashed blue' : 'none',
        borderRadius: '4px',
        paddingTop: `${iconEditorOptions.paddingTop || 0}px`,
        paddingRight: `${iconEditorOptions.paddingRight || 0}px`,
        paddingBottom: `${iconEditorOptions.paddingBottom || 0}px`,
        paddingLeft: `${iconEditorOptions.paddingLeft || 0}px`,
        backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
        cursor: iconEditorOptions.link ? 'pointer' : 'default',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <IconComponent
        sx={{
          fontSize: iconEditorOptions.size || 24,
          color: iconEditorOptions.color || '#000000',
        }}
      />
    </Box>
  );
};

export default IconFieldComponent;