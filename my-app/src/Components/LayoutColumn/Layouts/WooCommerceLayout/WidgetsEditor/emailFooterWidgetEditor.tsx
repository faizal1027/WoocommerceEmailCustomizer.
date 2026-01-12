import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Typography, Switch, FormControlLabel, Stack, Divider, InputLabel, IconButton, Tooltip, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateEmailFooterEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';
import { PlaceholderSelect } from '../../../../utils/PlaceholderSelect';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import DeleteIcon from "@mui/icons-material/Delete";

const socialIconsMap: any = {
    facebook: { icon: <FacebookIcon />, fallback: "f", color: "#3b5998" },
    twitter: { icon: <TwitterIcon />, fallback: "x", color: "#1DA1F2" },
    linkedin: { icon: <LinkedInIcon />, fallback: "l", color: "#0077B5" },
    instagram: { icon: <InstagramIcon />, fallback: "i", color: "#E1306C" },
    pinterest: { icon: <PinterestIcon />, fallback: "p", color: "#Bd081C" },
    youtube: { icon: <YouTubeIcon />, fallback: "y", color: "#FF0000" },
    whatsapp: { icon: <WhatsAppIcon />, fallback: "w", color: "#25D366" },
    reddit: { icon: <RedditIcon />, fallback: "r", color: "#FF4500" },
    github: { icon: <GitHubIcon />, fallback: "g", color: "#181717" },
    telegram: { icon: <TelegramIcon />, fallback: "t", color: "#0088CC" },
    envelope: { icon: <MailIcon />, fallback: "e", color: "#0072C6" },
};

const EmailFooterWidgetEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { emailFooterEditorOptions } = useSelector((state: RootState) => state.workspace);

    const handleChange = (field: string, value: any) => {
        dispatch(updateEmailFooterEditorOptions({ [field]: value }));
    };

    const addedIcons = emailFooterEditorOptions?.socialIcons || { icons: [], urls: [] };

    const handleAddIcon = (key: string) => {
        if (!addedIcons.icons.includes(key)) {
            const newIcons = [...addedIcons.icons, key];
            const newUrls = [...addedIcons.urls, `https://${key}.com`];
            handleChange('socialIcons', { icons: newIcons, urls: newUrls });
        }
    };

    const handleDeleteIcon = (key: string) => {
        const index = addedIcons.icons.indexOf(key);
        if (index > -1) {
            const newIcons = addedIcons.icons.filter((_, i) => i !== index);
            const newUrls = addedIcons.urls.filter((_, i) => i !== index);
            handleChange('socialIcons', { icons: newIcons, urls: newUrls });
        }
    };

    const handleUrlChange = (key: string, value: string) => {
        const index = addedIcons.icons.indexOf(key);
        if (index > -1) {
            const newUrls = [...addedIcons.urls];
            newUrls[index] = value;
            handleChange('socialIcons', { icons: addedIcons.icons, urls: newUrls });
        }
    };

    // CKEditor Logic
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const editorInstanceRef = useRef<any>(null); // Use ref for cleanup access
    const editorRef = useRef<HTMLDivElement>(null);
    const isInitializingRef = useRef(false);

    // Initial value ref to prevent loop
    const copyrightText = emailFooterEditorOptions?.copyrightText || '';
    const copyrightRef = useRef(copyrightText);

    useEffect(() => {
        copyrightRef.current = copyrightText;
    }, [copyrightText]);

    useEffect(() => {
        // Don't initialize if hidden to avoid 0-height rendering issues
        if (emailFooterEditorOptions?.showCopyright === false) {
            return;
        }

        let intervalId: NodeJS.Timer;

        const initEditor = () => {
            const GlobalClassicEditor = (window as any).ClassicEditor;
            if (!GlobalClassicEditor || !editorRef.current || isInitializingRef.current || editorInstanceRef.current) {
                return;
            }

            isInitializingRef.current = true;

            GlobalClassicEditor.create(editorRef.current, {
                toolbar: {
                    items: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
                    shouldNotGroupWhenFull: false
                }
            })
                .then((editor: any) => {
                    editorInstanceRef.current = editor;
                    setEditorInstance(editor);
                    editor.setData(copyrightRef.current || "");

                    editor.model.document.on('change:data', () => {
                        const data = editor.getData();
                        handleChange('copyrightText', data);
                    });
                })
                .catch((error: any) => {
                    console.error("CKEditor CDN Initialization Failed:", error);
                })
                .finally(() => {
                    isInitializingRef.current = false;
                });
        };

        initEditor();

        if (!(window as any).ClassicEditor) {
            intervalId = setInterval(() => {
                if ((window as any).ClassicEditor) {
                    initEditor();
                    clearInterval(intervalId);
                }
            }, 500);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy().catch((err: any) => console.error("Editor destroy error", err));
                editorInstanceRef.current = null;
                setEditorInstance(null);
            }
        };
    }, [emailFooterEditorOptions?.showCopyright]); // Re-run when visibility changes

    // Update editor content if redux state changes externally (e.g. undo/redo)
    useEffect(() => {
        if (editorInstance && editorInstance.getData() !== copyrightText) {
            editorInstance.setData(copyrightText);
        }
    }, [copyrightText, editorInstance]);


    const handlePlaceholderSelect = (field: string) => (placeholder: string) => {
        if (field === 'copyrightText' && editorInstance) {
            editorInstance.model.change((writer: any) => {
                const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                writer.insertText(placeholder, insertPosition);
            });
            return;
        }

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
                        {emailFooterEditorOptions?.showSocialMedia !== false && (
                            <Box sx={{ ml: 1, pl: 2, borderLeft: '2px solid #eee', mt: 1, mb: 2 }}>
                                {/* Active Icons */}
                                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>Active Icons</Typography>
                                <Stack spacing={1} sx={{ mb: 2 }}>
                                    {addedIcons.icons.map((key, index) => (
                                        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
                                            {socialIconsMap[key]?.icon ? React.cloneElement(socialIconsMap[key].icon, { sx: { width: 20, height: 20, color: socialIconsMap[key].color } }) : null}
                                            <TextField
                                                size="small"
                                                fullWidth
                                                variant="standard"
                                                value={addedIcons.urls[index]}
                                                onChange={(e) => handleUrlChange(key, e.target.value)}
                                                InputProps={{ disableUnderline: true, style: { fontSize: '12px' } }}
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <IconButton size="small" onClick={() => handleDeleteIcon(key)}>
                                                <DeleteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    {addedIcons.icons.length === 0 && <Typography variant="caption" color="text.secondary">No icons added.</Typography>}
                                </Stack>

                                {/* Add Icons */}
                                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>Add Icons</Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {Object.keys(socialIconsMap)
                                        .filter((key) => !addedIcons.icons.includes(key))
                                        .map((key) => (
                                            <Tooltip title={`Add ${key}`} key={key}>
                                                <Box
                                                    onClick={() => handleAddIcon(key)}
                                                    sx={{
                                                        width: 28, height: 28,
                                                        borderRadius: "50%",
                                                        border: '1px solid #ddd',
                                                        display: "flex", justifyContent: "center", alignItems: "center",
                                                        cursor: "pointer",
                                                        "&:hover": { bgcolor: '#f0f0f0' }
                                                    }}
                                                >
                                                    {React.cloneElement(socialIconsMap[key].icon, { sx: { width: 16, height: 16, color: socialIconsMap[key].color } })}
                                                </Box>
                                            </Tooltip>
                                        ))}
                                </Box>
                            </Box>
                        )}
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
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={emailFooterEditorOptions?.showLegal !== false}
                                    onChange={(e) => handleChange('showLegal', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Legal Section</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={emailFooterEditorOptions?.showCopyright !== false}
                                    onChange={(e) => handleChange('showCopyright', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Copyright Text</Typography>}
                        />
                    </Stack>
                </Box>

                <Divider />

                {/* Section: Content Details */}
                {(emailFooterEditorOptions?.showAddress !== false || emailFooterEditorOptions?.showContact !== false || emailFooterEditorOptions?.showLegal !== false || emailFooterEditorOptions?.showCopyright !== false) && (
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Content Details
                        </Typography>
                        <Stack spacing={3}>
                            {emailFooterEditorOptions?.showAddress !== false && (
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Store Address</Typography>
                                    <Box>
                                        {renderLabel("Address Text")}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={emailFooterEditorOptions?.storeAddress || ''}
                                            onChange={(e) => handleChange('storeAddress', e.target.value)}
                                            multiline
                                            rows={2}
                                            InputProps={{ style: { fontSize: '12px' } }}
                                            sx={{ mb: 2 }}
                                        />
                                        <PlaceholderSelect onSelect={handlePlaceholderSelect('storeAddress')} />
                                    </Box>
                                </Paper>
                            )}

                            {emailFooterEditorOptions?.showContact !== false && (
                                <>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Contact Email</Typography>
                                        <Box sx={{ mb: 2 }}>
                                            {renderLabel("Label")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={emailFooterEditorOptions?.emailLabel || ''}
                                                onChange={(e) => handleChange('emailLabel', e.target.value)}
                                                placeholder="e.g. Email:"
                                                InputProps={{ style: { fontSize: '12px' } }}
                                            />
                                        </Box>
                                        <Box>
                                            {renderLabel("Value")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={emailFooterEditorOptions?.contactEmail || ''}
                                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                                InputProps={{ style: { fontSize: '12px' } }}
                                                sx={{ mb: 2 }}
                                            />
                                            <PlaceholderSelect onSelect={handlePlaceholderSelect('contactEmail')} />
                                        </Box>
                                    </Paper>

                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Contact Phone</Typography>
                                        <Box sx={{ mb: 2 }}>
                                            {renderLabel("Label")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={emailFooterEditorOptions?.phoneLabel || ''}
                                                onChange={(e) => handleChange('phoneLabel', e.target.value)}
                                                placeholder="e.g. Phone:"
                                                InputProps={{ style: { fontSize: '12px' } }}
                                            />
                                        </Box>
                                        <Box>
                                            {renderLabel("Value")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={emailFooterEditorOptions?.contactPhone || ''}
                                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                                                InputProps={{ style: { fontSize: '12px' } }}
                                                sx={{ mb: 2 }}
                                            />
                                            <PlaceholderSelect onSelect={handlePlaceholderSelect('contactPhone')} />
                                        </Box>
                                    </Paper>
                                </>
                            )}

                            {emailFooterEditorOptions?.showLegal !== false && (
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Legal Links</Typography>
                                    <Stack spacing={2}>
                                        <Box>
                                            {renderLabel("Privacy Policy")}
                                            <Stack spacing={1}>
                                                <Box>
                                                    {renderLabel("Label")}
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={emailFooterEditorOptions?.privacyLinkText || ''}
                                                        onChange={(e) => handleChange('privacyLinkText', e.target.value)}
                                                        InputProps={{ style: { fontSize: '12px' } }}
                                                    />
                                                </Box>
                                                <Box>
                                                    {renderLabel("URL")}
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={emailFooterEditorOptions?.privacyLinkUrl || ''}
                                                        onChange={(e) => handleChange('privacyLinkUrl', e.target.value)}
                                                        InputProps={{ style: { fontSize: '12px' } }}
                                                    />
                                                </Box>
                                            </Stack>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            {renderLabel("Terms & Conditions")}
                                            <Stack spacing={1}>
                                                <Box>
                                                    {renderLabel("Label")}
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={emailFooterEditorOptions?.termsLinkText || ''}
                                                        onChange={(e) => handleChange('termsLinkText', e.target.value)}
                                                        InputProps={{ style: { fontSize: '12px' } }}
                                                    />
                                                </Box>
                                                <Box>
                                                    {renderLabel("URL")}
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={emailFooterEditorOptions?.termsLinkUrl || ''}
                                                        onChange={(e) => handleChange('termsLinkUrl', e.target.value)}
                                                        InputProps={{ style: { fontSize: '12px' } }}
                                                    />
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Paper>
                            )}

                            <Box sx={{ display: emailFooterEditorOptions?.showCopyright !== false ? 'block' : 'none' }}>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Copyright</Typography>
                                    <Box>
                                        {renderLabel("Copyright Text")}
                                        <Box sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            mt: 1,
                                            mb: 2,
                                            bgcolor: '#fff',
                                            '& .ck-editor__editable': {
                                                minHeight: '150px',
                                                padding: '10px'
                                            }
                                        }}>
                                            <div ref={editorRef} />
                                        </Box>
                                        <PlaceholderSelect onSelect={handlePlaceholderSelect('copyrightText')} />
                                    </Box>
                                </Paper>
                            </Box>
                        </Stack>
                    </Box>
                )}

                <Divider />

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
                        value={emailFooterEditorOptions?.linkColor === 'transparent' ? '#4CAF50' : (emailFooterEditorOptions?.linkColor || '#4CAF50')}
                        onChange={(e) => handleChange('linkColor', e.target.value)}
                        sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default EmailFooterWidgetEditor;
