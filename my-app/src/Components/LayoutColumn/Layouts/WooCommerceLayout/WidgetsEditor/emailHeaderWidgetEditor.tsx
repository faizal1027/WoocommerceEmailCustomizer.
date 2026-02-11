import React, { useState } from 'react';
import {
    Box, Typography, Slider, Button, IconButton, Stack, Divider, Tooltip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateEmailHeaderEditorOptions, closeEditor, deleteColumnContent } from '../../../../../Store/Slice/workspaceSlice';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const EmailHeaderWidgetEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { emailHeaderEditorOptions, selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector((state: RootState) => state.workspace);
    const [previewUrl, setPreviewUrl] = useState<string | null>(emailHeaderEditorOptions?.logoUrl || null);

    const handleChange = (field: string, value: any) => {
        dispatch(updateEmailHeaderEditorOptions({ [field]: value }));
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                handleChange('logoUrl', result);
                setPreviewUrl(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        handleChange('logoUrl', '');
        setPreviewUrl(null);
    };

    const handleBrowseImage = () => {
        const wp = (window as any).wp;
        if (wp && wp.media) {
            const mediaFrame = wp.media({
                title: 'Select Logo',
                button: {
                    text: 'Insert into Email',
                },
                multiple: false,
            });

            mediaFrame.on('select', () => {
                const attachment = mediaFrame.state().get('selection').first().toJSON();
                const imageUrl = attachment.url;
                handleChange('logoUrl', imageUrl);
                setPreviewUrl(imageUrl);
            });

            mediaFrame.open();
        } else {
            alert('WordPress Media Library is not available.');
        }
    };

    const handleWidthChange = (event: Event, newValue: number | number[]) => {
        handleChange('logoWidth', `${newValue}px`);
    };

    const currentWidth = parseInt(emailHeaderEditorOptions?.logoWidth) || 150;

    return (
        <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
            {/* Editor Header */}
            <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Email Header</Typography>
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
                    Customize your email header logo and layout.
                </Typography>
            </Box>

            {/* Editor Sections */}
            <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
                {/* Logo Section */}
                <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Logo</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
                        <Stack spacing={2.5}>
                            <Box sx={{ border: "1px dashed #e0e0e0", borderRadius: '4px', p: 2, bgcolor: '#fdfdfd', textAlign: 'center' }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>LOGO PREVIEW</Typography>
                                    {(previewUrl || emailHeaderEditorOptions?.logoUrl) && (
                                        <IconButton onClick={handleRemoveImage} size="small" sx={{ p: 0.5 }}>
                                            <DeleteIcon sx={{ fontSize: '16px', color: '#d32f2f' }} />
                                        </IconButton>
                                    )}
                                </Box>
                                <Box sx={{ bgcolor: '#fff', border: '1px solid #eee', p: 1, mb: 2, display: 'flex', justifyContent: 'center', minHeight: '80px', alignItems: 'center' }}>
                                    <Box
                                        component="img"
                                        src={previewUrl || emailHeaderEditorOptions?.logoUrl || 'https://via.placeholder.com/150x50?text=Logo+Preview'}
                                        alt="Logo Preview"
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: 100,
                                            objectFit: "contain",
                                        }}
                                    />
                                </Box>
                                <Stack spacing={1}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon sx={{ fontSize: '18px' }} />}
                                        size="small"
                                        sx={{ textTransform: 'none', fontSize: '12px', border: '1px solid #e0e0e0', color: '#495157', bgcolor: '#fff', '&:hover': { bgcolor: '#f9f9f9' } }}
                                    >
                                        Upload File
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CropOriginalIcon sx={{ fontSize: '18px' }} />}
                                        size="small"
                                        onClick={handleBrowseImage}
                                        sx={{ textTransform: 'none', fontSize: '12px', border: '1px solid #e0e0e0', color: '#495157', bgcolor: '#fff', '&:hover': { bgcolor: '#f9f9f9' } }}
                                    >
                                        Media Library
                                    </Button>
                                </Stack>
                            </Box>

                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>LOGO WIDTH</Typography>
                                <Box sx={{ px: 1 }}>
                                    <Stack spacing={2} direction="row" alignItems="center">
                                        <Slider
                                            value={currentWidth}
                                            onChange={handleWidthChange}
                                            min={50}
                                            max={400}
                                            step={1}
                                            sx={{ flexGrow: 1, color: '#333' }}
                                            size="small"
                                        />
                                        <Typography sx={{ fontSize: '12px', minWidth: '40px', fontWeight: 600, color: '#666' }}>
                                            {currentWidth}px
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {/* Styling Section */}
                <Accordion disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
                        <CommonStylingControls
                            options={emailHeaderEditorOptions}
                            onUpdate={(updatedOptions) => dispatch(updateEmailHeaderEditorOptions(updatedOptions))}
                            showTypography={false}
                            showTextColor={false}
                            textAlignLabel="Alignment"
                            showPadding={true}
                        />
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default EmailHeaderWidgetEditor;
