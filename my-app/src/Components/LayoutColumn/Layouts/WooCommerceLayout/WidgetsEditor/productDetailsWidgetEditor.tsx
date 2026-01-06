import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { updateProductDetailsEditorOptions, defaultProductDetailsEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ProductDetailsWidgetEditor = () => {
    const dispatch = useDispatch();
    const selectedBlockId = useSelector((state: RootState) => state.workspace.selectedBlockForEditor);
    const selectedColumnIndex = useSelector((state: RootState) => state.workspace.selectedColumnIndex);
    const selectedWidgetIndex = useSelector((state: RootState) => state.workspace.selectedWidgetIndex);

    const block = useSelector((state: RootState) =>
        state.workspace.blocks.find(b => b.id === selectedBlockId)
    );

    const widget = block?.columns[selectedColumnIndex!]?.widgetContents[selectedWidgetIndex!];

    // Parse options
    const options = React.useMemo(() => {
        if (widget?.contentData) {
            try {
                return { ...defaultProductDetailsEditorOptions, ...JSON.parse(widget.contentData) };
            } catch {
                return defaultProductDetailsEditorOptions;
            }
        }
        return defaultProductDetailsEditorOptions;
    }, [widget]);

    const handleChange = (key: string, value: any) => {
        dispatch(updateProductDetailsEditorOptions({ [key]: value }));
    };

    const handleOptionsUpdate = (updated: any) => {
        dispatch(updateProductDetailsEditorOptions(updated));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Product Details Settings</Typography>

            <FormControlLabel
                control={
                    <Switch
                        checked={options.showImage}
                        onChange={(e) => handleChange('showImage', e.target.checked)}
                    />
                }
                label="Show Product Images"
            />

            <Box sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: '#666' }}>Border Color</Typography>
                <TextField
                    type="color"
                    fullWidth
                    value={options.borderColor}
                    onChange={(e) => handleChange('borderColor', e.target.value)}
                    sx={{ mt: 0.5 }}
                />
            </Box>

            <Box sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: '#666' }}>Header Background</Typography>
                <TextField
                    type="color"
                    fullWidth
                    value={options.headerBackgroundColor}
                    onChange={(e) => handleChange('headerBackgroundColor', e.target.value)}
                    sx={{ mt: 0.5 }}
                />
            </Box>

            <Box sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: '#666' }}>Header Text Color</Typography>
                <TextField
                    type="color"
                    fullWidth
                    value={options.headerTextColor}
                    onChange={(e) => handleChange('headerTextColor', e.target.value)}
                    sx={{ mt: 0.5 }}
                />
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

export default ProductDetailsWidgetEditor;
