import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Stack, Divider, Accordion, AccordionSummary, AccordionDetails, Tooltip, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../utils/ColorPicker";
import { RootState } from "../../Store/store";
import { updateBodyStyle, closeEditor } from "../../Store/Slice/workspaceSlice";

const GlobalBodyEditor = () => {
    const dispatch = useDispatch();
    const bodyStyle = useSelector((state: RootState) => state.workspace.bodyStyle);

    const handleBgColorChange = (color: string) => {
        dispatch(updateBodyStyle({ ...bodyStyle, backgroundColor: color }));
    };

    const handleCloseEditor = () => {
        dispatch(closeEditor());
    };

    return (
        <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
            {/* Editor Header */}
            <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Global Settings</Typography>
                    <Box display="flex" gap={1}>
                        <Tooltip title="Close">
                            <IconButton onClick={handleCloseEditor} size="small" sx={{ p: 0.5 }}>
                                <CloseIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                <Typography sx={{ fontSize: '13px', color: '#6d7882', fontStyle: 'italic' }}>
                    Configure global email styles.
                </Typography>
            </Box>

            {/* Editor Sections */}
            <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
                {/* Style Section */}
                <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Body Background</Typography>
                                <ColorPicker
                                    label="Background Color"
                                    value={bodyStyle?.backgroundColor || "#f5f7f9"}
                                    onChange={handleBgColorChange}
                                />
                            </Box>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default GlobalBodyEditor;

