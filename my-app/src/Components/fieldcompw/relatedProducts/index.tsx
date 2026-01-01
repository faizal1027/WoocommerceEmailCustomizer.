import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface RelatedProductsFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
}

const RelatedProductsFieldComponent: React.FC<RelatedProductsFieldComponentProps> = ({
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
                console.error("Failed to parse relatedProducts options", e);
            }
        }
        return column?.relatedProductsEditorOptions || {};
    }, [column, widgetIndex]);

    const relatedProductsEditorOptions = options;

    const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;

    // Sample products for preview mode
    const sampleProducts = [
        {
            name: 'Wireless Mouse',
            price: '$29.99',
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop'
        },
        {
            name: 'USB-C Hub',
            price: '$49.99',
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop'
        },
        {
            name: 'Laptop Stand',
            price: '$39.99',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
        },
        {
            name: 'Mechanical Keyboard',
            price: '$129.99',
            image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&h=300&fit=crop'
        }
    ];

    const products = React.useMemo(() => {
        if (relatedProductsEditorOptions?.useManualData) {
            return [
                {
                    name: relatedProductsEditorOptions.p1_name || (previewMode ? 'Product 1' : '{{product_name_1}}'),
                    price: relatedProductsEditorOptions.p1_price || (previewMode ? '$0.00' : '{{product_price_1}}'),
                    image: relatedProductsEditorOptions.p1_image || (previewMode ? 'https://via.placeholder.com/300' : '{{product_image_1}}'),
                    url: relatedProductsEditorOptions.p1_url || '#'
                },
                {
                    name: relatedProductsEditorOptions.p2_name || (previewMode ? 'Product 2' : '{{product_name_2}}'),
                    price: relatedProductsEditorOptions.p2_price || (previewMode ? '$0.00' : '{{product_price_2}}'),
                    image: relatedProductsEditorOptions.p2_image || (previewMode ? 'https://via.placeholder.com/300' : '{{product_image_2}}'),
                    url: relatedProductsEditorOptions.p2_url || '#'
                },
                {
                    name: relatedProductsEditorOptions.p3_name || (previewMode ? 'Product 3' : '{{product_name_3}}'),
                    price: relatedProductsEditorOptions.p3_price || (previewMode ? '$0.00' : '{{product_price_3}}'),
                    image: relatedProductsEditorOptions.p3_image || (previewMode ? 'https://via.placeholder.com/300' : '{{product_image_3}}'),
                    url: relatedProductsEditorOptions.p3_url || '#'
                },
                {
                    name: relatedProductsEditorOptions.p4_name || (previewMode ? 'Product 4' : '{{product_name_4}}'),
                    price: relatedProductsEditorOptions.p4_price || (previewMode ? '$0.00' : '{{product_price_4}}'),
                    image: relatedProductsEditorOptions.p4_image || (previewMode ? 'https://via.placeholder.com/300' : '{{product_image_4}}'),
                    url: relatedProductsEditorOptions.p4_url || '#'
                }
            ];
        }

        return previewMode ? sampleProducts : [
            { name: '{{product_name_1}}', price: '{{product_price_1}}', image: '{{product_image_1}}' },
            { name: '{{product_name_2}}', price: '{{product_price_2}}', image: '{{product_image_2}}' },
            { name: '{{product_name_3}}', price: '{{product_price_3}}', image: '{{product_image_3}}' },
            { name: '{{product_name_4}}', price: '{{product_price_4}}', image: '{{product_image_4}}' }
        ];
    }, [previewMode, relatedProductsEditorOptions, sampleProducts]);

    return (
        <Box
            onClick={(e) => {
                // Allow bubbling
            }}
            sx={{
                width: '100%',
                padding: relatedProductsEditorOptions?.padding || '20px',
                backgroundColor: relatedProductsEditorOptions?.backgroundColor || '#f9f9f9',
                border: isSelected ? '2px dashed blue' : 'none',
                cursor: 'pointer',
                fontFamily: relatedProductsEditorOptions?.fontFamily === 'inherit' || !relatedProductsEditorOptions?.fontFamily ? 'inherit' : relatedProductsEditorOptions?.fontFamily,
                fontSize: relatedProductsEditorOptions?.fontSize || '14px',
            }}
        >
            {/* Title */}
            <Typography
                variant="h5"
                sx={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontWeight: relatedProductsEditorOptions?.titleFontWeight || 'bold',
                    color: relatedProductsEditorOptions?.titleColor || '#333',
                }}
            >
                {fallback(relatedProductsEditorOptions?.title, previewMode ? 'You Might Also Like' : '{{related_products_title}}')}
            </Typography>

            {/* Products Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {products.slice(0, relatedProductsEditorOptions?.productsToShow || 3).map((product, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: { xs: '100%', sm: '30%' },
                            flexGrow: 1,
                            minWidth: '200px'
                        }}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: relatedProductsEditorOptions?.showCardShadow !== false
                                    ? (relatedProductsEditorOptions?.cardShadow || '0 2px 4px rgba(0,0,0,0.1)')
                                    : 'none',
                            }}
                        >
                            {relatedProductsEditorOptions?.showImages !== false && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontSize: '16px', marginBottom: '8px' }}>
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: relatedProductsEditorOptions?.priceColor || '#4CAF50',
                                        fontWeight: 'bold',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {product.price}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: relatedProductsEditorOptions?.buttonColor || '#4CAF50',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: relatedProductsEditorOptions?.buttonHoverColor || '#45a049',
                                        },
                                    }}
                                >
                                    {relatedProductsEditorOptions?.buttonText || 'View Product'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RelatedProductsFieldComponent;
