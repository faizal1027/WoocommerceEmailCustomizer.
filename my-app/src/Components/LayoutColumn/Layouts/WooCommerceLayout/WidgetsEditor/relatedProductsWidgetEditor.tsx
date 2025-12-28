import { Box, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel, Stack, Divider, Button, InputAdornment } from '@mui/material';
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateRelatedProductsEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const RelatedProductsWidgetEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { relatedProductsEditorOptions } = useSelector((state: RootState) => state.workspace);

    const handleChange = (field: string, value: any) => {
        dispatch(updateRelatedProductsEditorOptions({ [field]: value }));
    };

    const renderLabel = (text: string) => (
        <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
            {text}
        </Typography>
    );

    const handleBrowseImage = (field: string) => {
        const wp = (window as any).wp;
        if (wp && wp.media) {
            const mediaFrame = wp.media({
                title: 'Select Product Image',
                button: {
                    text: 'Insert into Email',
                },
                multiple: false,
            });

            mediaFrame.on('select', () => {
                const attachment = mediaFrame.state().get('selection').first().toJSON();
                const imageUrl = attachment.url;
                handleChange(field, imageUrl);
            });

            mediaFrame.open();
        } else {
            alert('WordPress Media Library is not available.');
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Related Products
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Customize related products recommendation section.
                    </Typography>
                </Box>

                <Divider />

                {/* Section: General Settings */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        General Settings
                    </Typography>
                    <Stack spacing={2}>
                        <Box>
                            {renderLabel("Section Title")}
                            <TextField
                                fullWidth
                                size="small"
                                value={relatedProductsEditorOptions?.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </Box>
                        <Box>
                            {renderLabel("Button Text")}
                            <TextField
                                fullWidth
                                size="small"
                                value={relatedProductsEditorOptions?.buttonText || 'View Product'}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                            />
                        </Box>
                        <Box>
                            {renderLabel("Number of Products")}
                            <Select
                                fullWidth
                                size="small"
                                value={relatedProductsEditorOptions?.productsToShow || 3}
                                onChange={(e) => handleChange('productsToShow', e.target.value)}
                                MenuProps={{
                                    disablePortal: false,
                                    sx: { zIndex: 1300001 },
                                    style: { zIndex: 1300001 }
                                }}
                            >
                                <MenuItem value={2}>2 Products</MenuItem>
                                <MenuItem value={3}>3 Products</MenuItem>
                                <MenuItem value={4}>4 Products</MenuItem>
                            </Select>
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                {/* Section: Appearance */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Appearance
                    </Typography>
                    <Stack spacing={1}>
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={relatedProductsEditorOptions?.showImages !== false}
                                    onChange={(e) => handleChange('showImages', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Product Images</Typography>}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    checked={relatedProductsEditorOptions?.showCardShadow !== false}
                                    onChange={(e) => handleChange('showCardShadow', e.target.checked)}
                                />
                            }
                            label={<Typography variant="body2">Show Card Shadow</Typography>}
                        />
                    </Stack>
                </Box>

                <Divider />

                <CommonStylingControls
                    options={relatedProductsEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateRelatedProductsEditorOptions(updatedOptions))}
                    showTextColor={false}
                    showTextAlign={false}
                />

                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Product Specific Colors
                    </Typography>
                    <Stack spacing={2}>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            <Box>
                                {renderLabel("Title Color")}
                                <TextField
                                    fullWidth
                                    type="color"
                                    size="small"
                                    value={relatedProductsEditorOptions?.titleColor || '#333'}
                                    onChange={(e) => handleChange('titleColor', e.target.value)}
                                    sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                                />
                            </Box>
                            <Box>
                                {renderLabel("Price Color")}
                                <TextField
                                    fullWidth
                                    type="color"
                                    size="small"
                                    value={relatedProductsEditorOptions?.priceColor || '#4CAF50'}
                                    onChange={(e) => handleChange('priceColor', e.target.value)}
                                    sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                                />
                            </Box>
                        </Box>
                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            <Box>
                                {renderLabel("Button Color")}
                                <TextField
                                    fullWidth
                                    type="color"
                                    size="small"
                                    value={relatedProductsEditorOptions?.buttonColor || '#4CAF50'}
                                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                                    sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                                />
                            </Box>
                            <Box>
                                {renderLabel("Button Hover")}
                                <TextField
                                    fullWidth
                                    type="color"
                                    size="small"
                                    value={relatedProductsEditorOptions?.buttonHoverColor || '#45a049'}
                                    onChange={(e) => handleChange('buttonHoverColor', e.target.value)}
                                    sx={{ '& input': { height: '36px', padding: '0px 8px' } }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </Box>

                <Divider />

                {/* Section: Manual Configuration */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                        Manual Configuration
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                checked={relatedProductsEditorOptions?.useManualData || false}
                                onChange={(e) => handleChange('useManualData', e.target.checked)}
                            />
                        }
                        label={<Typography variant="body2">Use Manual Data</Typography>}
                    />

                    {relatedProductsEditorOptions?.useManualData && (
                        <Stack spacing={4} sx={{ mt: 2 }}>
                            {[1, 2, 3, 4].slice(0, relatedProductsEditorOptions?.productsToShow || 3).map((num) => (
                                <Box key={num} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, bgcolor: '#fcfcfc' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                                        Product {num}
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Box>
                                            {renderLabel("Product Name")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={(relatedProductsEditorOptions as any)[`p${num}_name`] || ''}
                                                onChange={(e) => handleChange(`p${num}_name`, e.target.value)}
                                                placeholder={`Product Name ${num}`}
                                            />
                                        </Box>
                                        <Box>
                                            {renderLabel("Product Price")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={(relatedProductsEditorOptions as any)[`p${num}_price`] || ''}
                                                onChange={(e) => handleChange(`p${num}_price`, e.target.value)}
                                                placeholder={`$99.99`}
                                            />
                                        </Box>
                                        <Box>
                                            {renderLabel("Product URL")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={(relatedProductsEditorOptions as any)[`p${num}_url`] || ''}
                                                onChange={(e) => handleChange(`p${num}_url`, e.target.value)}
                                                placeholder="https://example.com/product"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LinkIcon fontSize="small" color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            {renderLabel("Product Image")}
                                            <TextField
                                                fullWidth
                                                size="small"
                                                value={(relatedProductsEditorOptions as any)[`p${num}_image`] || ''}
                                                onChange={(e) => handleChange(`p${num}_image`, e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                sx={{ mb: 1 }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <ImageIcon fontSize="small" color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<CropOriginalIcon />}
                                                size="small"
                                                onClick={() => handleBrowseImage(`p${num}_image`)}
                                                sx={{ border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
                                            >
                                                Browse Media Library
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default RelatedProductsWidgetEditor;
