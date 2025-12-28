import React from 'react';
import { Box, TextField, Typography, Switch, FormControlLabel, Stack, Divider, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateEmailFooterEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';
import { PlaceholderSelect } from '../../../../utils/PlaceholderSelect';

const EmailFooterWidgetEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { emailFooterEditorOptions } = useSelector((state: RootState) => state.workspace);

    const handleChange = (field: string, value: any) => {
        dispatch(updateEmailFooterEditorOptions({ [field]: value }));
    };

    const handlePlaceholderSelect = (field: string) => (placeholder: string) => {
        const currentValue = (emailFooterEditorOptions as any)[field] || '';
        // If the field is just a placeholder or empty, replace it. Otherwise append.
        if (!currentValue || currentValue.startsWith('{{')) {
            handleChange(field, placeholder);
        } else {
            handleChange(field, currentValue + ' ' + placeholder);
        }
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
                        Email Footer
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Customize your email footer branding and links.
                    </Typography>
                </Box>

                <Divider />

                {/* Section: General */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        General
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            {renderLabel("Store Name")}
                            <TextField
                                fullWidth
                                size="small"
                                value={emailFooterEditorOptions?.storeName || ''}
                                onChange={(e) => handleChange('storeName', e.target.value)}
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <PlaceholderSelect onSelect={handlePlaceholderSelect('storeName')} label="Insert Store Name Var" />
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                {/* Section: Visibility */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Visibility
                    </Typography>
                    <Stack spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={emailFooterEditorOptions?.showSocialMedia !== false}
                                    onChange={(e) => handleChange('showSocialMedia', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Social Media Icons</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={emailFooterEditorOptions?.showAddress !== false}
                                    onChange={(e) => handleChange('showAddress', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Store Address</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={emailFooterEditorOptions?.showContact !== false}
                                    onChange={(e) => handleChange('showContact', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Contact Info</Typography>}
                        />
                    </Stack>
                </Box>

                <Divider />

                {/* Section: Content Details */}
                {(emailFooterEditorOptions?.showAddress !== false || emailFooterEditorOptions?.showContact !== false) && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Content Details
                        </Typography>
                        <Stack spacing={3}>
                            {emailFooterEditorOptions?.showAddress !== false && (
                                <Box>
                                    {renderLabel("Store Address")}
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={emailFooterEditorOptions?.storeAddress || ''}
                                        onChange={(e) => handleChange('storeAddress', e.target.value)}
                                        multiline
                                        rows={2}
                                        sx={{ mb: 1 }}
                                    />
                                    <PlaceholderSelect onSelect={handlePlaceholderSelect('storeAddress')} label="Insert Address Var" />
                                </Box>
                            )}
                            {emailFooterEditorOptions?.showContact !== false && (
                                <>
                                    <Box>
                                        {renderLabel("Contact Email")}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={emailFooterEditorOptions?.contactEmail || ''}
                                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                                            sx={{ mb: 1 }}
                                        />
                                        <PlaceholderSelect onSelect={handlePlaceholderSelect('contactEmail')} label="Insert Email Var" />
                                    </Box>
                                    <Box>
                                        {renderLabel("Contact Phone")}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={emailFooterEditorOptions?.contactPhone || ''}
                                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                                            sx={{ mb: 1 }}
                                        />
                                        <PlaceholderSelect onSelect={handlePlaceholderSelect('contactPhone')} label="Insert Phone Var" />
                                    </Box>
                                </>
                            )}
                        </Stack>
                    </Box>
                )}

                {(emailFooterEditorOptions?.showAddress !== false || emailFooterEditorOptions?.showContact !== false) && <Divider />}

                <CommonStylingControls
                    options={emailFooterEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateEmailFooterEditorOptions(updatedOptions))}
                />

                <Box>
                    {renderLabel("Link Color")}
                    <TextField
                        fullWidth
                        type="color"
                        size="small"
                        value={emailFooterEditorOptions?.linkColor || '#4CAF50'}
                        onChange={(e) => handleChange('linkColor', e.target.value)}
                        sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default EmailFooterWidgetEditor;
