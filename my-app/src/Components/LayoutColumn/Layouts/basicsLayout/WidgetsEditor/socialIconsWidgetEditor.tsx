import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Tooltip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { memo } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import DeleteIcon from "@mui/icons-material/Delete";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  deleteColumnContent,
  closeEditor,
  updateSocialIconsEditorOptions
} from "../../../../../Store/Slice/workspaceSlice";

const socialIcons = {
  facebook: { icon: <FacebookIcon />, fallback: "f", color: "#3b5998" },
  twitter: { icon: <TwitterIcon />, fallback: "t", color: "#1DA1F2" },
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

type SocialIconKey = keyof typeof socialIcons;

const SocialIconsWidgetEditor = memo(() => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, socialIconsEditorOptions } = useSelector(
    (state: RootState) => state.workspace
  );

  const { iconAlign, padding, iconColor, iconSize, iconSpace, addedIcons } =
    socialIconsEditorOptions;


  const updateSocialIconsData = (updates: Partial<typeof socialIconsEditorOptions>) => {
    dispatch(updateSocialIconsEditorOptions(updates));
  };

  const handleAddIcon = (key: SocialIconKey) => {
    const baseUrl = `https://${key}.com`;
    const isAlreadyAdded = addedIcons.icons.includes(key);
    if (!isAlreadyAdded) {
      updateSocialIconsData({
        addedIcons: {
          icons: [...addedIcons.icons, key],
          url: [...addedIcons.url, baseUrl],
        },
      });
    }
  };

  const handleDeleteIcon = (key: SocialIconKey) => {
    const iconIndex = addedIcons.icons.indexOf(key);
    if (iconIndex !== -1) {
      const newIcons = addedIcons.icons.filter((_, i) => i !== iconIndex);
      const newUrls = addedIcons.url.filter((_, i) => i !== iconIndex);
      updateSocialIconsData({
        addedIcons: { icons: newIcons, url: newUrls },
      });
    }
  };

  const handlePaddingChange = (side: "top" | "left" | "right" | "bottom", value: number) => {
    updateSocialIconsData({ padding: { ...padding, [side]: value } });
  };

  const handleUrlChange = (key: SocialIconKey, value: string) => {
    const iconIndex = addedIcons.icons.indexOf(key);
    if (iconIndex !== -1) {
      const newUrls = [...addedIcons.url];
      newUrls[iconIndex] = value;
      updateSocialIconsData({
        addedIcons: { icons: addedIcons.icons, url: newUrls },
      });
    }
  };

  const handleDeleteContent = () => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      dispatch(
        deleteColumnContent({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
        })
      );
    }
  };



  const handleCloseEditor = () => {
    dispatch(closeEditor());
  };

  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Social Icons</Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Close">
              <IconButton onClick={handleCloseEditor} size="small" sx={{ p: 0.5 }}>
                <CloseIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteContent} size="small" sx={{ p: 0.5 }}>
                <DeleteIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '11px', color: '#6d7882', fontStyle: 'italic' }}>
          Manage social media links.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Icons Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Social Icons</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              {addedIcons.icons.map((key: SocialIconKey, index: number) => {
                const { icon } = socialIcons[key];
                return (
                  <Box key={key} sx={{ border: "1px solid #e7e9eb", borderRadius: '4px', p: 2, bgcolor: '#f9f9f9' }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 1.5 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {React.cloneElement(icon, {
                          sx: {
                            color: iconColor === "color" ? socialIcons[key].color : iconColor === "black" ? "#000" : "#a4afb7",
                            width: 20, height: 20
                          },
                        })}
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#495157' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                      </Box>
                      <IconButton onClick={() => handleDeleteIcon(key)} size="small" sx={{ p: 0.5 }}>
                        <DeleteIcon fontSize="small" sx={{ color: '#ff4d4d', fontSize: '16px' }} />
                      </IconButton>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>URL</Typography>
                      <TextField
                        size="small"
                        fullWidth
                        value={addedIcons.url[index] || ""}
                        onChange={(e) => handleUrlChange(key, e.target.value)}
                        InputProps={{ sx: { fontSize: '11px', bgcolor: '#fff' } }}
                      />
                    </Box>
                  </Box>
                );
              })}

              <Box sx={{ pt: 1 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Add New Icon</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {Object.keys(socialIcons)
                    .filter((key) => !addedIcons.icons.includes(key as SocialIconKey))
                    .map((iconKey) => {
                      const iconData = socialIcons[iconKey as SocialIconKey];
                      return (
                        <Tooltip title={`Add ${iconKey}`} key={iconKey} arrow>
                          <Box
                            onClick={() => handleAddIcon(iconKey as SocialIconKey)}
                            sx={{
                              width: 32, height: 32, borderRadius: "50%", border: '1px solid #e7e9eb',
                              backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center",
                              cursor: "pointer", "&:hover": { bgcolor: '#f9f9f9', transform: 'scale(1.1)' },
                              transition: 'all 0.2s',
                            }}
                          >
                            {React.cloneElement(iconData.icon, { sx: { color: iconData.color, width: 18, height: 18 } })}
                          </Box>
                        </Tooltip>
                      );
                    })}
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Style Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Color Style</Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={iconColor === "color" ? "color" : iconColor === "black" ? "black" : "#0000"}
                    onChange={(e) => updateSocialIconsData({ iconColor: e.target.value as string })}
                    sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                    MenuProps={{
                      disablePortal: true,
                      sx: { zIndex: 999999 }
                    }}
                  >
                    <MenuItem value="color" sx={{ fontSize: '11px' }}>Original Color</MenuItem>
                    <MenuItem value="black" sx={{ fontSize: '11px' }}>Black & White</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Icon Size (px)</Typography>
                  <TextField
                    value={iconSize}
                    onChange={(e) => updateSocialIconsData({ iconSize: Number(e.target.value) })}
                    type="number"
                    InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Spacing (px)</Typography>
                  <TextField
                    value={iconSpace}
                    onChange={(e) => updateSocialIconsData({ iconSpace: Number(e.target.value) })}
                    type="number"
                    InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={iconAlign}
                  onChange={(e, newAlign) => newAlign && updateSocialIconsData({ iconAlign: newAlign as "left" | "center" | "right" })}
                  size="small"
                  sx={{ bgcolor: '#f9f9f9' }}
                >
                  <ToggleButton value="left" sx={{ p: '5px' }}><FormatAlignLeftIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="center" sx={{ p: '5px' }}><FormatAlignCenterIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="right" sx={{ p: '5px' }}><FormatAlignRightIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
});

export default SocialIconsWidgetEditor;
