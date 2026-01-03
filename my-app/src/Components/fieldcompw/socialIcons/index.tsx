import { Box, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import {
  updateColumnHeight,
  setSelectedBlockId,
  updateWidgetContentData,
  defaultSocialIconsEditorOptions,
  SocialIconKey,
  SocialIconsEditorOptions,
} from '../../../Store/Slice/workspaceSlice';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";

interface SocialIconsFieldComponentProps {
  blockId: string;
  columnIndex: number;
  onClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const socialIcons = {
  facebook: { icon: <FacebookIcon />, fallback: "f", color: "#3b5998" },
  twitter: { icon: <TwitterIcon />, fallback: "x", color: "#1DA1F2" },
  linkedin: { icon: <LinkedInIcon />, fallback: "l", color: "#0077B5" },
  instagram: { icon: <InstagramIcon />, fallback: "i", color: "#E1306C" },
  pinterest: { icon: <PinterestIcon />, fallback: "p", color: "#Bd081C" },
  youtube: { icon: <YouTubeIcon />, fallback: "y", color: "#FF0000" },
  whatsapp: { icon: <WhatsAppIcon />, fallback: "w", color: "#25D366" },
  reddit: { icon: <RedditIcon />, fallback: "r", color: "#FF4500" },
  github: { icon: <GitHubIcon />, fallback: "g", color: "#181717" },
  telegram: { icon: <TelegramIcon />, fallback: "t", color: "#0088CC" },
  envelope: { icon: <MailIcon />, fallback: "e", color: "#0072C6" },
} as const;

const SocialIconsFieldComponent: React.FC<SocialIconsFieldComponentProps> = ({ blockId, columnIndex, onClick, widgetIndex }) => {
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const widgetContentData = useSelector((state: RootState) => {
    const block = state.workspace.blocks.find((b) => b.id === blockId);
    if (block && block.columns[columnIndex] && block.columns[columnIndex].widgetContents[widgetIndex]) {
      return block.columns[columnIndex].widgetContents[widgetIndex].contentData;
    }
    return null;
  });

  const socialIconsEditorOptions: SocialIconsEditorOptions = widgetContentData
    ? JSON.parse(widgetContentData)
    : { ...defaultSocialIconsEditorOptions };

  // Ensure padding exists
  if (!socialIconsEditorOptions.padding) {
    socialIconsEditorOptions.padding = { top: 10, right: 10, bottom: 10, left: 10 };
  }

  const { iconAlign, padding, iconColor, iconSize, iconSpace, addedIcons } = socialIconsEditorOptions;
  const hasContent = addedIcons.icons.length > 0;

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      dispatch(updateColumnHeight({
        blockId,
        columnIndex,
        height: contentHeight,
      }));
    }
  }, [blockId, columnIndex, dispatch]);

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const debounce = (func: () => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
      };
    };

    const debouncedMeasureHeight = debounce(measureHeight, 100);

    if (contentRef.current) {
      resizeObserver = new ResizeObserver(debouncedMeasureHeight);
      resizeObserver.observe(contentRef.current);
    }

    measureHeight();
    window.addEventListener('resize', debouncedMeasureHeight);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedMeasureHeight);
    };
  }, [measureHeight]);

  return (
    <Box
      ref={contentRef}
      onClick={(e) => {
        // Allow bubbling
      }}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        height: 'auto',
        position: 'relative',
        cursor: 'pointer',
        boxSizing: 'border-box',
        minHeight: 'auto',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        "&:hover": {
          border: "1px solid green",
        },
      }}
    >
      {hasContent ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: iconAlign,
            gap: `${iconSpace}px`,
            width: '100%',
          }}
        >
          {addedIcons.icons.map((key: SocialIconKey, index: number) => {
            const iconData = socialIcons[key];
            return (
              <Box key={key}>
                <a
                  href={addedIcons.url[index] || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {React.cloneElement(iconData.icon, {
                      sx: {
                        fontSize: `${iconSize}px`,
                        color: iconColor === "color" ? socialIcons[key].color : iconColor === "black" ? "#000000" : "#0000",
                      },
                    })}
                  </Box>
                </a>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ color: 'text.secondary', textAlign: iconAlign, fontStyle: 'italic', width: "100%" }}>
          {React.cloneElement(socialIcons.facebook.icon, {
            sx: { fontSize: 24, color: '#808080' },
          })}
          {React.cloneElement(socialIcons.github.icon, {
            sx: { fontSize: 24, color: '#808080' },
          })}
          {React.cloneElement(socialIcons.whatsapp.icon, {
            sx: { fontSize: 24, color: '#808080' },
          })}
        </Typography>
      )}
    </Box>
  );
};

export default SocialIconsFieldComponent;