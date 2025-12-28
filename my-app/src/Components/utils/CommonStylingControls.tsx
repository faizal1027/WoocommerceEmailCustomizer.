import React from 'react';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
} from '@mui/icons-material';
import { FONT_FAMILIES } from '../../Constants/StyleConstants';

interface CommonStylingControlsProps {
    options: any;
    onUpdate: (updatedOptions: any) => void;
    title?: string;
    showTextColor?: boolean;
    showTextAlign?: boolean;
}

const CommonStylingControls: React.FC<CommonStylingControlsProps> = ({
    options,
    onUpdate,
    title = 'Styling',
    showTextColor = true,
    showTextAlign = true,
}) => {
    const handleChange = (field: string, value: any) => {
        onUpdate({ [field]: value });
    };

    return (
        <Box sx={{ mt: 2, mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: '#555' }}>
                {title}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}>
                {/* Font Family */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                        Font Family
                    </Typography>
                    <FormControl size="small" fullWidth>
                        <Select
                            value={options.fontFamily === 'inherit' || !options.fontFamily ? 'inherit' : (FONT_FAMILIES.includes(options.fontFamily.split(',')[0].replace(/'/g, '').trim()) ? options.fontFamily.split(',')[0].replace(/'/g, '').trim() : 'inherit')}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                            MenuProps={{
                                disablePortal: false,
                                sx: { zIndex: 1300001 },
                                style: { zIndex: 1300001 },
                                PaperProps: {
                                    sx: {
                                        maxHeight: 300,
                                    }
                                }
                            }}
                        >
                            {FONT_FAMILIES.map((font) => (
                                <MenuItem key={font} value={font === 'Global' ? 'inherit' : font}>
                                    {font}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Font Size */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                        Font Size
                    </Typography>
                    <TextField
                        type="number"
                        value={parseInt(options.fontSize) || 14}
                        onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
                        size="small"
                        fullWidth
                        placeholder="14"
                        InputProps={{
                            inputProps: { min: 1 }
                        }}
                    />
                </Box>

                {/* Text Color */}
                {showTextColor && (
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                            Text Color
                        </Typography>
                        <input
                            type="color"
                            value={options.textColor || '#333333'}
                            onChange={(e) => handleChange('textColor', e.target.value)}
                            style={{ width: '100%', height: '32px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '0 2px' }}
                        />
                    </Box>
                )}

                {/* Background Color */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                        Background Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <input
                            type="color"
                            value={options.backgroundColor === 'transparent' ? '#ffffff' : options.backgroundColor || '#ffffff'}
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                            style={{ width: '32px', height: '32px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '0 2px' }}
                        />
                        <ToggleButton
                            value="transparent"
                            selected={options.backgroundColor === 'transparent'}
                            onChange={() => handleChange('backgroundColor', options.backgroundColor === 'transparent' ? '#ffffff' : 'transparent')}
                            size="small"
                            sx={{ height: '32px', flexGrow: 1, p: '2px', minWidth: '45px' }}
                        >
                            <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 'bold' }}>NONE</Typography>
                        </ToggleButton>
                    </Box>
                </Box>
            </Box>

            {/* Alignment and Padding */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {showTextAlign && (
                    <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                            Text Alignment
                        </Typography>
                        <ToggleButtonGroup
                            value={options.textAlign || 'left'}
                            exclusive
                            onChange={(_, value) => value && handleChange('textAlign', value)}
                            size="small"
                            fullWidth
                        >
                            <ToggleButton value="left">
                                <FormatAlignLeft fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value="center">
                                <FormatAlignCenter fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value="right">
                                <FormatAlignRight fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value="justify">
                                <FormatAlignJustify fontSize="small" />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                )}
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                        Padding
                    </Typography>
                    <TextField
                        value={options.padding || ''}
                        onChange={(e) => handleChange('padding', e.target.value)}
                        size="small"
                        fullWidth
                        placeholder="10px 20px"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default CommonStylingControls;
