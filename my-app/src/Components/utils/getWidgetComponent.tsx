
import React from 'react';

// Basics Field Components
import TextFieldComponent from "../fieldcompw/textfielr/index";
import ButtonFieldComponent from "../fieldcompw/button";
import HeadingFieldComponent from "../fieldcompw/heading";
import SocialIconsFieldComponent from "../fieldcompw/socialIcons";
import DividerFieldComponent from "../fieldcompw/divider";
import ImageFieldComponent from "../fieldcompw/Image";
import IconFieldComponent from "../fieldcompw/icon";
import LinkFieldComponent from "../fieldcompw/link";
import SectionFieldComponent from "../fieldcompw/section";
import SpacerFieldComponent from "../fieldcompw/spacer";

// Layout Block Field Components
import RowFieldComponent from "../fieldcompw/row";
import ContainerFieldComponent from "../fieldcompw/container";
import GroupFieldComponent from "../fieldcompw/group";

// Extra Block Field Components
import SocialFollowFieldComponent from "../fieldcompw/socialFollow";
import VideoFieldComponent from "../fieldcompw/video";
import CountdownFieldComponent from "../fieldcompw/countdown";
import ProductFieldComponent from "../fieldcompw/product";
import PromoCodeFieldComponent from "../fieldcompw/promoCode";
import PriceFieldComponent from "../fieldcompw/price";

// Woocommerce Field Components
import ShippingAddressFieldComponent from "../fieldcompw/shippingAddress/index";
import BillingAddressFieldComponent from "../fieldcompw/billingAddress";
import OrderItemsFieldComponent from "../fieldcompw/orderItems";
import TaxBillingFieldComponent from "../fieldcompw/taxBilling";
import EmailHeaderFieldComponent from "../fieldcompw/emailHeader";
import EmailFooterFieldComponent from "../fieldcompw/emailFooter";
import CtaButtonFieldComponent from "../fieldcompw/ctaButton";
import RelatedProductsFieldComponent from "../fieldcompw/relatedProducts";
import OrderSubtotalFieldComponent from "../fieldcompw/orderSubtotal";
import OrderTotalFieldComponent from "../fieldcompw/orderTotal";
import ShippingMethodFieldComponent from "../fieldcompw/shippingMethod";
import PaymentMethodFieldComponent from "../fieldcompw/paymentMethod";
import CustomerNoteFieldComponent from "../fieldcompw/customerNote";
import ContactFieldComponent from "../fieldcompw/contact";
import ProductDetailsFieldComponent from "../fieldcompw/productDetails";

export const getWidgetComponent = (widgetType: string) => {
    switch (widgetType) {
        // Basics Layout Widgets
        case "text": return TextFieldComponent;
        case "heading": return HeadingFieldComponent;
        case "socialIcons": return SocialIconsFieldComponent;
        case "divider": return DividerFieldComponent;
        case "image": return ImageFieldComponent;
        case "button": return ButtonFieldComponent;
        case "section": return SectionFieldComponent;
        case "spacer": return SpacerFieldComponent;
        case 'link': return LinkFieldComponent;
        case 'icon': return IconFieldComponent;

        // Layout Block Widgets 
        case "row": return RowFieldComponent;
        case "container": return ContainerFieldComponent;
        case "group": return GroupFieldComponent;

        // Extra Block Widgets
        case "socialFollow": return SocialFollowFieldComponent;
        case "video": return VideoFieldComponent;
        case "countdown": return CountdownFieldComponent;
        case "product": return ProductFieldComponent;
        case "promoCode": return PromoCodeFieldComponent;
        case "price": return PriceFieldComponent;

        // WooCommerce Widgets
        case "shippingAddress": return ShippingAddressFieldComponent;
        case "billingAddress": return BillingAddressFieldComponent;
        case "orderItems": return OrderItemsFieldComponent;
        case "taxBilling": return TaxBillingFieldComponent;
        case "emailHeader": return EmailHeaderFieldComponent;
        case "emailFooter": return EmailFooterFieldComponent;
        case "ctaButton": return CtaButtonFieldComponent;
        case "relatedProducts": return RelatedProductsFieldComponent;
        case "orderSubtotal": return OrderSubtotalFieldComponent;
        case "orderTotal": return OrderTotalFieldComponent;
        case "shippingMethod": return ShippingMethodFieldComponent;
        case "paymentMethod": return PaymentMethodFieldComponent;
        case "customerNote": return CustomerNoteFieldComponent;
        case "contact": return ContactFieldComponent;
        case "productDetails": return ProductDetailsFieldComponent;

        default: return null;
    }
};
