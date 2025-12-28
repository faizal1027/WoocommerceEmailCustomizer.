import React from 'react';
import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateCtaButtonEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const CtaButtonWidgetEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { ctaButtonEditorOptions } = useSelector((state: RootState) => state.workspace);

    const handleChange = (field: string, value: any) => {
        dispatch(updateCtaButtonEditorOptions({ [field]: value }));
    };

    const renderLabel = (text: string) => (
        <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
            {text}
        </Typography>
    );

    return (
        <Box sx={{ padding: '20px' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Call-to-Action Button
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Customize your call-to-action button.
                    </Typography>
                </Box>

                <Divider />

                {/* Section: Button Content */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Button Content
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            {renderLabel("Link Preset")}
                            <FormControl fullWidth size="small">
                                <Select
                                    value={''}
                                    displayEmpty
                                    onChange={(e) => {
                                        const val = e.target.value as string;
                                        if (val === 'view_order') {
                                            dispatch(updateCtaButtonEditorOptions({
                                                buttonText: 'View Order',
                                                buttonUrl: '{{order_url}}'
                                            }));
                                        } else if (val === 'track_order') {
                                            dispatch(updateCtaButtonEditorOptions({
                                                buttonText: 'Track Your Order',
                                                buttonUrl: '{{order_tracking_url}}'
                                            }));
                                        } else if (val === 'shop_now') {
                                            dispatch(updateCtaButtonEditorOptions({
                                                buttonText: 'Shop Now',
                                                buttonUrl: '{{shop_url}}'
                                            }));
                                        }
                                    }}
                                    MenuProps={{
                                        disablePortal: false,
                                        sx: { zIndex: 1300001 },
                                        style: { zIndex: 1300001 }
                                    }}
                                >
                                    <MenuItem value="" disabled>Select a Preset</MenuItem>
                                    <MenuItem value="view_order">View Order</MenuItem>
                                    <MenuItem value="track_order">Track Your Order</MenuItem>
                                    <MenuItem value="shop_now">Shop Now</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            {renderLabel("Button Text")}
                            <TextField
                                fullWidth
                                size="small"
                                value={ctaButtonEditorOptions?.buttonText || ''}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                placeholder="e.g. View Order"
                            />
                        </Box>
                        <Box>
                            {renderLabel("Button URL")}
                            <TextField
                                fullWidth
                                size="small"
                                value={ctaButtonEditorOptions?.buttonUrl || ''}
                                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                                placeholder="{{order_url}}"
                            />
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                <CommonStylingControls
                    options={ctaButtonEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateCtaButtonEditorOptions(updatedOptions))}
                />

                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Button Specifics
                    </Typography>
                    <Stack spacing={2}>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            <Box>
                                {renderLabel("Border Radius")}
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={ctaButtonEditorOptions?.borderRadius || '5px'}
                                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                                    placeholder="e.g. 4px"
                                />
                            </Box>
                            <Box>
                                {renderLabel("Hover Background")}
                                <TextField
                                    fullWidth
                                    type="color"
                                    size="small"
                                    value={ctaButtonEditorOptions?.hoverColor || '#45a049'}
                                    onChange={(e) => handleChange('hoverColor', e.target.value)}
                                    sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default CtaButtonWidgetEditor;
