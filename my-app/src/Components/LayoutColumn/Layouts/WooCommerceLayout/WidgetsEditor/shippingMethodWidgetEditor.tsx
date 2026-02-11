import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem, ToggleButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateShippingMethodEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ShippingMethodWidgetEditor = () => {
    const dispatch = useDispatch();
    const { shippingMethodEditorOptions } = useSelector((state: RootState) => state.workspace);
    const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
        (state: RootState) => state.workspace
    );

    const handleChange = (field: keyof typeof shippingMethodEditorOptions) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(updateShippingMethodEditorOptions({ [field]: e.target.value }));
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
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Shipping Method</Typography>
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
                    Customize shipping method display.
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
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Label</Typography>
                                <TextField value={shippingMethodEditorOptions.label} onChange={handleChange('label')} size="small" fullWidth placeholder="Shipping Method" InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }} />
                            </Box>
                            <Divider />
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Last column width (%)</Typography>
                                <TextField
                                    type="number"
                                    value={shippingMethodEditorOptions?.lastColumnWidth || 30}
                                    onChange={handleChange('lastColumnWidth' as any)}
                                    size="small"
                                    sx={{ width: '80px' }}
                                    InputProps={{ inputProps: { min: 10, max: 90 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
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
                            <CommonStylingControls
                                options={shippingMethodEditorOptions}
                                onUpdate={(updatedOptions) => dispatch(updateShippingMethodEditorOptions(updatedOptions))}
                                showLabelAlign={true}
                                showValueAlign={true}
                                showTextAlign={false}
                                showFontWeight={true}
                                showLineHeight={true}
                            />

                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Border</Typography>
                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} alignItems="end">
                                    <Box>
                                        <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>Border width</Typography>
                                        <TextField
                                            type="number"
                                            value={shippingMethodEditorOptions?.borderWidth || 0}
                                            onChange={handleChange('borderWidth' as any)}
                                            size="small"
                                            fullWidth
                                            InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>
                                            Border color
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1} height="35px">
                                            <input
                                                type="color"
                                                value={shippingMethodEditorOptions?.borderColor === 'transparent' ? '#eeeeee' : (shippingMethodEditorOptions?.borderColor || '#eeeeee')}
                                                onChange={(e) => dispatch(updateShippingMethodEditorOptions({ borderColor: e.target.value }))}
                                                style={{
                                                    width: '40px',
                                                    height: '100%',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    padding: '0 2px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                            <ToggleButton
                                                value="transparent"
                                                selected={shippingMethodEditorOptions?.borderColor === 'transparent'}
                                                onChange={() => {
                                                    const newColor = shippingMethodEditorOptions?.borderColor === 'transparent' ? '#eeeeee' : 'transparent';
                                                    dispatch(updateShippingMethodEditorOptions({ borderColor: newColor }));
                                                }}
                                                size="small"
                                                sx={{ height: '100%', flexGrow: 1, minWidth: '45px', border: '1px solid #ddd', fontSize: '9px' }}
                                            >
                                                NONE
                                            </ToggleButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default ShippingMethodWidgetEditor;
