import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface EmailHeaderFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
}

const EmailHeaderFieldComponent: React.FC<EmailHeaderFieldComponentProps> = ({
    blockId,
    columnIndex,
    isSelected,
    onClick,
    onWidgetClick,
    widgetIndex,
    previewMode = true
}) => {
    const dispatch = useDispatch();
    // Select data from the specific block/column instead of global editor state
    const block = useSelector((state: RootState) => state.workspace.blocks.find(b => b.id === blockId));
    const column = block?.columns[columnIndex];

    // Parse the saved options
    const options = React.useMemo(() => {
        const contentData = column?.widgetContents?.[widgetIndex]?.contentData;
        if (contentData) {
            try {
                return JSON.parse(contentData);
            } catch (e) {
                console.error("Failed to parse header options", e);
            }
        }
        // Fallback for legacy loops or if contentData missing
        return column?.emailHeaderEditorOptions || {};
    }, [column, widgetIndex]);

    // Use options instead of emailHeaderEditorOptions
    const emailHeaderEditorOptions = options;

    const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;

    const align = emailHeaderEditorOptions?.textAlign || 'center';

    return (
        <Box
            onClick={(e) => {
                // Allow bubbling
            }}
            sx={{
                width: '100%',
                backgroundColor: emailHeaderEditorOptions?.backgroundColor || '#4CAF50',
                color: emailHeaderEditorOptions?.textColor || '#ffffff',
                padding: emailHeaderEditorOptions?.padding || '0px',
                border: isSelected ? '2px dashed blue' : 'none',
                cursor: 'pointer',
                position: 'relative',
                fontFamily: emailHeaderEditorOptions?.fontFamily === 'inherit' || !emailHeaderEditorOptions?.fontFamily ? 'inherit' : emailHeaderEditorOptions?.fontFamily,
            }}
        >
            {/* Logo */}
            <Box
                component="img"
                src={emailHeaderEditorOptions?.logoUrl || (previewMode ? 'https://via.placeholder.com/150x50?text=Store+Logo' : '{{logo_url}}')}
                alt="Store Logo"
                sx={{
                    display: 'block',
                    maxWidth: emailHeaderEditorOptions?.logoWidth || '150px',
                    height: 'auto',
                    marginLeft: align === 'center' || align === 'right' ? 'auto' : '0',
                    marginRight: align === 'center' ? 'auto' : '0',
                }}
            />
        </Box>
    );
};

export default EmailHeaderFieldComponent;
