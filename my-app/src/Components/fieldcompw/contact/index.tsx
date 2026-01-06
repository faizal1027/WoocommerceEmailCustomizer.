import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { defaultContactEditorOptions } from '../../../Store/Slice/workspaceSlice';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

interface ContactFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
    widgetData?: any;
}

const ContactFieldComponent: React.FC<ContactFieldComponentProps> = ({
    blockId,
    columnIndex,
    isSelected,
    onClick,
    onWidgetClick,
    widgetIndex,
    previewMode = true,
    widgetData
}) => {
    const dispatch = useDispatch();
    const block = useSelector((state: RootState) => state.workspace.blocks.find(b => b.id === blockId));
    const column = block?.columns[columnIndex];

    const options = React.useMemo(() => {
        if (widgetData && widgetData.contentData) {
            try {
                return { ...defaultContactEditorOptions, ...JSON.parse(widgetData.contentData) };
            } catch (e) {
                // Fail silently
            }
        }
        const contentData = column?.widgetContents?.[widgetIndex]?.contentData;
        if (contentData) {
            try {
                return { ...defaultContactEditorOptions, ...JSON.parse(contentData) };
            } catch (e) {
                // Fail silently
            }
        }
        return defaultContactEditorOptions;
    }, [column, widgetIndex, widgetData]);

    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onWidgetClick(e);
                onClick();
                dispatch(setSelectedBlockId(blockId));
            }}
            sx={{
                width: '100%',
                padding: options.padding,
                backgroundColor: options.backgroundColor,
                border: isSelected ? '2px dashed #2196f3' : '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: options.fontFamily,
                color: options.textColor,
                textAlign: options.textAlign as any,
                fontSize: options.fontSize
            }}
        >
            {options.showUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: options.textAlign === 'center' ? 'center' : (options.textAlign === 'right' ? 'flex-end' : 'flex-start') }}>
                    <HomeIcon sx={{ color: options.iconColor, fontSize: options.iconSize, mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{options.url}</Typography>
                </Box>
            )}
            {options.showEmail && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: options.textAlign === 'center' ? 'center' : (options.textAlign === 'right' ? 'flex-end' : 'flex-start') }}>
                    <EmailIcon sx={{ color: options.iconColor, fontSize: options.iconSize, mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{options.email}</Typography>
                </Box>
            )}
            {options.showPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: options.textAlign === 'center' ? 'center' : (options.textAlign === 'right' ? 'flex-end' : 'flex-start') }}>
                    <PhoneIcon sx={{ color: options.iconColor, fontSize: options.iconSize, mr: 1 }} />
                    <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{options.phone}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ContactFieldComponent;
