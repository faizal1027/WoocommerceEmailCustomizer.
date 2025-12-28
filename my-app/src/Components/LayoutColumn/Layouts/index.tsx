import React, { useState } from 'react';
import {
  Accordion, AccordionSummary,
  AccordionDetails, Typography,
  Box, Slide, TextField, InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';

// Import Layouts
// Import Layouts
import GeneralLayout, { layoutOptions } from './GeneralLayout';
import MainLayout, { basicsWidgets } from './basicsLayout';
import WooCommerceLayout, { wooCommerceWidgets } from './WooCommerceLayout';
import FormsLayout, { formsWidgets } from './FormsLayout';
import LayoutBlockLayout, { blockLayoutWidgets } from './BlockLayout';
import ExtraLayout, { extraWidgets } from './ExtraLayout';

// Import Editor Widgets
import LayoutEditorWidget from './GeneralLayout/WidgetOption/layoutWidgetEditor';

// Basics Layout Editors
import TextWidgetEditor from './basicsLayout/WidgetsEditor/textWidgetEditor';
import ButtonWidgetEditor from './basicsLayout/WidgetsEditor/buttonWidgetEditor';
import HeadingWidgetEditor from './basicsLayout/WidgetsEditor/headingWidgetEditor';
import SocialIconsWidgetEditor from './basicsLayout/WidgetsEditor/socialIconsWidgetEditor';
import DividerWidgetEditor from './basicsLayout/WidgetsEditor/dividerWidgetEditor';
import ImageWidgetEditor from './basicsLayout/WidgetsEditor/imageWidgetEditor';
import SectionWidgetEditor from './basicsLayout/WidgetsEditor/sectionWidgetEditor';
import SpacerWidgetEditor from './basicsLayout/WidgetsEditor/spacerWidgetEditor';
import LinkWidgetEditor from './basicsLayout/WidgetsEditor/linkWidgetEditor';
import LinkBoxWidgetEditor from './basicsLayout/WidgetsEditor/linkBoxWidgetEditor';
import ImageBoxWidgetEditor from './basicsLayout/WidgetsEditor/imageBoxWidgetEditor';
import MapWidgetEditor from './basicsLayout/WidgetsEditor/mapWidgetEditor';
import IconWidgetEditor from './basicsLayout/WidgetsEditor/iconWidgetEditor';

// Layout Block Editors 
import RowWidgetEditor from './BlockLayout/WidgetsEditor/rowWidgetEditor';
import ContainerWidgetEditor from './BlockLayout/WidgetsEditor/containerWidgetEditor';
import GroupWidgetEditor from './BlockLayout/WidgetsEditor/groupWidgetEditor';

// Forms Editors
import FormWidgetEditor from './FormsLayout/WidgetsEditor/formWidgetEditor';
import SurveyWidgetEditor from './FormsLayout/WidgetsEditor/surveyWidgetEditor';
import InputWidgetEditor from './FormsLayout/WidgetsEditor/inputWidgetEditor';
import TextareaWidgetEditor from './FormsLayout/WidgetsEditor/textareaWidgetEditor';
import SelectWidgetEditor from './FormsLayout/WidgetsEditor/selectWidgetEditor';
import CheckboxWidgetEditor from './FormsLayout/WidgetsEditor/checkboxWidgetEditor';
import RadioWidgetEditor from './FormsLayout/WidgetsEditor/radioWidgetEditor';
import LabelWidgetEditor from './FormsLayout/WidgetsEditor/labelWidgetEditor';

// Extra Block Editors 
import SocialFollowWidgetEditor from './ExtraLayout/WidgetsEditor/socialFollowWidgetEditor';
import VideoWidgetEditor from './ExtraLayout/WidgetsEditor/videoWidgetEditor';
import CodeWidgetEditor from './ExtraLayout/WidgetsEditor/codeWidgetEditor';
import CountdownWidgetEditor from './ExtraLayout/WidgetsEditor/countdownWidgetEditor';
import ProgressBarWidgetEditor from './ExtraLayout/WidgetsEditor/progressBarWidgetEditor';
import ProductWidgetEditor from './ExtraLayout/WidgetsEditor/productWidgetEditor';
import PromoCodeWidgetEditor from './ExtraLayout/WidgetsEditor/promoCodeWidgetEditor';
import PriceWidgetEditor from './ExtraLayout/WidgetsEditor/priceWidgetEditor';
import TestimonialWidgetEditor from './ExtraLayout/WidgetsEditor/testimonialWidgetEditor';
import NavbarWidgetEditor from './ExtraLayout/WidgetsEditor/navbarWidgetEditor';
import CardWidgetEditor from './ExtraLayout/WidgetsEditor/cardWidgetEditor';
import AlertWidgetEditor from './ExtraLayout/WidgetsEditor/alertWidgetEditor';
import ProgressWidgetEditor from './ExtraLayout/WidgetsEditor/progressWidgetEditor';

// Woocommerce Editors
import ShippingAddressWidgetEditor from './WooCommerceLayout/WidgetsEditor/shippingAddressWidgetEditor';
import BillingAddressWidgetEditor from './WooCommerceLayout/WidgetsEditor/billingAddressWidgetEditor';
import OrderItemsWidgetEditor from './WooCommerceLayout/WidgetsEditor/orderItemWidgetEditor';
import TaxBillingWidgetEditor from './WooCommerceLayout/WidgetsEditor/taxBillingWidgetEditor';
import EmailHeaderWidgetEditor from './WooCommerceLayout/WidgetsEditor/emailHeaderWidgetEditor';
import EmailFooterWidgetEditor from './WooCommerceLayout/WidgetsEditor/emailFooterWidgetEditor';
import CtaButtonWidgetEditor from './WooCommerceLayout/WidgetsEditor/ctaButtonWidgetEditor';
import RelatedProductsWidgetEditor from './WooCommerceLayout/WidgetsEditor/relatedProductsWidgetEditor';
import OrderSubtotalWidgetEditor from './WooCommerceLayout/WidgetsEditor/orderSubtotalWidgetEditor';
import OrderTotalWidgetEditor from './WooCommerceLayout/WidgetsEditor/orderTotalWidgetEditor';
import ShippingMethodWidgetEditor from './WooCommerceLayout/WidgetsEditor/shippingMethodWidgetEditor';
import PaymentMethodWidgetEditor from './WooCommerceLayout/WidgetsEditor/paymentMethodWidgetEditor';
import CustomerNoteWidgetEditor from './WooCommerceLayout/WidgetsEditor/customerNoteWidgetEditor';

const OverallLayout = () => {
  const {
    editorOpen,
    selectedContentType,
    selectedBlockForEditor,
    selectedColumnIndex
  } = useSelector((state: RootState) => state.workspace);

  const [searchTerm, setSearchTerm] = useState('');

  const renderEditorContent = () => {
    if (!editorOpen) {
      return null;
    }

    switch (selectedContentType) {
      // Basics Layout Editors
      case 'text':
        return <TextWidgetEditor />;
      case 'button':
        return <ButtonWidgetEditor />;
      case 'heading':
        return <HeadingWidgetEditor />;
      case 'socialIcons':
        return <SocialIconsWidgetEditor />;
      case 'divider':
        return <DividerWidgetEditor />;
      case 'image':
        return selectedBlockForEditor && selectedColumnIndex !== null ? (
          <ImageWidgetEditor blockId={selectedBlockForEditor} columnIndex={selectedColumnIndex} />
        ) : null;
      case 'section':
        return <SectionWidgetEditor />;
      case 'spacer':
        return <SpacerWidgetEditor />;
      case 'link':
        return <LinkWidgetEditor />;
      case 'linkBox':
        return <LinkBoxWidgetEditor />;
      case 'imageBox':
        return <ImageBoxWidgetEditor />;
      case 'map':
        return <MapWidgetEditor />;
      case 'icon':
        return <IconWidgetEditor />;

      // Layout Block Editors
      case 'row':
        return <RowWidgetEditor />;
      case 'container':
        return <ContainerWidgetEditor />;
      case 'group':
        return <GroupWidgetEditor />;

      // Forms Editors
      case 'form':
        return <FormWidgetEditor />;
      case 'survey':
        return <SurveyWidgetEditor />;
      case 'input':
        return <InputWidgetEditor />;
      case 'textarea':
        return <TextareaWidgetEditor />;
      case 'select':
        return <SelectWidgetEditor />;
      case 'checkbox':
        return <CheckboxWidgetEditor />;
      case 'radio':
        return <RadioWidgetEditor />;
      case 'label':
        return <LabelWidgetEditor />;

      // Extra Block Editors 
      case 'socialFollow':
        return <SocialFollowWidgetEditor />;
      case 'video':
        return <VideoWidgetEditor />;
      case 'code':
        return <CodeWidgetEditor />;
      case 'countdown':
        return <CountdownWidgetEditor />;
      case 'progressBar':
        return <ProgressBarWidgetEditor />;
      case 'product':
        return <ProductWidgetEditor />;
      case 'promoCode':
        return <PromoCodeWidgetEditor />;
      case 'price':
        return <PriceWidgetEditor />;
      case 'testimonial':
        return <TestimonialWidgetEditor />;
      case 'navbar':
        return <NavbarWidgetEditor />;
      case 'card':
        return <CardWidgetEditor />;
      case 'alert':
        return <AlertWidgetEditor />;
      case 'progress':
        return <ProgressWidgetEditor />;

      // Woocommerce Editors
      case 'shippingAddress':
        return <ShippingAddressWidgetEditor />;
      case 'billingAddress':
        return <BillingAddressWidgetEditor />;
      case 'orderItems':
        return <OrderItemsWidgetEditor />;
      case 'taxBilling':
        return <TaxBillingWidgetEditor />;
      case 'emailHeader':
        return <EmailHeaderWidgetEditor />;
      case 'emailFooter':
        return <EmailFooterWidgetEditor />;
      case 'ctaButton':
        return <CtaButtonWidgetEditor />;
      case 'relatedProducts':
        return <RelatedProductsWidgetEditor />;
      case 'orderSubtotal':
        return <OrderSubtotalWidgetEditor />;
      case 'orderTotal':
        return <OrderTotalWidgetEditor />;
      case 'shippingMethod':
        return <ShippingMethodWidgetEditor />;
      case 'paymentMethod':
        return <PaymentMethodWidgetEditor />;
      case 'customerNote':
        return <CustomerNoteWidgetEditor />;

      default:
        return <LayoutEditorWidget />;
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Helper to check matches
  const hasMatches = (items: { name?: string }[], term: string) => {
    if (!term) return true;
    return items.some(item =>
      (item.name && item.name.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const hasGeneralMatches = !searchTerm || layoutOptions.some(col =>
    `${col} Column`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    'layout'.includes(searchTerm.toLowerCase())
  );

  const showGeneral = hasGeneralMatches;
  const showBasics = hasMatches(basicsWidgets, searchTerm);
  const showLayoutBlocks = hasMatches(blockLayoutWidgets, searchTerm);
  const showForms = hasMatches(formsWidgets, searchTerm);
  const showExtra = hasMatches(extraWidgets, searchTerm);
  const showWooCommerce = hasMatches(wooCommerceWidgets, searchTerm);

  return (
    <Box
      sx={{
        width: '100%', height: '100vh',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}
    >
      <Slide direction="right" in={editorOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'absolute', width: '100%',
            height: '100%',
            zIndex: 2,
            bgcolor: 'background.paper',
            overflow: 'auto',
          }}
          className="layout-editor-widget"
        >
          {renderEditorContent()}
        </Box>
      </Slide>

      <Box
        sx={{
          transition: 'opacity 0.3s ease',
          opacity: editorOpen ? 0 : 1,
          pointerEvents: editorOpen ? 'none' : 'auto',
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 2, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, borderBottom: '1px solid #eee' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* General Layout */}
        {showGeneral && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>GeneralLayout</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GeneralLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Basics Layout */}
        {showBasics && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Basics</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MainLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Layout Block */}
        {showLayoutBlocks && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Layout Block</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LayoutBlockLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Forms */}
        {showForms && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Forms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormsLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {/* Extra Block  */}
        {showExtra && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Extra Block</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ExtraLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {/* WooCommerce */}
        {showWooCommerce && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>WooCommerce</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <WooCommerceLayout searchTerm={searchTerm} />
            </AccordionDetails>
          </Accordion>
        )}

        {!showGeneral && !showBasics && !showLayoutBlocks && !showForms && !showExtra && !showWooCommerce && (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No matching blocks found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OverallLayout;