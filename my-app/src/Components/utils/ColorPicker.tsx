import React, { useState } from 'react';
import { Box, Typography, Popover } from '@mui/material';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, display: 'block', mb: 0.8, color: '#555' }}>
                {label}
            </Typography>
            <Box position="relative">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: '4px 8px',
                        height: '40px',
                        cursor: 'pointer'
                    }}
                    onClick={handleClick}
                >
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: value === 'transparent' ? 'transparent' : value,
                            borderRadius: 0.5,
                            border: "1px solid #ccc"
                        }}
                    />
                    <Typography sx={{ ml: 1, color: '#666', fontSize: '11px' }}>
                        {value}
                    </Typography>
                </Box>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    disablePortal={true}
                    sx={{ zIndex: 9999999 }}
                >
                    <ChromePicker
                        color={value === 'transparent' ? '#ffffff' : (value || '#ffffff')}
                        onChange={(newColor) => onChange(newColor.hex)}
                    />
                </Popover>
            </Box>
        </Box>
    );
};

export default ColorPicker;
