import React from 'react';
import { TextField, MenuItem, Box, Typography } from '@mui/material';

export const SOCIAL_ICONS = [
    // Facebook
    { label: 'Facebook (Color)', value: 'https://img.icons8.com/color/48/facebook-new.png' },
    { label: 'Facebook (Black)', value: 'https://img.icons8.com/ios-filled/50/000000/facebook-new.png' },
    // Twitter (X)
    { label: 'Twitter (Color)', value: 'https://img.icons8.com/color/48/twitter--v1.png' },
    { label: 'Twitter (Black)', value: 'https://img.icons8.com/ios-filled/50/000000/twitterx.png' },
    // Instagram
    { label: 'Instagram (Color)', value: 'https://img.icons8.com/color/48/instagram-new.png' },
    { label: 'Instagram (Black)', value: 'https://img.icons8.com/ios-filled/50/000000/instagram-new.png' },
    // LinkedIn
    { label: 'LinkedIn (Color)', value: 'https://img.icons8.com/color/48/linkedin.png' },
    { label: 'LinkedIn (Black)', value: 'https://img.icons8.com/ios-filled/50/000000/linkedin.png' },
    // YouTube
    { label: 'YouTube (Color)', value: 'https://img.icons8.com/color/48/youtube-play.png' },
    { label: 'YouTube (Black)', value: 'https://img.icons8.com/ios-filled/50/000000/youtube-play.png' },
    // Generic
    { label: 'Website (Color)', value: 'https://img.icons8.com/color/48/domain--v1.png' },
    { label: 'Email (Color)', value: 'https://img.icons8.com/color/48/email.png' },
];

interface SocialIconInsertSelectProps {
    onSelect: (iconHtml: string) => void;
    label?: string;
    size?: 'small' | 'medium';
}

export const SocialIconInsertSelect: React.FC<SocialIconInsertSelectProps> = ({
    onSelect,
    label = "Social Icons",
    size = "small"
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        if (url) {
            // Construct the HTML for the icon (Image wrapped in optional link placeholder makes it easier to select)
            // We'll just insert the image, user can link it.
            const iconHtml = `<img src="${url}" alt="Social Icon" width="24" height="24" style="margin: 0 4px; vertical-align: middle;" />`;
            onSelect(iconHtml);
        }
    };

    return (
        <TextField
            select
            fullWidth
            size={size}
            label={label}
            value=""
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
                displayEmpty: true,
                renderValue: (value: any) => {
                    if (value === "") {
                        return <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Select...</span>;
                    }
                    return "Selected";
                },
                MenuProps: {
                    disablePortal: true,
                    PaperProps: {
                        style: {
                            maxHeight: 300,
                            maxWidth: 240, // Increased width
                            width: 240
                        }
                    },
                    sx: { zIndex: 1300001 }
                }
            }}
        >
            <MenuItem value="" disabled>
                Select Icon...
            </MenuItem>
            {SOCIAL_ICONS.map((icon) => (
                <MenuItem key={icon.value} value={icon.value} sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Box display="flex" alignItems="center" width="100%" gap={1}>
                        <img src={icon.value} alt={icon.label} width="24" height="24" style={{ objectFit: 'contain' }} />
                        <Typography variant="body2">
                            {icon.label}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
        </TextField>
    );
};
