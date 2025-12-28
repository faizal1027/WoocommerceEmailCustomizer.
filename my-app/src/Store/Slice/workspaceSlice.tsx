import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

interface ColumnStyle {
  bgColor: string;
  borderTopColor: string;
  borderBottomColor: string;
  borderLeftColor: string;
  borderRightColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderTopSize: number;
  borderBottomSize: number;
  borderLeftSize: number;
  borderRightSize: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  height: number | 'auto';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

// Updated WidgetContentType with ALL component types in correct order
export type WidgetContentType = 'text' | 'heading' | 'button' | 'socialIcons' | 'divider' | 'image' |
  // Basic Layout
  'section' | 'spacer' | 'link' | 'linkBox' | 'imageBox' | 'map' | 'icon' |
  // Layout Block
  'row' | 'container' | 'group' |
  // Extra Block
  'socialFollow' | 'video' | 'code' | 'countdown' | 'progressBar' | 'product' | 'promoCode' | 'price' | 'testimonial' | 'navbar' | 'card' | 'alert' | 'progress' |
  // Forms
  'form' | 'survey' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'label' |
  // WooCommerce Layout
  'billingAddress' | 'shippingAddress' | 'orderItems' | 'taxBilling' | 'emailHeader' | 'emailFooter' | 'ctaButton' | 'relatedProducts' |
  'orderSubtotal' | 'orderTotal' | 'shippingMethod' | 'paymentMethod' | 'customerNote' | null;

interface WidgetContent {
  contentType: WidgetContentType;
  contentData: string | null;
}

interface Column {
  id: string;
  style: ColumnStyle;
  contentType: WidgetContentType;
  contentData: string | null;
  widgetContents: WidgetContent[];

  // Basic Layout
  textEditorOptions: TextEditorOptions;
  headingEditorOptions: HeadingEditorOptions;
  socialIconsEditorOptions: SocialIconsEditorOptions;
  dividerEditorOptions: DividerEditorOptions;
  imageEditorOptions: ImageEditorOptions;
  buttonEditorOptions: ButtonEditorOptions;
  sectionEditorOptions: SectionEditorOptions;
  spacerEditorOptions: SpacerEditorOptions;
  linkEditorOptions: LinkEditorOptions;
  linkBoxEditorOptions: LinkBoxEditorOptions;
  imageBoxEditorOptions: ImageBoxEditorOptions;
  mapEditorOptions: MapEditorOptions;
  iconEditorOptions: IconEditorOptions;

  // Layout Block
  rowEditorOptions: RowEditorOptions;
  containerEditorOptions: ContainerEditorOptions;
  groupEditorOptions: GroupEditorOptions;

  // Extra Block
  socialFollowEditorOptions: SocialFollowEditorOptions;
  videoEditorOptions: VideoEditorOptions;
  codeEditorOptions: CodeEditorOptions;
  countdownEditorOptions: CountdownEditorOptions;
  progressBarEditorOptions: ProgressBarEditorOptions;
  productEditorOptions: ProductEditorOptions;
  promoCodeEditorOptions: PromoCodeEditorOptions;
  priceEditorOptions: PriceEditorOptions;
  testimonialEditorOptions: TestimonialEditorOptions;
  navbarEditorOptions: NavbarEditorOptions;
  cardEditorOptions: CardEditorOptions;
  alertEditorOptions: AlertEditorOptions;
  progressEditorOptions: ProgressEditorOptions;

  // Forms
  formEditorOptions: FormEditorOptions;
  surveyEditorOptions: SurveyEditorOptions;
  inputEditorOptions: InputEditorOptions;
  textareaEditorOptions: TextareaEditorOptions;
  selectEditorOptions: SelectEditorOptions;
  checkboxEditorOptions: CheckboxEditorOptions;
  radioEditorOptions: RadioEditorOptions;
  labelEditorOptions: LabelEditorOptions;

  // WooCommerce Layout
  shippingAddressEditorOptions: ShippingAddressEditorOptions;
  billingAddressEditorOptions: BillingAddressEditorOptions;
  orderItemsEditorOptions: OrderItemsEditorOptions;
  taxBillingEditorOptions: TaxBillingEditorOptions;
  emailHeaderEditorOptions: EmailHeaderEditorOptions;
  emailFooterEditorOptions: EmailFooterEditorOptions;
  ctaButtonEditorOptions: CtaButtonEditorOptions;
  relatedProductsEditorOptions: RelatedProductsEditorOptions;
  orderSubtotalEditorOptions: OrderSubtotalEditorOptions;
  orderTotalEditorOptions: OrderTotalEditorOptions;
  shippingMethodEditorOptions: ShippingMethodEditorOptions;
  paymentMethodEditorOptions: PaymentMethodEditorOptions;
  customerNoteEditorOptions: CustomerNoteEditorOptions;
}

interface BlockStyle {
  bgColor: string;
  borderTopColor: string;
  borderBottomColor: string;
  borderLeftColor: string;
  borderRightColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderTopSize: number;
  borderBottomSize: number;
  borderLeftSize: number;
  borderRightSize: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  height: number | 'auto';
}

interface DroppedBlock {
  id: string;
  columns: Column[];
  style: BlockStyle;
}

// ==================== BASIC LAYOUT INTERFACES ====================

export interface SectionEditorOptions {
  backgroundColor: string;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  border: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    radius: number;
  };
}

export interface SpacerEditorOptions {
  height: number;
  backgroundColor: string;
}

export interface LinkEditorOptions {
  text: string;
  url: string;
  color: string;
  fontSize: number;
  underline: boolean;
}

export interface LinkBoxEditorOptions {
  links: Array<{
    text: string;
    url: string;
  }>;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
}

export interface ImageBoxEditorOptions {
  src: string;
  alt: string;
  width: string;
  height: string;
  link: string;
  caption: string;
}

interface ImageEditorOptions {
  src: string;
  altText: string;
  width: string;
  align: 'left' | 'center' | 'right';
  autoWidth: boolean;
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

export interface MapEditorOptions {
  location: string;
  zoom: number;
  width: string;
  height: string;
}

export interface IconEditorOptions {
  iconType: string;
  color: string;
  size: number;
  link: string;
}

export interface TextEditorOptions {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpace: number;
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  content: string;
}

export interface ButtonEditorOptions {
  urlDisabled: boolean;
  text: string;
  url: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlign: 'left' | 'center' | 'right';
  bgColor: string;
  textColor: string;
  widthAuto?: boolean;
  width?: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  borderRadius: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

export interface HeadingEditorOptions {
  headingType: 'h1' | 'h2' | 'h3' | 'h4';
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpace: number;
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

export type SocialIconKey = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'pinterest' | 'youtube' | 'whatsapp' | 'reddit' | 'github' | 'telegram' | 'envelope';

export interface SocialIconsEditorOptions {
  iconSize: number;
  iconColor: string;
  iconAlign: 'left' | 'center' | 'right';
  iconSpace: number;
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  addedIcons: {
    icons: SocialIconKey[];
    url: string[];
  };
}

export interface DividerEditorOptions {
  width: string;
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// ==================== LAYOUT BLOCK INTERFACES ====================

export interface RowEditorOptions {
  columns: number;
  gap: number;
  backgroundColor: string;
}

export interface ContainerEditorOptions {
  maxWidth: string;
  backgroundColor: string;
  padding: number;
  border: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted' | 'none';
    color: string;
  };
}

export interface GroupEditorOptions {
  elements: string[];
  spacing: number;
  alignment: 'left' | 'center' | 'right';
  direction: 'row' | 'column';
}

// ==================== EXTRA BLOCK INTERFACES ====================

export interface SocialFollowEditorOptions {
  platforms: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
  iconSize: number;
  iconColor: string;
  spacing: number;
}

export interface VideoEditorOptions {
  url: string;
  width: string;
  height: string;
  autoplay: boolean;
  controls: boolean;
}

export interface CodeEditorOptions {
  language: string;
  code: string;
  theme: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  content?: string;
}

export interface CountdownEditorOptions {
  targetDate: string;
  format: string;
  showLabels: boolean;
  backgroundColor: string;
  textColor: string;
  title?: string;
  endMessage?: string;
}

export interface ProgressBarEditorOptions {
  value: number;
  max: number;
  label: string;
  color: string;
  showPercentage: boolean;
  title?: string;
  progress?: number;
  height?: number;
  backgroundColor?: string;
  barColor?: string;
}

export interface ProductEditorOptions {
  name: string;
  price: string | number;
  image: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  buttonLink?: string;
  imageUrl?: string;
  currency?: string;
}

export interface PromoCodeEditorOptions {
  code: string;
  description: string;
  validUntil: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

export interface PriceEditorOptions {
  amount: string | number;
  currency: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  showDecimals?: boolean;
  decimals?: number;
  showCurrencySymbol?: boolean;
  currencySymbol?: string;
  label?: string;
}

export interface TestimonialEditorOptions {
  quote: string;
  author: string;
  position: string;
  avatar: string;
  rating: number;
  backgroundColor?: string;
  textColor?: string;
  authorImage?: string;
  authorTitle?: string;
}

export interface NavbarEditorOptions {
  links: Array<{
    text: string;
    url: string;
  }>;
  logo: string;
  backgroundColor: string;
  textColor: string;
  height?: number;
  items?: Array<{
    text: string;
    url: string;
  }>;
}

export interface CardEditorOptions {
  title?: string;
  content?: string;
  image: string;
  backgroundColor: string;
  shadow: boolean;
  border: boolean;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
  imageUrl?: string;
}

export interface AlertEditorOptions {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  closable: boolean;
  backgroundColor: string;
  dismissible?: boolean;
  textColor: string;
  icon?: string;
}

export interface ProgressEditorOptions {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  showValue?: boolean;
}

// ==================== FORMS INTERFACES ====================

export interface FormEditorOptions {
  fields: Array<{
    type: string;
    label: string;
    name: string;
    required: boolean;
  }>;
  submitText: string;
  action: string;
  method: 'get' | 'post';
  title?: string;
  submitUrl?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface SurveyEditorOptions {
  questions?: Array<{
    text: string;
    type: string;
    options: string[];
  }>;
  multiple: boolean;
  required: boolean;
  title?: string;
  submitText?: string;
}

export interface InputEditorOptions {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  placeholder: string;
  required: boolean;
  name: string;
}

export interface TextareaEditorOptions {
  label: string;
  placeholder: string;
  rows: number;
  required: boolean;
  name: string;
  disabled?: boolean;
  cols?: number;
}

export interface SelectEditorOptions {
  label: string;
  options: { label: string; value: string }[];
  required: boolean;
  name: string;
  multiple: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontWeight?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  width?: string;
  height?: string;
}

export interface CheckboxEditorOptions {
  label: string;
  checked: boolean;
  name: string;
  value: string;
  options?: string[];
  required?: boolean;
  inline?: boolean;
}

export interface RadioEditorOptions {
  label: string;
  options: string[];
  name: string;
  selected: string;
  required?: boolean;
  inline?: boolean;
}

export interface LabelEditorOptions {
  text: string;
  for: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  type?: 'required' | 'optional' | 'error' | 'warning' | 'normal';
}

// ==================== WOOCOMMERCE LAYOUT INTERFACES ====================

export interface ShippingAddressEditorOptions {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
}

export interface BillingAddressEditorOptions {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  lineHeight: string;
  letterSpacing: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
}

export interface TaxBillingEditorOptions {
  orderNumber: string;
  orderDate: string;
  orderSubtotal: string;
  orderShipping: string;
  orderDiscount: string;
  orderTax: string;
  orderTotal: string;
  taxRate: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  billingCountry: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
}

export interface OrderSubtotalEditorOptions {
  label: string;
  value: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  spacing?: number;
}

export interface OrderTotalEditorOptions {
  label: string;
  value: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  spacing?: number;
}

export interface ShippingMethodEditorOptions {
  label: string;
  value: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  spacing?: number;
}

export interface PaymentMethodEditorOptions {
  label: string;
  value: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  spacing?: number;
}

export interface CustomerNoteEditorOptions {
  label: string;
  value: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
  spacing?: number;
}

export interface OrderItem {
  product: string;
  quantity: number;
  price: string;
}

export interface OrderItemsEditorOptions {
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: string;
  discount: string;
  paymentMethod: string;
  total: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  textAlign: string;
  backgroundColor: string;
}

export interface EmailHeaderEditorOptions {
  storeName: string;
  showLogo: boolean;
  logoUrl: string;
  logoWidth: string;
  showTagline: boolean;
  tagline: string;
  backgroundColor: string;
  textColor: string;
  padding: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  textAlign: string;
  taglineFontSize: string;
}

export interface EmailFooterEditorOptions {
  storeName: string;
  showSocialMedia: boolean;
  showAddress: boolean;
  storeAddress: string;
  showContact: boolean;
  contactEmail: string;
  contactPhone: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  padding: string;
  fontFamily: string;
  fontSize: string;
}

export interface CtaButtonEditorOptions {
  buttonText: string;
  buttonUrl: string;
  alignment: string;
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  borderRadius: string;
  buttonPadding: string;
  padding: string;
  minWidth: string;
}

export interface RelatedProductsEditorOptions {
  title: string;
  productsToShow: number;
  showImages: boolean;
  buttonText: string;
  backgroundColor: string;
  titleColor: string;
  titleFontWeight: string;
  priceColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  padding: string;
  showCardShadow: boolean;
  cardShadow: string;
  fontFamily: string;
  fontSize: string;
  useManualData: boolean;
  p1_name: string;
  p1_price: string;
  p1_image: string;
  p1_url: string;
  p2_name: string;
  p2_price: string;
  p2_image: string;
  p2_url: string;
  p3_name: string;
  p3_price: string;
  p3_image: string;
  p3_url: string;
  p4_name: string;
  p4_price: string;
  p4_image: string;
  p4_url: string;
}


interface WorkspaceState {
  blocks: DroppedBlock[];
  selectedBlockId: string | null;
  editorOpen: boolean;
  selectedColumnIndex: number | null;
  selectedBlockForEditor: string | null;
  selectedContentType: WidgetContentType | null;
  selectedWidgetIndex: number | null;

  // Basic Layout
  sectionEditorOptions: SectionEditorOptions;
  spacerEditorOptions: SpacerEditorOptions;
  linkEditorOptions: LinkEditorOptions;
  linkBoxEditorOptions: LinkBoxEditorOptions;
  imageBoxEditorOptions: ImageBoxEditorOptions;
  mapEditorOptions: MapEditorOptions;
  iconEditorOptions: IconEditorOptions;
  textEditorOptions: TextEditorOptions;
  headingEditorOptions: HeadingEditorOptions;
  socialIconsEditorOptions: SocialIconsEditorOptions;
  buttonEditorOptions: ButtonEditorOptions;
  dividerEditorOptions: DividerEditorOptions;
  imageEditorOptions: ImageEditorOptions;

  // Layout Block
  rowEditorOptions: RowEditorOptions;
  containerEditorOptions: ContainerEditorOptions;
  groupEditorOptions: GroupEditorOptions;

  // Extra Block
  socialFollowEditorOptions: SocialFollowEditorOptions;
  videoEditorOptions: VideoEditorOptions;
  codeEditorOptions: CodeEditorOptions;
  countdownEditorOptions: CountdownEditorOptions;
  progressBarEditorOptions: ProgressBarEditorOptions;
  productEditorOptions: ProductEditorOptions;
  promoCodeEditorOptions: PromoCodeEditorOptions;
  priceEditorOptions: PriceEditorOptions;
  testimonialEditorOptions: TestimonialEditorOptions;
  navbarEditorOptions: NavbarEditorOptions;
  cardEditorOptions: CardEditorOptions;
  alertEditorOptions: AlertEditorOptions;
  progressEditorOptions: ProgressEditorOptions;

  // Forms
  formEditorOptions: FormEditorOptions;
  surveyEditorOptions: SurveyEditorOptions;
  inputEditorOptions: InputEditorOptions;
  textareaEditorOptions: TextareaEditorOptions;
  selectEditorOptions: SelectEditorOptions;
  checkboxEditorOptions: CheckboxEditorOptions;
  radioEditorOptions: RadioEditorOptions;
  labelEditorOptions: LabelEditorOptions;

  // WooCommerce Layout
  shippingAddressEditorOptions: ShippingAddressEditorOptions;
  billingAddressEditorOptions: BillingAddressEditorOptions;
  orderItemsEditorOptions: OrderItemsEditorOptions;
  taxBillingEditorOptions: TaxBillingEditorOptions;
  emailHeaderEditorOptions: EmailHeaderEditorOptions;
  emailFooterEditorOptions: EmailFooterEditorOptions;
  ctaButtonEditorOptions: CtaButtonEditorOptions;
  relatedProductsEditorOptions: RelatedProductsEditorOptions;
  orderSubtotalEditorOptions: OrderSubtotalEditorOptions;
  orderTotalEditorOptions: OrderTotalEditorOptions;
  shippingMethodEditorOptions: ShippingMethodEditorOptions;
  paymentMethodEditorOptions: PaymentMethodEditorOptions;
  customerNoteEditorOptions: CustomerNoteEditorOptions;

  isMobileView: boolean;
  previewMode: boolean;
  past: DroppedBlock[][];
  future: DroppedBlock[][];
}

export const defaultColumnStyle: ColumnStyle = {
  bgColor: '#ffffffff',
  borderTopColor: '#a0c4ff',
  borderBottomColor: '#a0c4ff',
  borderLeftColor: '#a0c4ff',
  borderRightColor: '#a0c4ff',
  borderStyle: 'solid',
  borderTopSize: 0,
  borderBottomSize: 0,
  borderLeftSize: 0,
  borderRightSize: 0,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  height: 'auto',
  textAlign: 'left',
};

export const defaultBlockStyle: BlockStyle = {
  bgColor: '#e6f0fa',
  borderTopColor: '#a0c4ff',
  borderBottomColor: '#a0c4ff',
  borderLeftColor: '#a0c4ff',
  borderRightColor: '#a0c4ff',
  borderStyle: 'solid',
  borderTopSize: 21,
  borderBottomSize: 0,
  borderLeftSize: 0,
  borderRightSize: 0,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  height: 'auto',
};

export const neutralBlockStyle: BlockStyle = {
  bgColor: 'transparent',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderStyle: 'solid',
  borderTopSize: 0,
  borderBottomSize: 0,
  borderLeftSize: 0,
  borderRightSize: 0,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  height: 'auto',
};

// ==================== DEFAULT VALUES ====================

// Basic Layout Defaults
export const defaultTextEditorOptions: TextEditorOptions = {
  fontFamily: 'global',
  fontSize: 14,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#d32f2f',
  backgroundColor: 'transparent',
  textAlign: 'left',
  lineHeight: 140,
  letterSpace: 1,
  padding: { top: 0, left: 0, right: 0, bottom: 0 },
  content: '<p>Click to edit text</p>',
};

export const defaultButtonEditorOptions: ButtonEditorOptions = {
  text: 'Button',
  url: '#',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'center',
  bgColor: '#007bff',
  textColor: '#ffffff',
  widthAuto: true,
  width: undefined,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  borderRadius: { topLeft: 5, topRight: 5, bottomRight: 5, bottomLeft: 5 },
  urlDisabled: false,
};

export const defaultHeadingEditorOptions: HeadingEditorOptions = {
  fontFamily: 'global',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 22,
  color: '#000000',
  backgroundColor: 'transparent',
  textAlign: 'left',
  lineHeight: 110,
  letterSpace: 1,
  padding: { top: 0, left: 0, right: 0, bottom: 0 },
  headingType: 'h1'
};

export const defaultSocialIconsEditorOptions: SocialIconsEditorOptions = {
  padding: { top: 5, left: 5, right: 5, bottom: 5 },
  iconSize: 32,
  iconColor: "color",
  iconAlign: 'center',
  iconSpace: 0,
  addedIcons: {
    icons: [],
    url: []
  }
};

export const defaultDividerEditorOptions: DividerEditorOptions = {
  width: '75',
  style: 'solid',
  thickness: 2,
  color: '#000000',
  alignment: 'center',
  padding: {
    top: 10,
    right: 0,
    bottom: 10,
    left: 0,
  },
};

const defaultImageEditorOptions: ImageEditorOptions = {
  src: 'https://cdn.tools.unlayer.com/image/placeholder.png',
  altText: '',
  width: '100%',
  align: 'center',
  autoWidth: true,
  padding: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
};

const defaultSectionEditorOptions: SectionEditorOptions = {
  backgroundColor: '#f5f5f5',
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  border: { width: 1, style: 'solid', color: '#ddd', radius: 4 },
};

const defaultSpacerEditorOptions: SpacerEditorOptions = {
  height: 20,
  backgroundColor: 'transparent'
};

const defaultLinkEditorOptions: LinkEditorOptions = {
  text: 'Click here',
  url: '#',
  color: '#007bff',
  fontSize: 14,
  underline: true
};

const defaultLinkBoxEditorOptions: LinkBoxEditorOptions = {
  links: [{ text: 'Link 1', url: '#' }, { text: 'Link 2', url: '#' }],
  backgroundColor: '#f9f9f9',
  padding: 10,
  borderRadius: 5
};

const defaultImageBoxEditorOptions: ImageBoxEditorOptions = {
  src: 'https://cdn.tools.unlayer.com/image/placeholder.png',
  alt: 'Image',
  width: '100%',
  height: 'auto',
  link: '',
  caption: ''
};

const defaultMapEditorOptions: MapEditorOptions = {
  location: 'New York, NY',
  zoom: 12,
  width: '100%',
  height: '300px'
};

const defaultIconEditorOptions: IconEditorOptions = {
  iconType: 'star',
  color: '#000000',
  size: 24,
  link: ''
};

// Layout Block Defaults
const defaultRowEditorOptions: RowEditorOptions = {
  columns: 2,
  gap: 20,
  backgroundColor: 'transparent',
};

const defaultContainerEditorOptions: ContainerEditorOptions = {
  maxWidth: '800px',
  backgroundColor: '#ffffff',
  padding: 20,
  border: { width: 1, style: 'solid', color: '#ddd' }
};

const defaultGroupEditorOptions: GroupEditorOptions = {
  elements: [],
  spacing: 10,
  alignment: 'left',
  direction: 'row'
};

// Extra Block Defaults
const defaultSocialFollowEditorOptions: SocialFollowEditorOptions = {
  platforms: [
    { name: 'Facebook', url: '#', icon: 'facebook' },
    { name: 'Twitter', url: '#', icon: 'twitter' }
  ],
  iconSize: 24,
  iconColor: '#000000',
  spacing: 10
};

// ... existing code ...
export const defaultPriceEditorOptions: PriceEditorOptions = {
  label: 'Price',
  amount: 45.99,
  currency: 'INR',
  currencySymbol: '$',
  decimals: 2,
  showDecimals: true,
  showCurrencySymbol: true,
  period: '',
  features: [],
  buttonText: '',
  buttonUrl: ''
};

const defaultVideoEditorOptions: VideoEditorOptions = {
  // ... existing code ...
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  width: '100%',
  height: '315px',
  autoplay: false,
  controls: true
};

export const defaultCodeEditorOptions: CodeEditorOptions = {
  language: 'javascript',
  code: 'console.log("Hello World");',
  theme: 'default'
};

const defaultCountdownEditorOptions: CountdownEditorOptions = {
  targetDate: '2024-12-31T23:59:59',
  format: 'DD:HH:MM:SS',
  showLabels: true,
  backgroundColor: '#333',
  textColor: '#fff'
};

const defaultProgressBarEditorOptions: ProgressBarEditorOptions = {
  value: 75,
  max: 100,
  label: 'Progress',
  color: '#007bff',
  showPercentage: true
};

const defaultProductEditorOptions: ProductEditorOptions = {
  name: 'Product Name',
  price: '$19.99',
  image: 'https://cdn.tools.unlayer.com/image/placeholder.png',
  description: 'Product description here',
  buttonText: 'Buy Now',
  buttonUrl: '#'
};

const defaultPromoCodeEditorOptions: PromoCodeEditorOptions = {
  code: 'SAVE20',
  description: '20% off on all items',
  validUntil: '2024-12-31',
  backgroundColor: '#ffeb3b',
  textColor: '#333'
};



const defaultTestimonialEditorOptions: TestimonialEditorOptions = {
  quote: 'This is an amazing product!',
  author: 'John Doe',
  position: 'CEO, Company Inc',
  avatar: 'https://cdn.tools.unlayer.com/image/placeholder.png',
  rating: 5
};

const defaultNavbarEditorOptions: NavbarEditorOptions = {
  links: [
    { text: 'Home', url: '#' },
    { text: 'About', url: '#' },
    { text: 'Contact', url: '#' }
  ],
  logo: '',
  backgroundColor: '#333',
  textColor: '#fff'
};

const defaultCardEditorOptions: CardEditorOptions = {
  title: 'Card Title',
  content: 'Card content goes here',
  image: 'https://cdn.tools.unlayer.com/image/placeholder.png',
  backgroundColor: '#fff',
  shadow: true,
  border: false
};

const defaultAlertEditorOptions: AlertEditorOptions = {
  type: 'info',
  message: 'This is an alert message',
  closable: true,
  backgroundColor: '#d9edf7',
  textColor: '#31708f',
  icon: ''
};

const defaultProgressEditorOptions: ProgressEditorOptions = {
  value: 50,
  min: 0,
  max: 100,
  label: 'Progress',
  color: '#007bff',
  showValue: true
};

// Forms Defaults
const defaultFormEditorOptions: FormEditorOptions = {
  fields: [
    { type: 'text', label: 'Name', name: 'name', required: true },
    { type: 'email', label: 'Email', name: 'email', required: true },
    { type: 'textarea', label: 'Message', name: 'message', required: true }
  ],
  submitText: 'Submit',
  action: '#',
  method: 'post'
};

const defaultSurveyEditorOptions: SurveyEditorOptions = {
  questions: [
    { text: 'How would you rate our service?', type: 'radio', options: ['Excellent', 'Good', 'Average', 'Poor'] }
  ],
  multiple: false,
  required: true
};

const defaultInputEditorOptions: InputEditorOptions = {
  type: 'text',
  label: 'Input Label',
  placeholder: 'Enter text here',
  required: false,
  name: 'input_field'
};

const defaultTextareaEditorOptions: TextareaEditorOptions = {
  label: 'Textarea Label',
  placeholder: 'Enter your message here',
  rows: 4,
  required: false,
  name: 'textarea_field',
  disabled: false,
  cols: 50
};

export const defaultSelectEditorOptions: SelectEditorOptions = {
  label: 'Select Label',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ],
  required: false,
  name: 'select_field',
  multiple: false,
  color: '#333333',
  backgroundColor: '#ffffff',
  fontSize: 14,
  fontWeight: 'normal',
  borderRadius: 4,
  borderColor: '#cccccc',
  borderWidth: 1,
  borderStyle: 'solid',
  width: '100%',
  height: 'auto'
};

const defaultCheckboxEditorOptions: CheckboxEditorOptions = {
  label: 'Checkbox Label',
  checked: false,
  name: 'checkbox_field',
  value: 'checkbox_value'
};

const defaultRadioEditorOptions: RadioEditorOptions = {
  label: 'Radio Label',
  options: ['Option 1', 'Option 2', 'Option 3'],
  name: 'radio_field',
  selected: 'Option 1',
  required: false,
  inline: false
};

const defaultLabelEditorOptions: LabelEditorOptions = {
  text: 'Label Text',
  for: 'input_id',
  fontSize: 14,
  fontWeight: 'normal',
  color: '#333'
};

// WooCommerce Layout Defaults
const defaultShippingAddressEditorOptions: ShippingAddressEditorOptions = {
  fullName: "John Doe",
  phone: "+1-555-123-4567",
  email: "john.doe@example.com",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "USA",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  textColor: "#333333",
  textAlign: "left",
  backgroundColor: "transparent",
  paddingTop: "8",
  paddingRight: "8",
  paddingBottom: "8",
  paddingLeft: "8",
};

const defaultBillingAddressEditorOptions: BillingAddressEditorOptions = {
  fullName: "John Doe",
  phone: "+1-555-123-4567",
  email: "john.doe@example.com",
  addressLine1: "123 Main Street",
  addressLine2: "Apt 4B",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "USA",
  fontFamily: "Arial, sans-serif",
  fontWeight: "normal",
  fontSize: "14px",
  textColor: "#333333",
  textAlign: "left",
  backgroundColor: "transparent",
  lineHeight: "1.5",
  letterSpacing: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px"
};

export const defaultTaxBillingEditorOptions: TaxBillingEditorOptions = {
  orderNumber: '',
  orderDate: '',
  orderSubtotal: '',
  orderShipping: '',
  orderDiscount: '',
  orderTax: '',
  orderTotal: '',
  taxRate: '8%',
  billingFirstName: '',
  billingLastName: '',
  billingAddress1: '',
  billingCity: '',
  billingState: '',
  billingPostcode: '',
  billingCountry: '',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
};

const defaultOrderItemsEditorOptions: OrderItemsEditorOptions = {
  orderNumber: "",
  orderDate: "",
  items: [],
  subtotal: "",
  discount: "",
  paymentMethod: "",
  total: "",
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
};

export const defaultEmailHeaderEditorOptions: EmailHeaderEditorOptions = {
  storeName: '{{store_name}}',
  showLogo: true,
  logoUrl: '',
  logoWidth: '150px',
  showTagline: true,
  tagline: '',
  backgroundColor: '#4CAF50',
  textColor: '#ffffff',
  padding: '20px',
  fontSize: '28px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  textAlign: 'center',
  taglineFontSize: '14px'
};

export const defaultEmailFooterEditorOptions: EmailFooterEditorOptions = {
  storeName: '{{store_name}}',
  showSocialMedia: true,
  showAddress: true,
  storeAddress: '{{store_address}}',
  showContact: true,
  contactEmail: '{{store_email}}',
  contactPhone: '{{store_phone}}',
  backgroundColor: '#333333',
  textColor: '#ffffff',
  linkColor: '#4CAF50',
  padding: '30px 20px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px'
};

export const defaultCtaButtonEditorOptions: CtaButtonEditorOptions = {
  buttonText: '',
  buttonUrl: '',
  alignment: 'center',
  backgroundColor: '#4CAF50',
  textColor: '#ffffff',
  hoverColor: '#45a049',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '5px',
  buttonPadding: '12px 30px',
  padding: '20px',
  minWidth: '200px'
};

export const defaultRelatedProductsEditorOptions: RelatedProductsEditorOptions = {
  title: '',
  productsToShow: 3,
  showImages: true,
  buttonText: 'View Product',
  backgroundColor: '#f9f9f9',
  titleColor: '#333',
  titleFontWeight: 'bold',
  priceColor: '#4CAF50',
  buttonColor: '#4CAF50',
  buttonHoverColor: '#45a049',
  padding: '20px',
  showCardShadow: true,
  cardShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  useManualData: false,
  p1_name: '', p1_price: '', p1_image: '', p1_url: '',
  p2_name: '', p2_price: '', p2_image: '', p2_url: '',
  p3_name: '', p3_price: '', p3_image: '', p3_url: '',
  p4_name: '', p4_price: '', p4_image: '', p4_url: '',
};

export const defaultOrderSubtotalEditorOptions: OrderSubtotalEditorOptions = {
  label: 'Subtotal',
  value: '{{order_subtotal}}',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
  spacing: 12
};

export const defaultOrderTotalEditorOptions: OrderTotalEditorOptions = {
  label: 'Total',
  value: '{{order_total}}',
  fontFamily: 'Arial, sans-serif',
  fontSize: '18px',
  textColor: '#000000',
  textAlign: 'left',
  backgroundColor: 'transparent',
  spacing: 12
};

export const defaultShippingMethodEditorOptions: ShippingMethodEditorOptions = {
  label: 'Shipping Method',
  value: '{{shipping_method}}',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
  spacing: 12
};

export const defaultPaymentMethodEditorOptions: PaymentMethodEditorOptions = {
  label: 'Payment Method',
  value: '{{payment_method}}',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
  spacing: 12
};

export const defaultCustomerNoteEditorOptions: CustomerNoteEditorOptions = {
  label: 'Customer Note',
  value: '{{customer_note}}',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  textColor: '#333333',
  textAlign: 'left',
  backgroundColor: 'transparent',
  spacing: 12
};


const initialState: WorkspaceState = {
  blocks: [],
  selectedBlockId: null,
  editorOpen: false,
  selectedColumnIndex: null,
  selectedBlockForEditor: null,
  selectedContentType: null,
  selectedWidgetIndex: null,

  // Basic Layout
  textEditorOptions: defaultTextEditorOptions,
  headingEditorOptions: defaultHeadingEditorOptions,
  socialIconsEditorOptions: defaultSocialIconsEditorOptions,
  buttonEditorOptions: defaultButtonEditorOptions,
  dividerEditorOptions: defaultDividerEditorOptions,
  imageEditorOptions: defaultImageEditorOptions,
  sectionEditorOptions: defaultSectionEditorOptions,
  spacerEditorOptions: defaultSpacerEditorOptions,
  linkEditorOptions: defaultLinkEditorOptions,
  linkBoxEditorOptions: defaultLinkBoxEditorOptions,
  imageBoxEditorOptions: defaultImageBoxEditorOptions,
  mapEditorOptions: defaultMapEditorOptions,
  iconEditorOptions: defaultIconEditorOptions,

  // Layout Block
  rowEditorOptions: defaultRowEditorOptions,
  containerEditorOptions: defaultContainerEditorOptions,
  groupEditorOptions: defaultGroupEditorOptions,

  // Extra Block
  socialFollowEditorOptions: defaultSocialFollowEditorOptions,
  videoEditorOptions: defaultVideoEditorOptions,
  codeEditorOptions: defaultCodeEditorOptions,
  countdownEditorOptions: defaultCountdownEditorOptions,
  progressBarEditorOptions: defaultProgressBarEditorOptions,
  productEditorOptions: defaultProductEditorOptions,
  promoCodeEditorOptions: defaultPromoCodeEditorOptions,
  priceEditorOptions: defaultPriceEditorOptions,
  testimonialEditorOptions: defaultTestimonialEditorOptions,
  navbarEditorOptions: defaultNavbarEditorOptions,
  cardEditorOptions: defaultCardEditorOptions,
  alertEditorOptions: defaultAlertEditorOptions,
  progressEditorOptions: defaultProgressEditorOptions,

  // Forms
  formEditorOptions: defaultFormEditorOptions,
  surveyEditorOptions: defaultSurveyEditorOptions,
  inputEditorOptions: defaultInputEditorOptions,
  textareaEditorOptions: defaultTextareaEditorOptions,
  selectEditorOptions: defaultSelectEditorOptions,
  checkboxEditorOptions: defaultCheckboxEditorOptions,
  radioEditorOptions: defaultRadioEditorOptions,
  labelEditorOptions: defaultLabelEditorOptions,

  // WooCommerce Layout
  shippingAddressEditorOptions: defaultShippingAddressEditorOptions,
  billingAddressEditorOptions: defaultBillingAddressEditorOptions,
  orderItemsEditorOptions: defaultOrderItemsEditorOptions,
  taxBillingEditorOptions: defaultTaxBillingEditorOptions,
  emailHeaderEditorOptions: defaultEmailHeaderEditorOptions,
  emailFooterEditorOptions: defaultEmailFooterEditorOptions,
  ctaButtonEditorOptions: defaultCtaButtonEditorOptions,
  relatedProductsEditorOptions: defaultRelatedProductsEditorOptions,
  orderSubtotalEditorOptions: defaultOrderSubtotalEditorOptions,
  orderTotalEditorOptions: defaultOrderTotalEditorOptions,
  shippingMethodEditorOptions: defaultShippingMethodEditorOptions,
  paymentMethodEditorOptions: defaultPaymentMethodEditorOptions,
  customerNoteEditorOptions: defaultCustomerNoteEditorOptions,

  isMobileView: false,
  previewMode: false,
  past: [],
  future: [],
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        state.future = [current(state.blocks), ...state.future];
        state.blocks = previous;
        state.past = newPast;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        state.past = [...state.past, current(state.blocks)];
        state.blocks = next;
        state.future = newFuture;
      }
    },
    addBlock: (state, action: PayloadAction<{ columns: number; type?: string; content?: string }>) => {
      state.past = [...state.past, current(state.blocks)];
      state.future = [];
      const blockId = `${Date.now().toString()}-${Math.random().toString(36).substr(2, 9)}`;
      const columns = Array.from({ length: action.payload.columns }, () => (
        {
          id: `${Date.now().toString()}-${Math.random().toString(36).substr(2, 9)}`,
          style: { ...defaultColumnStyle },
          contentType: null,
          contentData: null,
          widgetContents: [],

          // Basic Layout
          textEditorOptions: { ...defaultTextEditorOptions },
          headingEditorOptions: { ...defaultHeadingEditorOptions },
          socialIconsEditorOptions: { ...defaultSocialIconsEditorOptions },
          dividerEditorOptions: { ...defaultDividerEditorOptions },
          imageEditorOptions: { ...defaultImageEditorOptions },
          buttonEditorOptions: { ...defaultButtonEditorOptions },
          sectionEditorOptions: { ...defaultSectionEditorOptions },
          spacerEditorOptions: { ...defaultSpacerEditorOptions },
          linkEditorOptions: { ...defaultLinkEditorOptions },
          linkBoxEditorOptions: { ...defaultLinkBoxEditorOptions },
          imageBoxEditorOptions: { ...defaultImageBoxEditorOptions },
          mapEditorOptions: { ...defaultMapEditorOptions },
          iconEditorOptions: { ...defaultIconEditorOptions },

          // Layout Block
          rowEditorOptions: { ...defaultRowEditorOptions },
          containerEditorOptions: { ...defaultContainerEditorOptions },
          groupEditorOptions: { ...defaultGroupEditorOptions },

          // Extra Block
          socialFollowEditorOptions: { ...defaultSocialFollowEditorOptions },
          videoEditorOptions: { ...defaultVideoEditorOptions },
          codeEditorOptions: { ...defaultCodeEditorOptions },
          countdownEditorOptions: { ...defaultCountdownEditorOptions },
          progressBarEditorOptions: { ...defaultProgressBarEditorOptions },
          productEditorOptions: { ...defaultProductEditorOptions },
          promoCodeEditorOptions: { ...defaultPromoCodeEditorOptions },
          priceEditorOptions: { ...defaultPriceEditorOptions },
          testimonialEditorOptions: { ...defaultTestimonialEditorOptions },
          navbarEditorOptions: { ...defaultNavbarEditorOptions },
          cardEditorOptions: { ...defaultCardEditorOptions },
          alertEditorOptions: { ...defaultAlertEditorOptions },
          progressEditorOptions: { ...defaultProgressEditorOptions },

          // Forms
          formEditorOptions: { ...defaultFormEditorOptions },
          surveyEditorOptions: { ...defaultSurveyEditorOptions },
          inputEditorOptions: { ...defaultInputEditorOptions },
          textareaEditorOptions: { ...defaultTextareaEditorOptions },
          selectEditorOptions: { ...defaultSelectEditorOptions },
          checkboxEditorOptions: { ...defaultCheckboxEditorOptions },
          radioEditorOptions: { ...defaultRadioEditorOptions },
          labelEditorOptions: { ...defaultLabelEditorOptions },

          // WooCommerce Layout
          shippingAddressEditorOptions: { ...defaultShippingAddressEditorOptions },
          billingAddressEditorOptions: { ...defaultBillingAddressEditorOptions },
          orderItemsEditorOptions: { ...defaultOrderItemsEditorOptions },
          taxBillingEditorOptions: { ...defaultTaxBillingEditorOptions },
          emailHeaderEditorOptions: { ...defaultEmailHeaderEditorOptions },
          emailFooterEditorOptions: { ...defaultEmailFooterEditorOptions },
          ctaButtonEditorOptions: { ...defaultCtaButtonEditorOptions },
          relatedProductsEditorOptions: { ...defaultRelatedProductsEditorOptions },
          orderSubtotalEditorOptions: { ...defaultOrderSubtotalEditorOptions },
          orderTotalEditorOptions: { ...defaultOrderTotalEditorOptions },
          shippingMethodEditorOptions: { ...defaultShippingMethodEditorOptions },
          paymentMethodEditorOptions: { ...defaultPaymentMethodEditorOptions },
          customerNoteEditorOptions: { ...defaultCustomerNoteEditorOptions },
        }
      ));
      const newBlock: DroppedBlock = {
        id: blockId,
        columns,
        style: { ...defaultBlockStyle },
      };
      state.blocks.push(newBlock);
    },

    copyBlock: (state, action: PayloadAction<string | null>) => {
      state.past = [...state.past, current(state.blocks)];
      state.future = [];
      const blockToCopy = state.blocks.find((block) => block.id === action.payload);
      if (blockToCopy && action.payload) {
        const newBlockId = `${Date.now().toString()}-${Math.random().toString(36).substr(2, 9)}`;
        const newColumns = blockToCopy.columns.map((col) => ({
          id: `${Date.now().toString()}-${Math.random().toString(36).substr(2, 9)}`,
          style: { ...col.style },
          contentType: col.contentType,
          contentData: col.contentData,
          widgetContents: [...col.widgetContents],

          // Basic Layout
          sectionEditorOptions: { ...col.sectionEditorOptions },
          spacerEditorOptions: { ...col.spacerEditorOptions },
          linkEditorOptions: { ...col.linkEditorOptions },
          linkBoxEditorOptions: { ...col.linkBoxEditorOptions },
          imageBoxEditorOptions: { ...col.imageBoxEditorOptions },
          mapEditorOptions: { ...col.mapEditorOptions },
          iconEditorOptions: { ...col.iconEditorOptions },
          textEditorOptions: { ...col.textEditorOptions },
          headingEditorOptions: { ...col.headingEditorOptions },
          socialIconsEditorOptions: { ...col.socialIconsEditorOptions },
          dividerEditorOptions: { ...col.dividerEditorOptions },
          imageEditorOptions: { ...col.imageEditorOptions },
          buttonEditorOptions: { ...col.buttonEditorOptions },

          // Layout Block
          rowEditorOptions: { ...col.rowEditorOptions },
          containerEditorOptions: { ...col.containerEditorOptions },
          groupEditorOptions: { ...col.groupEditorOptions },

          // Extra Block
          socialFollowEditorOptions: { ...col.socialFollowEditorOptions },
          videoEditorOptions: { ...col.videoEditorOptions },
          codeEditorOptions: { ...col.codeEditorOptions },
          countdownEditorOptions: { ...col.countdownEditorOptions },
          progressBarEditorOptions: { ...col.progressBarEditorOptions },
          productEditorOptions: { ...col.productEditorOptions },
          promoCodeEditorOptions: { ...col.promoCodeEditorOptions },
          priceEditorOptions: { ...col.priceEditorOptions },
          testimonialEditorOptions: { ...col.testimonialEditorOptions },
          navbarEditorOptions: { ...col.navbarEditorOptions },
          cardEditorOptions: { ...col.cardEditorOptions },
          alertEditorOptions: { ...col.alertEditorOptions },
          progressEditorOptions: { ...col.progressEditorOptions },

          // Forms
          formEditorOptions: { ...col.formEditorOptions },
          surveyEditorOptions: { ...col.surveyEditorOptions },
          inputEditorOptions: { ...col.inputEditorOptions },
          textareaEditorOptions: { ...col.textareaEditorOptions },
          selectEditorOptions: { ...col.selectEditorOptions },
          checkboxEditorOptions: { ...col.checkboxEditorOptions },
          radioEditorOptions: { ...col.radioEditorOptions },
          labelEditorOptions: { ...col.labelEditorOptions },

          // WooCommerce Layout
          shippingAddressEditorOptions: { ...col.shippingAddressEditorOptions },
          billingAddressEditorOptions: { ...col.billingAddressEditorOptions },
          orderItemsEditorOptions: { ...col.orderItemsEditorOptions },
          taxBillingEditorOptions: { ...col.taxBillingEditorOptions },
          emailHeaderEditorOptions: { ...col.emailHeaderEditorOptions },
          emailFooterEditorOptions: { ...col.emailFooterEditorOptions },
          ctaButtonEditorOptions: { ...col.ctaButtonEditorOptions },
          relatedProductsEditorOptions: { ...col.relatedProductsEditorOptions },
          orderSubtotalEditorOptions: { ...col.orderSubtotalEditorOptions },
          orderTotalEditorOptions: { ...col.orderTotalEditorOptions },
          shippingMethodEditorOptions: { ...col.shippingMethodEditorOptions },
          paymentMethodEditorOptions: { ...col.paymentMethodEditorOptions },
          customerNoteEditorOptions: { ...col.customerNoteEditorOptions },
        }));
        state.blocks.push({
          id: newBlockId,
          columns: newColumns,
          style: { ...blockToCopy.style },
        });
      }
    },

    deleteBlock: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        state.past = [...state.past, current(state.blocks)];
        state.future = [];
        state.blocks = state.blocks.filter((block) => block.id !== action.payload);
        if (state.selectedBlockId === action.payload) {
          state.selectedBlockId = null;
        }
        if (state.selectedBlockForEditor === action.payload) {
          state.editorOpen = false;
          state.selectedColumnIndex = null;
          state.selectedBlockForEditor = null;
        }
      }
    },

    deleteColumnContent: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; widgetIndex: number }>) => {
      state.past = [...state.past, current(state.blocks)];
      state.future = [];
      const { blockId, columnIndex, widgetIndex } = action.payload;
      if (blockId) {
        const block = state.blocks.find((b) => b.id === blockId);
        if (block && block.columns[columnIndex] && widgetIndex !== null) {
          block.columns[columnIndex].widgetContents.splice(widgetIndex, 1);
          if (block.columns[columnIndex].widgetContents.length === 0) {
            block.columns[columnIndex].contentType = null;
            block.columns[columnIndex].contentData = null;
            block.columns[columnIndex].style.height = 'auto';
          }
          if (state.selectedBlockForEditor === blockId && state.selectedColumnIndex === columnIndex && state.selectedWidgetIndex === widgetIndex) {
            state.editorOpen = false;
            state.selectedBlockForEditor = null;
            state.selectedColumnIndex = null;
            state.selectedWidgetIndex = null;
          }
        }
      }
    },

    reorderBlocks: (state, action: PayloadAction<{ sourceId: string; targetId: string }>) => {
      // Save history before reordering
      state.past = [...state.past, current(state.blocks)];
      state.future = [];
      const { sourceId, targetId } = action.payload;
      const sourceIndex = state.blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = state.blocks.findIndex((block) => block.id === targetId);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const [movedBlock] = state.blocks.splice(sourceIndex, 1);
        state.blocks.splice(targetIndex, 0, movedBlock);
      }
    },

    setMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobileView = action.payload;
    },

    selectBlock: (state, action: PayloadAction<string | null>) => {
      state.selectedBlockId = action.payload;
    },

    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },

    setSelectedBlockId: (state, action: PayloadAction<string | null>) => {
      state.selectedBlockId = action.payload;
    },

    openEditor: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number | null; contentType?: WidgetContentType | null; widgetIndex?: number | null }>) => {
      state.editorOpen = true;
      state.selectedBlockForEditor = action.payload.blockId;
      state.selectedColumnIndex = action.payload.columnIndex;
      state.selectedContentType = action.payload.contentType !== undefined
        ? action.payload.contentType
        : (
          action.payload.columnIndex !== null && action.payload.blockId
            ? state.blocks.find((b) => b.id === action.payload.blockId)?.columns[action.payload.columnIndex]?.contentType || null
            : null
        );
      state.selectedWidgetIndex = action.payload.widgetIndex !== undefined ? action.payload.widgetIndex : null;

      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null) {
        const block = state.blocks.find((b) => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];

        if (column) {
          // Handle Select Component special case (JSON parsing)
          if (state.selectedContentType === 'select' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const contentData = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (contentData) {
              try {
                const parsed = JSON.parse(contentData);
                state.selectEditorOptions = parsed;
              } catch (e) {
                console.error("Error parsing select content data:", e);
                console.error("Problematic contentData:", contentData);
                // Fallback to column options or default
                if (column.selectEditorOptions) {
                  state.selectEditorOptions = column.selectEditorOptions;
                } else {
                  state.selectEditorOptions = defaultSelectEditorOptions;
                }
              }
            } else if (column.selectEditorOptions) {
              state.selectEditorOptions = column.selectEditorOptions;
            } else {
              state.selectEditorOptions = defaultSelectEditorOptions;
            }
          }
          // Handle Product Component
          else if (state.selectedContentType === 'product' && column.productEditorOptions) {
            state.productEditorOptions = column.productEditorOptions;
          }
          // Handle WooCommerce Components
          else if (state.selectedContentType === 'emailHeader' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                state.emailHeaderEditorOptions = JSON.parse(data);
              } catch (e) {
                state.emailHeaderEditorOptions = defaultEmailHeaderEditorOptions;
              }
            } else if (column.emailHeaderEditorOptions) {
              state.emailHeaderEditorOptions = column.emailHeaderEditorOptions;
            } else {
              state.emailHeaderEditorOptions = defaultEmailHeaderEditorOptions;
            }
          }
          else if (state.selectedContentType === 'emailFooter' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                state.emailFooterEditorOptions = JSON.parse(data);
              } catch (e) {
                state.emailFooterEditorOptions = defaultEmailFooterEditorOptions;
              }
            } else if (column.emailFooterEditorOptions) {
              state.emailFooterEditorOptions = column.emailFooterEditorOptions;
            } else {
              state.emailFooterEditorOptions = defaultEmailFooterEditorOptions;
            }
          }
          else if (state.selectedContentType === 'ctaButton' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                state.ctaButtonEditorOptions = JSON.parse(data);
              } catch (e) {
                state.ctaButtonEditorOptions = defaultCtaButtonEditorOptions;
              }
            } else if (column.ctaButtonEditorOptions) {
              state.ctaButtonEditorOptions = column.ctaButtonEditorOptions;
            } else {
              state.ctaButtonEditorOptions = defaultCtaButtonEditorOptions;
            }
          }
          else if (state.selectedContentType === 'relatedProducts' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                state.relatedProductsEditorOptions = JSON.parse(data);
              } catch (e) {
                state.relatedProductsEditorOptions = defaultRelatedProductsEditorOptions;
              }
            } else if (column.relatedProductsEditorOptions) {
              state.relatedProductsEditorOptions = column.relatedProductsEditorOptions;
            } else {
              state.relatedProductsEditorOptions = defaultRelatedProductsEditorOptions;
            }
          }
          else if (state.selectedContentType === 'taxBilling' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                state.taxBillingEditorOptions = JSON.parse(data);
              } catch (e) {
                state.taxBillingEditorOptions = defaultTaxBillingEditorOptions;
              }
            } else if (column.taxBillingEditorOptions) {
              state.taxBillingEditorOptions = column.taxBillingEditorOptions;
            } else {
              state.taxBillingEditorOptions = defaultTaxBillingEditorOptions;
            }
          }
          else if (state.selectedContentType === 'orderItems' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                // If data is empty object (which JSON.parse('{}') returns), we should merge with default
                const parsed = JSON.parse(data);
                if (Object.keys(parsed).length === 0) {
                  state.orderItemsEditorOptions = defaultOrderItemsEditorOptions;
                } else {
                  state.orderItemsEditorOptions = parsed;
                }
              } catch (e) {
                state.orderItemsEditorOptions = defaultOrderItemsEditorOptions;
              }
            } else if (column.orderItemsEditorOptions) {
              state.orderItemsEditorOptions = column.orderItemsEditorOptions;
            } else {
              state.orderItemsEditorOptions = defaultOrderItemsEditorOptions;
            }
          }
          // Handle Code Component (CSS/HTML Editor)
          else if (state.selectedContentType === 'code' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                const parsed = JSON.parse(data);
                state.codeEditorOptions = { ...defaultCodeEditorOptions, ...parsed };
              } catch (e) {
                state.codeEditorOptions = defaultCodeEditorOptions;
              }
            }
            else if (column.codeEditorOptions) {
              state.codeEditorOptions = { ...defaultCodeEditorOptions, ...column.codeEditorOptions };
            } else {
              state.codeEditorOptions = defaultCodeEditorOptions;
            }
          }
          // Handle Price Component
          else if (state.selectedContentType === 'price' && state.selectedWidgetIndex !== null && column.widgetContents[state.selectedWidgetIndex]) {
            const data = column.widgetContents[state.selectedWidgetIndex].contentData;
            if (data) {
              try {
                const parsed = JSON.parse(data);
                state.priceEditorOptions = { ...defaultPriceEditorOptions, ...parsed };
              } catch (e) {
                state.priceEditorOptions = defaultPriceEditorOptions;
              }
            } else if (column.priceEditorOptions) {
              state.priceEditorOptions = { ...defaultPriceEditorOptions, ...column.priceEditorOptions };
            } else {
              state.priceEditorOptions = defaultPriceEditorOptions;
            }
          }
        }
      }
    },

    closeEditor: (state) => {
      state.editorOpen = false;
      state.selectedColumnIndex = null;
      state.selectedBlockForEditor = null;
      state.selectedContentType = null;
    },

    clearBlocks: (state) => {
      state.past = [...state.past, current(state.blocks)];
      state.future = [];
      state.blocks = [];
      state.selectedBlockId = null;
      state.editorOpen = false;
      state.selectedColumnIndex = null;
      state.selectedBlockForEditor = null;
    },

    updateBlockHeight: (state, action: PayloadAction<{ blockId: string | null; height: number | 'auto' }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block) {
          block.style.height = action.payload.height;
        }
      }
    },

    updateSelectedColumnIndex: (state, action: PayloadAction<number | null>) => {
      state.selectedColumnIndex = action.payload;
    },

    updateColumnBgColor: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.bgColor = action.payload.color;
        }
      }
    },

    updateColumnBorderColor: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderTopColor = action.payload.color;
          block.columns[action.payload.columnIndex].style.borderBottomColor = action.payload.color;
          block.columns[action.payload.columnIndex].style.borderLeftColor = action.payload.color;
          block.columns[action.payload.columnIndex].style.borderRightColor = action.payload.color;
        }
      }
    },

    updateColumnPadding: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        side: 'top' | 'right' | 'bottom' | 'left';
        value: number;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.padding[action.payload.side] = action.payload.value;
        }
      }
    },

    updateColumnBorderStyle: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; style: 'solid' | 'dashed' | 'dotted' }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderStyle = action.payload.style;
        }
      }
    },

    updateColumnBorderTopSize: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; size: number }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderTopSize = action.payload.size;
        }
      }
    },

    updateColumnBorderBottomSize: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; size: number }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderBottomSize = action.payload.size;
        }
      }
    },

    updateColumnBorderLeftSize: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; size: number }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderLeftSize = action.payload.size;
        }
      }
    },

    updateColumnBorderRightSize: (state, action: PayloadAction<{ blockId: string | null; columnIndex: number; size: number }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderRightSize = action.payload.size;
        }
      }
    },

    updateColumnHeight: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; height: number | 'auto' }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.height = action.payload.height;
        }
      }
    },

    updateTextEditorOptions: (state, action: PayloadAction<Partial<TextEditorOptions>>) => {
      // This is a global update - update the global state
      state.textEditorOptions = { ...state.textEditorOptions, ...action.payload };

      // Also update the selected column if there is one
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column && column.contentType === 'text') {
          column.textEditorOptions = { ...column.textEditorOptions, ...action.payload };
          if (column.widgetContents[state.selectedWidgetIndex]) {
            column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.textEditorOptions);
          }
        }
      }
    },

    resetTextEditorOptions: (state) => {
      state.textEditorOptions = { ...defaultTextEditorOptions };
    },

    addColumnContent: (state, action: PayloadAction<{
      blockId: string | null;
      columnIndex: number;
      contentType: WidgetContentType;
      contentData: string | null;
    }>) => {
      if (action.payload.blockId) {
        // Save history before adding content
        state.past = [...state.past, current(state.blocks)];
        state.future = [];
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          const column = block.columns[action.payload.columnIndex];
          const newWidgetIndex = column.widgetContents.length;
          column.widgetContents.push({
            contentType: action.payload.contentType,
            contentData: action.payload.contentData || null
          });
          // CRITICAL FIX: Set the column's main content type so usage elsewhere (e.g. reducers, openEditor) works.
          // This assumes a column primarily acts as a container for this type, or we update it to the latest.
          column.contentType = action.payload.contentType;

          column.style.height = 'auto';
          block.style = { ...neutralBlockStyle };

          // Initialize widget-specific options based on content type
          switch (action.payload.contentType) {
            case 'heading':
              column.headingEditorOptions = {
                ...defaultHeadingEditorOptions,
                headingType: 'h1',
                fontSize: 22,
              };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.headingEditorOptions);
              break;
            case 'text':
              column.textEditorOptions = { ...defaultTextEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.textEditorOptions);
              break;
            case 'button':
              column.buttonEditorOptions = { ...defaultButtonEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.buttonEditorOptions);
              break;
            case 'image':
              column.imageEditorOptions = { ...defaultImageEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.imageEditorOptions);
              break;
            case 'divider':
              column.dividerEditorOptions = { ...defaultDividerEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.dividerEditorOptions);
              break;
            case 'socialIcons':
              column.socialIconsEditorOptions = { ...defaultSocialIconsEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.socialIconsEditorOptions);
              break;
            case 'shippingAddress':
              column.shippingAddressEditorOptions = { ...defaultShippingAddressEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.shippingAddressEditorOptions);
              break;
            case 'billingAddress':
              column.billingAddressEditorOptions = { ...defaultBillingAddressEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.billingAddressEditorOptions);
              break;
            case 'orderItems':
              column.orderItemsEditorOptions = { ...defaultOrderItemsEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.orderItemsEditorOptions);
              break;
            case 'taxBilling':
              column.taxBillingEditorOptions = { ...defaultTaxBillingEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.taxBillingEditorOptions);
              break;
            case 'section':
              column.sectionEditorOptions = { ...defaultSectionEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.sectionEditorOptions);
              break;
            case 'spacer':
              column.spacerEditorOptions = { ...defaultSpacerEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.spacerEditorOptions);
              break;
            case 'link':
              column.linkEditorOptions = { ...defaultLinkEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.linkEditorOptions);
              break;
            case 'linkBox':
              column.linkBoxEditorOptions = { ...defaultLinkBoxEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.linkBoxEditorOptions);
              break;
            case 'imageBox':
              column.imageBoxEditorOptions = { ...defaultImageBoxEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.imageBoxEditorOptions);
              break;
            case 'map':
              column.mapEditorOptions = { ...defaultMapEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.mapEditorOptions);
              break;
            case 'icon':
              column.iconEditorOptions = { ...defaultIconEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.iconEditorOptions);
              break;
            case 'row':
              column.rowEditorOptions = { ...defaultRowEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.rowEditorOptions);
              break;
            case 'container':
              column.containerEditorOptions = { ...defaultContainerEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.containerEditorOptions);
              break;
            case 'group':
              column.groupEditorOptions = { ...defaultGroupEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.groupEditorOptions);
              break;
            case 'socialFollow':
              column.socialFollowEditorOptions = { ...defaultSocialFollowEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.socialFollowEditorOptions);
              break;
            case 'video':
              column.videoEditorOptions = { ...defaultVideoEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.videoEditorOptions);
              break;
            case 'code':
              column.codeEditorOptions = { ...defaultCodeEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.codeEditorOptions);
              break;
            case 'countdown':
              column.countdownEditorOptions = { ...defaultCountdownEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.countdownEditorOptions);
              break;
            case 'progressBar':
              column.progressBarEditorOptions = { ...defaultProgressBarEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.progressBarEditorOptions);
              break;
            case 'product':
              column.productEditorOptions = { ...defaultProductEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.productEditorOptions);
              break;
            case 'promoCode':
              column.promoCodeEditorOptions = { ...defaultPromoCodeEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.promoCodeEditorOptions);
              break;
            case 'price':
              column.priceEditorOptions = { ...defaultPriceEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.priceEditorOptions);
              break;
            case 'testimonial':
              column.testimonialEditorOptions = { ...defaultTestimonialEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.testimonialEditorOptions);
              break;
            case 'navbar':
              column.navbarEditorOptions = { ...defaultNavbarEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.navbarEditorOptions);
              break;
            case 'card':
              column.cardEditorOptions = { ...defaultCardEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.cardEditorOptions);
              break;
            case 'alert':
              column.alertEditorOptions = { ...defaultAlertEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.alertEditorOptions);
              break;
            case 'progress':
              column.progressEditorOptions = { ...defaultProgressEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.progressEditorOptions);
              break;
            case 'form':
              column.formEditorOptions = { ...defaultFormEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.formEditorOptions);
              break;
            case 'survey':
              column.surveyEditorOptions = { ...defaultSurveyEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.surveyEditorOptions);
              break;
            case 'input':
              column.inputEditorOptions = { ...defaultInputEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.inputEditorOptions);
              break;
            case 'textarea':
              column.textareaEditorOptions = { ...defaultTextareaEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.textareaEditorOptions);
              break;
            case 'select':
              column.selectEditorOptions = { ...defaultSelectEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.selectEditorOptions);
              break;
            case 'checkbox':
              column.checkboxEditorOptions = { ...defaultCheckboxEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.checkboxEditorOptions);
              break;
            case 'relatedProducts':
              column.relatedProductsEditorOptions = { ...defaultRelatedProductsEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.relatedProductsEditorOptions);
              break;
            case 'orderSubtotal':
              column.orderSubtotalEditorOptions = { ...defaultOrderSubtotalEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.orderSubtotalEditorOptions);
              break;
            case 'orderTotal':
              column.orderTotalEditorOptions = { ...defaultOrderTotalEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.orderTotalEditorOptions);
              break;
            case 'shippingMethod':
              column.shippingMethodEditorOptions = { ...defaultShippingMethodEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.shippingMethodEditorOptions);
              break;
            case 'paymentMethod':
              column.paymentMethodEditorOptions = { ...defaultPaymentMethodEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.paymentMethodEditorOptions);
              break;
            case 'customerNote':
              column.customerNoteEditorOptions = { ...defaultCustomerNoteEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.customerNoteEditorOptions);
              break;
            case 'radio':
              column.radioEditorOptions = { ...defaultRadioEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.radioEditorOptions);
              break;
            case 'label':
              column.labelEditorOptions = { ...defaultLabelEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.labelEditorOptions);
              break;
            case 'emailHeader':
              column.emailHeaderEditorOptions = { ...defaultEmailHeaderEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.emailHeaderEditorOptions);
              break;
            case 'emailFooter':
              column.emailFooterEditorOptions = { ...defaultEmailFooterEditorOptions };
              column.widgetContents[newWidgetIndex].contentData = JSON.stringify(column.emailFooterEditorOptions);
              break;
          }

          state.editorOpen = true;
          state.selectedBlockForEditor = action.payload.blockId;
          state.selectedColumnIndex = action.payload.columnIndex;
          state.selectedContentType = action.payload.contentType;
          state.selectedWidgetIndex = newWidgetIndex;
        }
      }
    },

    updateWidgetContentData: (state, action: PayloadAction<{
      blockId: string | null;
      columnIndex: number;
      widgetIndex: number;
      data: string;
    }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex] && block.columns[action.payload.columnIndex].widgetContents[action.payload.widgetIndex]) {
          block.columns[action.payload.columnIndex].widgetContents[action.payload.widgetIndex].contentData = action.payload.data;
        }
      }
    },

    updateColumnContentData: (state, action: PayloadAction<{
      blockId: string | null;
      columnIndex: number;
      data: string;
    }>) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].contentData = action.payload.data;
        }
      }
    },



    // ============ BASIC LAYOUT WIDGET OPTIONS ============
    updateSectionEditorOptions: (state, action: PayloadAction<Partial<SectionEditorOptions>>) => {
      state.sectionEditorOptions = { ...state.sectionEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'section') {
          column.sectionEditorOptions = { ...column.sectionEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.sectionEditorOptions);
        }
      }
    },

    updateSpacerEditorOptions: (state, action: PayloadAction<Partial<SpacerEditorOptions>>) => {
      state.spacerEditorOptions = { ...state.spacerEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'spacer') {
          column.spacerEditorOptions = { ...column.spacerEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.spacerEditorOptions);
        }
      }
    },

    updateLinkEditorOptions: (state, action: PayloadAction<Partial<LinkEditorOptions>>) => {
      state.linkEditorOptions = { ...state.linkEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'link') {
          column.linkEditorOptions = { ...column.linkEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.linkEditorOptions);
        }
      }
    },

    updateLinkBoxEditorOptions: (state, action: PayloadAction<Partial<LinkBoxEditorOptions>>) => {
      state.linkBoxEditorOptions = { ...state.linkBoxEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'linkBox') {
          column.linkBoxEditorOptions = { ...column.linkBoxEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.linkBoxEditorOptions);
        }
      }
    },

    updateImageBoxEditorOptions: (state, action: PayloadAction<Partial<ImageBoxEditorOptions>>) => {
      state.imageBoxEditorOptions = { ...state.imageBoxEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'imageBox') {
          column.imageBoxEditorOptions = { ...column.imageBoxEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.imageBoxEditorOptions);
        }
      }
    },

    updateMapEditorOptions: (state, action: PayloadAction<Partial<MapEditorOptions>>) => {
      state.mapEditorOptions = { ...state.mapEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'map') {
          column.mapEditorOptions = { ...column.mapEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.mapEditorOptions);
        }
      }
    },

    updateIconEditorOptions: (state, action: PayloadAction<Partial<IconEditorOptions>>) => {
      state.iconEditorOptions = { ...state.iconEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'icon') {
          column.iconEditorOptions = { ...column.iconEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.iconEditorOptions);
        }
      }
    },

    updateColumnTextEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<TextEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].textEditorOptions = {
            ...block.columns[action.payload.columnIndex].textEditorOptions,
            ...action.payload.options,
          };
        }
      }
    },

    updateHeadingEditorOptions: (state, action: PayloadAction<Partial<HeadingEditorOptions>>) => {
      state.headingEditorOptions = { ...state.headingEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'heading') {
          column.headingEditorOptions = { ...column.headingEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.headingEditorOptions);
        }
      }
    },

    updateColumnHeadingEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<HeadingEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].headingEditorOptions = {
            ...(block.columns[action.payload.columnIndex].headingEditorOptions || defaultHeadingEditorOptions),
            ...action.payload.options,
          };
        }
      }
    },

    updateSocialIconsEditorOptions: (state, action: PayloadAction<Partial<SocialIconsEditorOptions>>) => {
      state.socialIconsEditorOptions = { ...state.socialIconsEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'socialIcons') {
          column.socialIconsEditorOptions = { ...column.socialIconsEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.socialIconsEditorOptions);
        }
      }
    },

    updateColumnSocialIconsEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<SocialIconsEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].socialIconsEditorOptions = {
            ...block.columns[action.payload.columnIndex].socialIconsEditorOptions,
            ...action.payload.options,
          };
        }
      }
    },

    updateButtonEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<ButtonEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].buttonEditorOptions = {
            ...block.columns[action.payload.columnIndex].buttonEditorOptions,
            ...action.payload.options,
          };

          // Update the widget content data
          if (state.selectedWidgetIndex !== null) {
            const widgetContent = block.columns[action.payload.columnIndex].widgetContents[state.selectedWidgetIndex];
            if (widgetContent && widgetContent.contentType === 'button') {
              widgetContent.contentData = JSON.stringify(block.columns[action.payload.columnIndex].buttonEditorOptions);
            }
          }
        }
      }
    },

    updateDividerEditorOptions: (state, action: PayloadAction<Partial<DividerEditorOptions>>) => {
      state.dividerEditorOptions = { ...state.dividerEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'divider') {
          column.dividerEditorOptions = { ...column.dividerEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.dividerEditorOptions);
        }
      }
    },

    updateColumnDividerEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<DividerEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex] && state.selectedWidgetIndex !== null) {
          const column = block.columns[action.payload.columnIndex];
          const widgetContent = column.widgetContents[state.selectedWidgetIndex];
          if (widgetContent && widgetContent.contentType === 'divider') {
            column.dividerEditorOptions = { ...column.dividerEditorOptions, ...action.payload.options };
            widgetContent.contentData = JSON.stringify(column.dividerEditorOptions);
          }
        }
      }
    },

    updateImageEditorOptions: (state, action: PayloadAction<Partial<ImageEditorOptions>>) => {
      state.imageEditorOptions = { ...state.imageEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'image') {
          column.imageEditorOptions = { ...column.imageEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.imageEditorOptions);
        }
      }
    },

    updateColumnImageEditorOptions: (
      state,
      action: PayloadAction<{
        blockId: string | null;
        columnIndex: number;
        options: Partial<ImageEditorOptions>;
      }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].imageEditorOptions = {
            ...block.columns[action.payload.columnIndex].imageEditorOptions || defaultImageEditorOptions,
            ...action.payload.options,
          };
        }
      }
    },

    // ============ LAYOUT BLOCK WIDGET OPTIONS ============
    updateRowEditorOptions: (state, action: PayloadAction<Partial<RowEditorOptions>>) => {
      state.rowEditorOptions = { ...state.rowEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'row') {
          column.rowEditorOptions = { ...column.rowEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.rowEditorOptions);
        }
      }
    },

    updateContainerEditorOptions: (state, action: PayloadAction<Partial<ContainerEditorOptions>>) => {
      state.containerEditorOptions = { ...state.containerEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'container') {
          column.containerEditorOptions = { ...column.containerEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.containerEditorOptions);
        }
      }
    },

    updateGroupEditorOptions: (state, action: PayloadAction<Partial<GroupEditorOptions>>) => {
      state.groupEditorOptions = { ...state.groupEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'group') {
          column.groupEditorOptions = { ...column.groupEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.groupEditorOptions);
        }
      }
    },

    // ============ EXTRA BLOCK WIDGET OPTIONS ============
    updateSocialFollowEditorOptions: (state, action: PayloadAction<Partial<SocialFollowEditorOptions>>) => {
      state.socialFollowEditorOptions = { ...state.socialFollowEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'socialFollow') {
          column.socialFollowEditorOptions = { ...column.socialFollowEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.socialFollowEditorOptions);
        }
      }
    },

    updateVideoEditorOptions: (state, action: PayloadAction<Partial<VideoEditorOptions>>) => {
      state.videoEditorOptions = { ...state.videoEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'video') {
          column.videoEditorOptions = { ...column.videoEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.videoEditorOptions);
        }
      }
    },

    updateCodeEditorOptions: (state, action: PayloadAction<Partial<CodeEditorOptions>>) => {
      state.codeEditorOptions = { ...state.codeEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];

        if (widget && widget.contentType === 'code') {
          widget.contentData = JSON.stringify(state.codeEditorOptions);
        }
      }
    },

    updateCountdownEditorOptions: (state, action: PayloadAction<Partial<CountdownEditorOptions>>) => {
      state.countdownEditorOptions = { ...state.countdownEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'countdown') {
          column.countdownEditorOptions = { ...column.countdownEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.countdownEditorOptions);
        }
      }
    },

    updateProgressBarEditorOptions: (state, action: PayloadAction<Partial<ProgressBarEditorOptions>>) => {
      state.progressBarEditorOptions = { ...state.progressBarEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'progressBar') {
          column.progressBarEditorOptions = { ...column.progressBarEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.progressBarEditorOptions);
        }
      }
    },

    updateProductEditorOptions: (state, action: PayloadAction<Partial<ProductEditorOptions>>) => {
      state.productEditorOptions = { ...state.productEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'product') {
          column.productEditorOptions = { ...column.productEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.productEditorOptions);
        }
      }
    },

    updatePromoCodeEditorOptions: (state, action: PayloadAction<Partial<PromoCodeEditorOptions>>) => {
      state.promoCodeEditorOptions = { ...state.promoCodeEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'promoCode') {
          column.promoCodeEditorOptions = { ...column.promoCodeEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.promoCodeEditorOptions);
        }
      }
    },

    updatePriceEditorOptions: (state, action: PayloadAction<Partial<PriceEditorOptions>>) => {
      state.priceEditorOptions = { ...state.priceEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];


        if (widget && widget.contentType === 'price') {
          // Log before saving
          console.log('Reducer: Saving price options to contentData:', state.priceEditorOptions);
          widget.contentData = JSON.stringify(state.priceEditorOptions);
        }
      }
    },

    updateTestimonialEditorOptions: (state, action: PayloadAction<Partial<TestimonialEditorOptions>>) => {
      state.testimonialEditorOptions = { ...state.testimonialEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'testimonial') {
          column.testimonialEditorOptions = { ...column.testimonialEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.testimonialEditorOptions);
        }
      }
    },

    updateNavbarEditorOptions: (state, action: PayloadAction<Partial<NavbarEditorOptions>>) => {
      state.navbarEditorOptions = { ...state.navbarEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'navbar') {
          column.navbarEditorOptions = { ...column.navbarEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.navbarEditorOptions);
        }
      }
    },

    updateCardEditorOptions: (state, action: PayloadAction<Partial<CardEditorOptions>>) => {
      state.cardEditorOptions = { ...state.cardEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'card') {
          column.cardEditorOptions = { ...column.cardEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.cardEditorOptions);
        }
      }
    },

    updateAlertEditorOptions: (state, action: PayloadAction<Partial<AlertEditorOptions>>) => {
      state.alertEditorOptions = { ...state.alertEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'alert') {
          column.alertEditorOptions = { ...column.alertEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.alertEditorOptions);
        }
      }
    },

    updateProgressEditorOptions: (state, action: PayloadAction<Partial<ProgressEditorOptions>>) => {
      state.progressEditorOptions = { ...state.progressEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'progress') {
          column.progressEditorOptions = { ...column.progressEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.progressEditorOptions);
        }
      }
    },

    // ============ FORMS WIDGET OPTIONS ============
    updateFormEditorOptions: (state, action: PayloadAction<Partial<FormEditorOptions>>) => {
      state.formEditorOptions = { ...state.formEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'form') {
          column.formEditorOptions = { ...column.formEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.formEditorOptions);
        }
      }
    },

    updateSurveyEditorOptions: (state, action: PayloadAction<Partial<SurveyEditorOptions>>) => {
      state.surveyEditorOptions = { ...state.surveyEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'survey') {
          column.surveyEditorOptions = { ...column.surveyEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.surveyEditorOptions);
        }
      }
    },

    updateInputEditorOptions: (state, action: PayloadAction<Partial<InputEditorOptions>>) => {
      state.inputEditorOptions = { ...state.inputEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'input') {
          column.inputEditorOptions = { ...column.inputEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.inputEditorOptions);
        }
      }
    },

    updateTextareaEditorOptions: (state, action: PayloadAction<Partial<TextareaEditorOptions>>) => {
      state.textareaEditorOptions = { ...state.textareaEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'textarea') {
          column.textareaEditorOptions = { ...column.textareaEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.textareaEditorOptions);
        }
      }
    },

    updateSelectEditorOptions: (state, action: PayloadAction<Partial<SelectEditorOptions>>) => {
      state.selectEditorOptions = { ...state.selectEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column && column.widgetContents[state.selectedWidgetIndex] && column.widgetContents[state.selectedWidgetIndex].contentType === 'select') {
          column.selectEditorOptions = { ...column.selectEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.selectEditorOptions);
        }
      }
    },

    updateCheckboxEditorOptions: (state, action: PayloadAction<Partial<CheckboxEditorOptions>>) => {
      state.checkboxEditorOptions = { ...state.checkboxEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'checkbox') {
          column.checkboxEditorOptions = { ...column.checkboxEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.checkboxEditorOptions);
        }
      }
    },

    updateRadioEditorOptions: (state, action: PayloadAction<Partial<RadioEditorOptions>>) => {
      state.radioEditorOptions = { ...state.radioEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'radio') {
          column.radioEditorOptions = { ...column.radioEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.radioEditorOptions);
        }
      }
    },

    updateLabelEditorOptions: (state, action: PayloadAction<Partial<LabelEditorOptions>>) => {
      state.labelEditorOptions = { ...state.labelEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        if (column?.contentType === 'label') {
          column.labelEditorOptions = { ...column.labelEditorOptions, ...action.payload };
          column.widgetContents[state.selectedWidgetIndex].contentData = JSON.stringify(column.labelEditorOptions);
        }
      }
    },

    // ============ WOOCOMMERCE LAYOUT WIDGET OPTIONS ============
    updateShippingAddressEditorOptions: (state, action: PayloadAction<Partial<ShippingAddressEditorOptions>>) => {
      state.shippingAddressEditorOptions = { ...state.shippingAddressEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find((b) => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'shippingAddress') {
          column.shippingAddressEditorOptions = { ...column.shippingAddressEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.shippingAddressEditorOptions);
        }
      }
    },

    updateBillingAddressEditorOptions: (
      state,
      action: PayloadAction<Partial<BillingAddressEditorOptions>>
    ) => {
      state.billingAddressEditorOptions = {
        ...state.billingAddressEditorOptions,
        ...action.payload,
      };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(
          (b) => b.id === state.selectedBlockForEditor
        );
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === "billingAddress") {
          column.billingAddressEditorOptions = { ...column.billingAddressEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.billingAddressEditorOptions);
        }
      }
    },

    updateOrderItemsEditorOptions: (state, action: PayloadAction<Partial<OrderItemsEditorOptions>>) => {
      state.orderItemsEditorOptions = { ...state.orderItemsEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'orderItems') {
          column.orderItemsEditorOptions = { ...column.orderItemsEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.orderItemsEditorOptions);
        }
      }
    },

    updateTaxBillingEditorOptions: (state, action: PayloadAction<Partial<TaxBillingEditorOptions>>) => {
      state.taxBillingEditorOptions = { ...state.taxBillingEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'taxBilling') {
          column.taxBillingEditorOptions = { ...column.taxBillingEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.taxBillingEditorOptions);
        }
      }
    },
    updateEmailHeaderEditorOptions: (state, action: PayloadAction<Partial<EmailHeaderEditorOptions>>) => {
      state.emailHeaderEditorOptions = { ...state.emailHeaderEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'emailHeader') {
          column.emailHeaderEditorOptions = { ...column.emailHeaderEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.emailHeaderEditorOptions);
        }
      }
    },
    updateEmailFooterEditorOptions: (state, action: PayloadAction<Partial<EmailFooterEditorOptions>>) => {
      state.emailFooterEditorOptions = { ...state.emailFooterEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'emailFooter') {
          column.emailFooterEditorOptions = { ...column.emailFooterEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.emailFooterEditorOptions);
        }
      }
    },
    updateCtaButtonEditorOptions: (state, action: PayloadAction<Partial<CtaButtonEditorOptions>>) => {
      state.ctaButtonEditorOptions = { ...state.ctaButtonEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'ctaButton') {
          column.ctaButtonEditorOptions = { ...column.ctaButtonEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.ctaButtonEditorOptions);
        }
      }
    },

    updateOrderSubtotalEditorOptions: (state, action: PayloadAction<Partial<OrderSubtotalEditorOptions>>) => {
      state.orderSubtotalEditorOptions = { ...state.orderSubtotalEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'orderSubtotal') {
          column.orderSubtotalEditorOptions = { ...column.orderSubtotalEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.orderSubtotalEditorOptions);
        }
      }
    },

    updateOrderTotalEditorOptions: (state, action: PayloadAction<Partial<OrderTotalEditorOptions>>) => {
      state.orderTotalEditorOptions = { ...state.orderTotalEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'orderTotal') {
          column.orderTotalEditorOptions = { ...column.orderTotalEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.orderTotalEditorOptions);
        }
      }
    },

    updateShippingMethodEditorOptions: (state, action: PayloadAction<Partial<ShippingMethodEditorOptions>>) => {
      state.shippingMethodEditorOptions = { ...state.shippingMethodEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'shippingMethod') {
          column.shippingMethodEditorOptions = { ...column.shippingMethodEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.shippingMethodEditorOptions);
        }
      }
    },

    updatePaymentMethodEditorOptions: (state, action: PayloadAction<Partial<PaymentMethodEditorOptions>>) => {
      state.paymentMethodEditorOptions = { ...state.paymentMethodEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'paymentMethod') {
          column.paymentMethodEditorOptions = { ...column.paymentMethodEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.paymentMethodEditorOptions);
        }
      }
    },

    updateCustomerNoteEditorOptions: (state, action: PayloadAction<Partial<CustomerNoteEditorOptions>>) => {
      state.customerNoteEditorOptions = { ...state.customerNoteEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'customerNote') {
          column.customerNoteEditorOptions = { ...column.customerNoteEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.customerNoteEditorOptions);
        }
      }
    },
    updateRelatedProductsEditorOptions: (state, action: PayloadAction<Partial<RelatedProductsEditorOptions>>) => {
      state.relatedProductsEditorOptions = { ...state.relatedProductsEditorOptions, ...action.payload };
      if (state.selectedBlockForEditor && state.selectedColumnIndex !== null && state.selectedWidgetIndex !== null) {
        const block = state.blocks.find(b => b.id === state.selectedBlockForEditor);
        const column = block?.columns[state.selectedColumnIndex];
        const widget = column?.widgetContents[state.selectedWidgetIndex];
        if (widget && widget.contentType === 'relatedProducts') {
          column.relatedProductsEditorOptions = { ...column.relatedProductsEditorOptions, ...action.payload };
          widget.contentData = JSON.stringify(column.relatedProductsEditorOptions);
        }
      }
    },


    updateColumnBorderTopColor: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderTopColor = action.payload.color;
        }
      }
    },

    updateColumnBorderBottomColor: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderBottomColor = action.payload.color;
        }
      }
    },

    updateColumnBorderLeftColor: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderLeftColor = action.payload.color;
        }
      }
    },

    updateColumnBorderRightColor: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; color: string }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.borderRightColor = action.payload.color;
        }
      }
    },

    updateColumnTextAlign: (
      state,
      action: PayloadAction<{ blockId: string | null; columnIndex: number; textAlign: 'left' | 'center' | 'right' | 'justify' }>
    ) => {
      if (action.payload.blockId) {
        const block = state.blocks.find((b) => b.id === action.payload.blockId);
        if (block && block.columns[action.payload.columnIndex]) {
          block.columns[action.payload.columnIndex].style.textAlign = action.payload.textAlign;
        }
      }
    },

    setBlocks: (state, action: PayloadAction<DroppedBlock[]>) => {
      state.blocks = action.payload;
    },
  },
});

export const {
  // Block Management
  addBlock, copyBlock, deleteBlock, clearBlocks, reorderBlocks, setBlocks,

  // Block selection and Editor
  setSelectedBlockId, openEditor, closeEditor,

  // Block & Column styling
  updateBlockHeight,
  updateSelectedColumnIndex, updateColumnBgColor,
  updateColumnBorderColor, updateColumnPadding,
  updateColumnBorderStyle, updateColumnBorderTopSize,
  updateColumnBorderBottomSize, updateColumnBorderLeftSize,
  updateColumnBorderRightSize, updateColumnHeight,
  updateColumnBorderTopColor, updateColumnBorderBottomColor,
  updateColumnBorderLeftColor, updateColumnBorderRightColor,
  updateColumnTextAlign,

  // Content Management
  updateWidgetContentData, updateColumnContentData,
  addColumnContent, deleteColumnContent,

  // Basic Layout Editor Options
  updateColumnTextEditorOptions,
  updateTextEditorOptions, resetTextEditorOptions,
  updateSectionEditorOptions,
  updateSpacerEditorOptions,
  updateLinkEditorOptions,
  updateLinkBoxEditorOptions,
  updateImageBoxEditorOptions,
  updateMapEditorOptions,
  updateIconEditorOptions,
  updateButtonEditorOptions,
  updateColumnHeadingEditorOptions,
  updateSocialIconsEditorOptions,
  updateHeadingEditorOptions,
  updateColumnSocialIconsEditorOptions,
  updateColumnDividerEditorOptions,
  updateDividerEditorOptions,
  updateColumnImageEditorOptions,
  updateImageEditorOptions,

  // Layout Block Editor Options
  updateRowEditorOptions,
  updateContainerEditorOptions,
  updateGroupEditorOptions,

  // Extra Block Editor Options
  updateSocialFollowEditorOptions,
  updateVideoEditorOptions,
  updateCodeEditorOptions,
  updateCountdownEditorOptions,
  updateProgressBarEditorOptions,
  updateProductEditorOptions,
  updatePromoCodeEditorOptions,
  updatePriceEditorOptions,
  updateTestimonialEditorOptions,
  updateNavbarEditorOptions,
  updateCardEditorOptions,
  updateAlertEditorOptions,
  updateProgressEditorOptions,

  // Forms Editor Options
  updateFormEditorOptions,
  updateSurveyEditorOptions,
  updateInputEditorOptions,
  updateTextareaEditorOptions,
  updateSelectEditorOptions,
  updateCheckboxEditorOptions,
  updateRadioEditorOptions,
  updateLabelEditorOptions,

  // WooCommerce Layout
  updateBillingAddressEditorOptions,
  updateShippingAddressEditorOptions,
  updateTaxBillingEditorOptions,
  updateOrderItemsEditorOptions,
  updateEmailHeaderEditorOptions,
  updateEmailFooterEditorOptions,
  updateCtaButtonEditorOptions,
  updateRelatedProductsEditorOptions,
  updateOrderSubtotalEditorOptions,
  updateOrderTotalEditorOptions,
  updateShippingMethodEditorOptions,
  updatePaymentMethodEditorOptions,
  updateCustomerNoteEditorOptions,

  // View Mode
  setMobileView, setPreviewMode,
  undo, redo,
} = workspaceSlice.actions;

export type { Column, DroppedBlock, WidgetContent };
export default workspaceSlice.reducer;