import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateContactEditorOptions, defaultContactEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ContactWidgetEditor = () => {
    const dispatch = useDispatch();
    const selectedBlockId = useSelector((state: RootState) => state.workspace.selectedBlockForEditor);
    const selectedColumnIndex = useSelector((state: RootState) => state.workspace.selectedColumnIndex);
    const selectedWidgetIndex = useSelector((state: RootState) => state.workspace.selectedWidgetIndex);

    const block = useSelector((state: RootState) =>
        state.workspace.blocks.find(b => b.id === selectedBlockId)
    );

    const widget = block?.columns[selectedColumnIndex!]?.widgetContents[selectedWidgetIndex!];

    const options = React.useMemo(() => {
        if (widget?.contentData) {
            try {
                return { ...defaultContactEditorOptions, ...JSON.parse(widget.contentData) };
            } catch {
                return defaultContactEditorOptions;
            }
        }
        return defaultContactEditorOptions;
    }, [widget]);

    const handleChange = (key: string, value: any) => {
        dispatch(updateContactEditorOptions({ [key]: value }));
    };

    const handleOptionsUpdate = (updated: any) => {
        dispatch(updateContactEditorOptions(updated));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Contact Info</Typography>


            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#666', mb: 0.5, display: 'block' }}>URL</Typography>
                <TextField
                    fullWidth
                    value={options.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    size="small"
                    placeholder="{{site_url}}"
                />
            </Box>
            <FormControlLabel
                control={<Switch checked={options.showUrl} onChange={(e) => handleChange('showUrl', e.target.checked)} />}
                label="Show URL"
                sx={{ mb: 2, display: 'block' }}
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#666', mb: 0.5, display: 'block' }}>Shop Email</Typography>
                <TextField
                    fullWidth
                    value={options.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    size="small"
                    placeholder="{{store_email}}"
                />
            </Box>
            <FormControlLabel
                control={<Switch checked={options.showEmail} onChange={(e) => handleChange('showEmail', e.target.checked)} />}
                label="Show Shop Email"
                sx={{ mb: 2, display: 'block' }}
            />

            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#666', mb: 0.5, display: 'block' }}>Shop Number</Typography>
                <TextField
                    fullWidth
                    value={options.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    size="small"
                    placeholder="{{store_phone}}"
                />
            </Box>
            <FormControlLabel
                control={<Switch checked={options.showPhone} onChange={(e) => handleChange('showPhone', e.target.checked)} />}
                label="Show Shop Number"
                sx={{ mb: 2, display: 'block' }}
            />

            <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#666', mb: 0.5, display: 'block' }}>Icon Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        type="color"
                        value={options.iconColor}
                        onChange={(e) => handleChange('iconColor', e.target.value)}
                        sx={{
                            width: '100%',
                            '& .MuiInputBase-input': { padding: 0, height: '40px', cursor: 'pointer' }
                        }}
                    />
                </Box>
            </Box>

            <CommonStylingControls
                options={options}
                onUpdate={handleOptionsUpdate}
                showTextColor={true}
                showTextAlign={true}
                showTypography={true}
                showPadding={true}
            />
        </Box>
    );
};

export default ContactWidgetEditor;
