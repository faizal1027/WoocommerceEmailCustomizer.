import React from 'react';
import { Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface CtaButtonFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
}

const CtaButtonFieldComponent: React.FC<CtaButtonFieldComponentProps> = ({
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
                // Fail silently
            }
        }
        return column?.ctaButtonEditorOptions || {};
    }, [column, widgetIndex]);

    const ctaButtonEditorOptions = options;

    const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewMode) {
            // In preview mode, don't navigate
        }
    };

    return (
        <Box
            onClick={(e) => {
                // Allow bubbling
            }}
            sx={{
                width: '100%',
                padding: ctaButtonEditorOptions?.padding || '20px',
                textAlign: ctaButtonEditorOptions?.textAlign || ctaButtonEditorOptions?.alignment || 'center',
                border: isSelected ? '2px dashed blue' : 'none',
                cursor: 'pointer',
            }}
        >
            <Button
                variant="contained"
                onClick={handleButtonClick}
                sx={{
                    backgroundColor: ctaButtonEditorOptions?.backgroundColor || '#4CAF50',
                    color: ctaButtonEditorOptions?.textColor || '#ffffff',
                    fontSize: ctaButtonEditorOptions?.fontSize || '16px',
                    fontWeight: ctaButtonEditorOptions?.fontWeight || 'bold',
                    padding: ctaButtonEditorOptions?.buttonPadding || '12px 30px',
                    borderRadius: ctaButtonEditorOptions?.borderRadius || '5px',
                    textTransform: 'none',
                    fontFamily: ctaButtonEditorOptions?.fontFamily === 'inherit' || !ctaButtonEditorOptions?.fontFamily ? 'inherit' : ctaButtonEditorOptions?.fontFamily,
                    '&:hover': {
                        backgroundColor: ctaButtonEditorOptions?.hoverColor || '#45a049',
                    },
                    minWidth: ctaButtonEditorOptions?.minWidth || '200px',
                }}
            >
                {fallback(ctaButtonEditorOptions?.buttonText, previewMode ? 'View Your Order' : '{{button_text}}')}
            </Button>
        </Box>
    );
};

export default CtaButtonFieldComponent;
