import React, { useState } from 'react';
import {
    Box, TextField, Typography, Switch, FormControlLabel, Slider, Button, IconButton, Stack, Divider, InputLabel, Tooltip
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
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

    const renderLabel = (text: string) => (
        <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
            {text}
        </Typography>
    );

    return (
        <Box sx={{ padding: '20px' }}>
            <Stack spacing={3}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }}
                >
                    <Box>
                        <Typography variant="h6">
                            Email Header
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Customize your email header branding and layout.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Close">
                            <IconButton onClick={handleCloseEditor} size="small" sx={{ bgcolor: '#eee' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton onClick={handleDeleteContent} size="small" sx={{ bgcolor: '#eee' }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>


                <Divider />

                {/* Section: Branding */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Branding
                    </Typography>
                    <Stack spacing={2}>
                        <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2, bgcolor: '#fafafa' }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="caption" fontWeight="bold">
                                    Logo Upload
                                </Typography>
                                {(previewUrl || emailHeaderEditorOptions?.logoUrl) && (
                                    <IconButton onClick={handleRemoveImage} size="small">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Box sx={{ textAlign: "center", mb: 2 }}>
                                <Box
                                    component="img"
                                    src={previewUrl || emailHeaderEditorOptions?.logoUrl || 'https://via.placeholder.com/150x50?text=Logo+Preview'}
                                    alt="Logo Preview"
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: 100,
                                        border: "1px solid #eee",
                                        borderRadius: 1,
                                        objectFit: "contain",
                                        bgcolor: 'white'
                                    }}
                                />
                            </Box>
                            <Button
                                component="label"
                                variant="outlined"
                                fullWidth
                                startIcon={<CloudUploadIcon />}
                                size="small"
                                sx={{ mb: 1, border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
                            >
                                Choose Logo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<CropOriginalIcon />}
                                size="small"
                                onClick={handleBrowseImage}
                                sx={{ border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
                            >
                                Browse Media Library
                            </Button>

                            <Box sx={{ mt: 2 }}>
                                {renderLabel("Logo Width")}
                                <Stack spacing={2} direction="row" alignItems="center">
                                    <Slider
                                        value={currentWidth}
                                        onChange={handleWidthChange}
                                        min={50}
                                        max={400}
                                        step={10}
                                        sx={{ flexGrow: 1 }}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value}px`}
                                        size="small"
                                    />
                                    <Typography variant="body2" sx={{ minWidth: 40, textAlign: "right", fontSize: '12px' }}>
                                        {currentWidth}px
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                <CommonStylingControls
                    options={emailHeaderEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateEmailHeaderEditorOptions(updatedOptions))}
                    title="Appearance & Styling"
                    showTypography={false}
                    showTextColor={false}
                    textAlignLabel="Icon Alignment"
                />
            </Stack>
        </Box>
    );
};

export default EmailHeaderWidgetEditor;
