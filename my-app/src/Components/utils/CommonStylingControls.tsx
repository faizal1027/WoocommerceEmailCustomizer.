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
    showTypography?: boolean;
    textAlignLabel?: string;
    showLabelAlign?: boolean;
    showValueAlign?: boolean;
    showPadding?: boolean;
    showFontWeight?: boolean;
    showLineHeight?: boolean;
}

const CommonStylingControls: React.FC<CommonStylingControlsProps> = ({
    options,
    onUpdate,
    title = 'Styling',
    showTextColor = true,
    showTextAlign = true,
    showTypography = true,
    textAlignLabel = 'Text Alignment',
    showLabelAlign = false,
    showValueAlign = false,
    showPadding = true,
    showFontWeight = false,
    showLineHeight = false,
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
                {showTypography && (
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
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
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
                )}

                {/* Font Size */}
                {showTypography && (
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
                )}

                {/* Font Weight */}
                {showTypography && showFontWeight && (
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                            Font Weight
                        </Typography>
                        <FormControl size="small" fullWidth>
                            <Select
                                value={options.fontWeight || '400'}
                                onChange={(e) => handleChange('fontWeight', e.target.value)}
                                style={{ fontSize: '14px' }}
                                MenuProps={{
                                    disablePortal: false,
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                    sx: { zIndex: 1300001 },
                                    style: { zIndex: 1300001 }
                                }}
                            >
                                {['100', '200', '300', '400', '500', '600', '700', '800', '900'].map((weight) => (
                                    <MenuItem key={weight} value={weight} style={{ fontSize: '14px' }}>
                                        {weight}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Line Height */}
                {showTypography && showLineHeight && (
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                            Line height (px)
                        </Typography>
                        <TextField
                            type="number"
                            value={options.lineHeight || ''}
                            onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
                            size="small"
                            fullWidth
                            placeholder="24"
                            inputProps={{ step: 1, min: 0 }}
                        />
                    </Box>
                )}

                {/* Text Color */}
                {showTextColor && (
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '0.7rem' }}>
                            Text Color
                        </Typography>
                        <input
                            type="color"
                            value={(options.textColor && options.textColor !== 'transparent') ? options.textColor : '#333333'}
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
                            value={options.backgroundColor === 'transparent' ? '#ffffff' : (options.backgroundColor || '#ffffff')}
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
                            {textAlignLabel}
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

                {(showLabelAlign || showValueAlign) && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        {showLabelAlign && (
                            <Box>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                                    Label Align
                                </Typography>
                                <ToggleButtonGroup
                                    value={options.labelAlign || 'left'}
                                    exclusive
                                    onChange={(_, value) => value && handleChange('labelAlign', value)}
                                    size="small"
                                    fullWidth
                                >
                                    <ToggleButton value="left" sx={{ p: 0.5 }}>
                                        <FormatAlignLeft fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="center" sx={{ p: 0.5 }}>
                                        <FormatAlignCenter fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="right" sx={{ p: 0.5 }}>
                                        <FormatAlignRight fontSize="small" />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        )}
                        {showValueAlign && (
                            <Box>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                                    Value Align
                                </Typography>
                                <ToggleButtonGroup
                                    value={options.valueAlign || 'right'}
                                    exclusive
                                    onChange={(_, value) => value && handleChange('valueAlign', value)}
                                    size="small"
                                    fullWidth
                                >
                                    <ToggleButton value="left" sx={{ p: 0.5 }}>
                                        <FormatAlignLeft fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="center" sx={{ p: 0.5 }}>
                                        <FormatAlignCenter fontSize="small" />
                                    </ToggleButton>
                                    <ToggleButton value="right" sx={{ p: 0.5 }}>
                                        <FormatAlignRight fontSize="small" />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        )}
                    </Box>
                )}

                {showPadding && (
                    <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                            Padding (px)
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                                let pTop = '0';
                                let pRight = '0';
                                let pBottom = '0';
                                let pLeft = '0';

                                if (options.padding && typeof options.padding === 'object') {
                                    pTop = String(options.padding.top || 0);
                                    pRight = String(options.padding.right || 0);
                                    pBottom = String(options.padding.bottom || 0);
                                    pLeft = String(options.padding.left || 0);
                                } else {
                                    const paddingValues = (options.padding || '0px 0px 0px 0px').replace(/px/g, '').split(' ');
                                    pTop = paddingValues[0] || '0';
                                    pRight = paddingValues[1] || pTop;
                                    pBottom = paddingValues[2] || pTop;
                                    pLeft = paddingValues[3] || pRight;
                                }

                                const currentValues = { Top: pTop, Right: pRight, Bottom: pBottom, Left: pLeft };

                                return (
                                    <Box key={side} sx={{ minWidth: 0 }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontSize: '13px' }}>
                                            {side}
                                        </Typography>
                                        <TextField
                                            type="number"
                                            size="small"
                                            fullWidth
                                            value={parseInt((currentValues as any)[side])}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                const newValues = { ...currentValues, [side]: newVal };
                                                const newPadding = `${newValues.Top}px ${newValues.Right}px ${newValues.Bottom}px ${newValues.Left}px`;
                                                handleChange('padding', newPadding);
                                            }}
                                            inputProps={{ style: { fontSize: '14px' }, min: 0 }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CommonStylingControls;
