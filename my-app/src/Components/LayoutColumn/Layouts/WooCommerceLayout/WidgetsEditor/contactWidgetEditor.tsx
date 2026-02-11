import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, Stack, Divider } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateContactEditorOptions, defaultContactEditorOptions, closeEditor, deleteColumnContent } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ContactWidgetEditor = () => {
    const dispatch = useDispatch();
    const {
        selectedBlockForEditor,
        selectedColumnIndex,
        selectedWidgetIndex,
        contactEditorOptions: options
    } = useSelector((state: RootState) => state.workspace);

    const handleChange = (key: string, value: any) => {
        dispatch(updateContactEditorOptions({ [key]: value }));
    };

    const handleOptionsUpdate = (updated: any) => {
        dispatch(updateContactEditorOptions(updated));
    };

    const handleCloseEditor = () => {
        dispatch(closeEditor());
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

    return (
        <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
            {/* Editor Header */}
            <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Contact Info</Typography>
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
                    Customize contact information and style.
                </Typography>
            </Box>

            {/* Editor Sections */}
            <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
                {/* Content Section */}
                <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Content</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Website URL</Typography>
                                <TextField
                                    fullWidth
                                    value={options.url}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                    size="small"
                                    placeholder="{{site_url}}"
                                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                                />
                                <FormControlLabel
                                    control={<Switch size="small" checked={options.showUrl} onChange={(e) => handleChange('showUrl', e.target.checked)} />}
                                    label={<Typography sx={{ fontSize: '11px', color: '#495157' }}>Show URL</Typography>}
                                    sx={{ mt: 1, ml: 0 }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Shop Email</Typography>
                                <TextField
                                    fullWidth
                                    value={options.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    size="small"
                                    placeholder="{{store_email}}"
                                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                                />
                                <FormControlLabel
                                    control={<Switch size="small" checked={options.showEmail} onChange={(e) => handleChange('showEmail', e.target.checked)} />}
                                    label={<Typography sx={{ fontSize: '11px', color: '#495157' }}>Show Shop Email</Typography>}
                                    sx={{ mt: 1, ml: 0 }}
                                />
                            </Box>

                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Shop Phone</Typography>
                                <TextField
                                    fullWidth
                                    value={options.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    size="small"
                                    placeholder="{{store_phone}}"
                                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                                />
                                <FormControlLabel
                                    control={<Switch size="small" checked={options.showPhone} onChange={(e) => handleChange('showPhone', e.target.checked)} />}
                                    label={<Typography sx={{ fontSize: '11px', color: '#495157' }}>Show Phone</Typography>}
                                    sx={{ mt: 1, ml: 0 }}
                                />
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
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Icon Color</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        type="color"
                                        value={options.iconColor}
                                        onChange={(e) => handleChange('iconColor', e.target.value)}
                                        sx={{
                                            width: '100%',
                                            '& .MuiInputBase-input': { padding: 0, height: '35px', cursor: 'pointer', border: 'none', bgcolor: 'transparent' },
                                            '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #ddd' }
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
                                showFontWeight={true}
                                showLineHeight={true}
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default ContactWidgetEditor;
