import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

interface EmailFooterFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
}

const EmailFooterFieldComponent: React.FC<EmailFooterFieldComponentProps> = ({
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
                console.error("Failed to parse footer options", e);
            }
        }
        return column?.emailFooterEditorOptions || {};
    }, [column, widgetIndex]);

    const emailFooterEditorOptions = options;

    const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;
    const currentYear = new Date().getFullYear();

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
                backgroundColor: emailFooterEditorOptions?.backgroundColor || '#333333',
                color: emailFooterEditorOptions?.textColor || '#ffffff',
                padding: emailFooterEditorOptions?.padding || '30px 20px',
                textAlign: 'center',
                border: isSelected ? '2px dashed blue' : 'none',
                cursor: 'pointer',
                fontFamily: emailFooterEditorOptions?.fontFamily === 'inherit' || !emailFooterEditorOptions?.fontFamily ? 'inherit' : emailFooterEditorOptions?.fontFamily,
                fontSize: emailFooterEditorOptions?.fontSize || '14px',
            }}
        >
            {/* Social Media Icons */}
            {emailFooterEditorOptions?.showSocialMedia !== false && (
                <Box sx={{ marginBottom: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="32" height="32" style={{ display: 'block', border: 0 }} />
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="32" height="32" style={{ display: 'block', border: 0 }} />
                    </a>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="32" height="32" style={{ display: 'block', border: 0 }} />
                    </a>
                </Box>
            )}

            {/* Store Address */}
            {emailFooterEditorOptions?.showAddress !== false && (
                <Typography variant="body2" sx={{ marginBottom: '10px', fontSize: '12px' }}>
                    {emailFooterEditorOptions?.storeAddress || '{{store_address}}'}
                </Typography>
            )}

            {/* Contact Info */}
            {emailFooterEditorOptions?.showContact !== false && (
                <Typography variant="body2" sx={{ marginBottom: '10px', fontSize: '12px' }}>
                    Email: {emailFooterEditorOptions?.contactEmail || '{{store_email}}'} |
                    Phone: {emailFooterEditorOptions?.contactPhone || '{{store_phone}}'}
                </Typography>
            )}

            {/* Links */}
            <Box sx={{ marginBottom: '15px' }}>
                <Link href="#" sx={{ color: emailFooterEditorOptions?.linkColor || '#4CAF50', marginX: '10px', fontSize: '12px' }}>
                    Privacy Policy
                </Link>
                <Link href="#" sx={{ color: emailFooterEditorOptions?.linkColor || '#4CAF50', marginX: '10px', fontSize: '12px' }}>
                    Terms of Service
                </Link>
                <Link href="#" sx={{ color: emailFooterEditorOptions?.linkColor || '#4CAF50', marginX: '10px', fontSize: '12px' }}>
                    Unsubscribe
                </Link>
            </Box>

            {/* Copyright */}
            <Typography variant="body2" sx={{ fontSize: '11px', opacity: 0.8 }}>
                © {currentYear} {emailFooterEditorOptions?.storeName || '{{store_name}}'}. All rights reserved.
            </Typography>
        </Box>
    );
};

export default EmailFooterFieldComponent;
