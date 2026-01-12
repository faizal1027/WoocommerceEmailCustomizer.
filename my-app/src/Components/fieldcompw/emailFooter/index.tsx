import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, defaultEmailFooterEditorOptions } from '../../../Store/Slice/workspaceSlice';
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

const socialIconsMap: any = {
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
};

interface EmailFooterFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
    widgetData?: any;
}

const EmailFooterFieldComponent: React.FC<EmailFooterFieldComponentProps> = ({
    blockId,
    columnIndex,
    isSelected,
    onClick,
    onWidgetClick,
    widgetIndex,
    previewMode = true,
    widgetData
}) => {
    const dispatch = useDispatch();
    // Select data from the specific block/column instead of global editor state
    const block = useSelector((state: RootState) => state.workspace.blocks.find(b => b.id === blockId));
    const column = block?.columns[columnIndex];

    // Parse the saved options
    const options = React.useMemo(() => {
        if (widgetData && widgetData.contentData) {
            try {
                return { ...defaultEmailFooterEditorOptions, ...JSON.parse(widgetData.contentData) };
            } catch (e) {
                console.error("Failed to parse footer options", e);
            }
        }

        const contentData = column?.widgetContents?.[widgetIndex]?.contentData;
        if (contentData) {
            try {
                return { ...defaultEmailFooterEditorOptions, ...JSON.parse(contentData) };
            } catch (e) {
                console.error("Failed to parse footer options", e);
            }
        }
        return defaultEmailFooterEditorOptions;
    }, [column, widgetIndex, widgetData]);

    const emailFooterEditorOptions = options;

    const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;
    const currentYear = new Date().getFullYear();

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
                backgroundColor: emailFooterEditorOptions?.backgroundColor || '#333333',
                color: emailFooterEditorOptions?.textColor || '#ffffff',
                padding: emailFooterEditorOptions?.padding || '30px 20px',
                textAlign: (emailFooterEditorOptions?.textAlign as any) || 'center',
                border: isSelected ? '2px dashed blue' : 'none',
                cursor: 'pointer',
                fontFamily: emailFooterEditorOptions?.fontFamily === 'inherit' || !emailFooterEditorOptions?.fontFamily ? 'inherit' : emailFooterEditorOptions?.fontFamily,
                fontSize: emailFooterEditorOptions?.fontSize || '14px',
            }}
        >
            {/* Social Media Icons */}
            {emailFooterEditorOptions?.showSocialMedia !== false && (
                <Box sx={{
                    marginBottom: '15px',
                    display: 'flex',
                    justifyContent: (emailFooterEditorOptions?.textAlign === 'left' ? 'flex-start' :
                        emailFooterEditorOptions?.textAlign === 'right' ? 'flex-end' :
                            'center'),
                    gap: '10px'
                }}>
                    {emailFooterEditorOptions?.socialIcons?.icons?.map((key: string, index: number) => {
                        const iconData = socialIconsMap[key];
                        if (!iconData) return null;
                        const url = emailFooterEditorOptions?.socialIcons?.urls?.[index] || '#';
                        return (
                            <a href={url} key={key} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none' }}>
                                {React.cloneElement(iconData.icon, {
                                    sx: {
                                        width: 32,
                                        height: 32,
                                        color: iconData.color, // Default to color as requested
                                        display: 'block'
                                    }
                                })}
                            </a>
                        );
                    })}
                </Box>
            )}

            {/* Store Address */}
            {emailFooterEditorOptions?.showAddress !== false && (
                <Typography variant="body2" sx={{ marginBottom: '10px', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}>
                    {emailFooterEditorOptions?.storeAddress || '{{store_address}}'}
                </Typography>
            )}

            {/* Contact Info */}
            {emailFooterEditorOptions?.showContact !== false && (
                <Typography variant="body2" sx={{ marginBottom: '10px', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' }}>
                    {emailFooterEditorOptions?.emailLabel || 'Email:'} {emailFooterEditorOptions?.contactEmail || '{{store_email}}'} |
                    {emailFooterEditorOptions?.phoneLabel || 'Phone:'} {emailFooterEditorOptions?.contactPhone || '{{store_phone}}'}
                </Typography>
            )}

            {/* Legal Section: Links */}
            {emailFooterEditorOptions?.showLegal !== false && (
                <Box sx={{ marginBottom: '10px' }}>
                    {emailFooterEditorOptions?.privacyLinkUrl && (
                        <Link href={emailFooterEditorOptions.privacyLinkUrl} sx={{ color: emailFooterEditorOptions?.linkColor || '#4CAF50', marginX: '10px', fontSize: 'inherit', fontFamily: 'inherit' }}>
                            {emailFooterEditorOptions.privacyLinkText || 'Privacy Policy'}
                        </Link>
                    )}
                    {emailFooterEditorOptions?.termsLinkUrl && (
                        <Link href={emailFooterEditorOptions.termsLinkUrl} sx={{ color: emailFooterEditorOptions?.linkColor || '#4CAF50', marginX: '10px', fontSize: 'inherit', fontFamily: 'inherit' }}>
                            {emailFooterEditorOptions.termsLinkText || 'Terms & Conditions'}
                        </Link>
                    )}
                </Box>
            )}

            {/* Copyright Section */}
            {emailFooterEditorOptions?.showCopyright !== false && (
                <Typography variant="body2" sx={{ fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', opacity: 0.8 }}
                    dangerouslySetInnerHTML={{
                        __html: emailFooterEditorOptions?.copyrightText
                            ? emailFooterEditorOptions.copyrightText
                                .replace('{{year}}', currentYear.toString())
                                .replace('{{current_year}}', currentYear.toString())
                            : `© ${currentYear} ${emailFooterEditorOptions?.storeName || '{{store_name}}'}. All rights reserved.`
                    }}
                />
            )}
        </Box>
    );
};

export default EmailFooterFieldComponent;
