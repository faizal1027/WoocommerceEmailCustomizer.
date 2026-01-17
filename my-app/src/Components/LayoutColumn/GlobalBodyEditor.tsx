import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import ColorPicker from "../utils/ColorPicker";
import { RootState } from "../../Store/store";
import { updateBodyStyle } from "../../Store/Slice/workspaceSlice";

const GlobalBodyEditor = () => {
    const dispatch = useDispatch();
    const bodyStyle = useSelector((state: RootState) => state.workspace.bodyStyle);

    const handleBgColorChange = (color: string) => {
        dispatch(updateBodyStyle({ ...bodyStyle, backgroundColor: color }));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Global Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                    Body Background
                </Typography>
                <ColorPicker
                    label="Background Color"
                    value={bodyStyle?.backgroundColor || "#f5f7f9"}
                    onChange={handleBgColorChange}
                />
            </Box>
        </Box>
    );
};

export default GlobalBodyEditor;
