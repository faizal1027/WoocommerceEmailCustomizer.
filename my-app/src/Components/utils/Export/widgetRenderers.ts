export function widgetToHTML(widget: any): string {
  if (!widget) return '';
  const type = widget.type || widget.contentType;

  if (!type) {
    // If no type, it's effectively an empty slot or null widget
    return '';
  }

  const data = widget.data || parseContentData(widget.contentData);

  // Get renderer from mapping
  const renderer = widgetRenderers[type] || widgetRenderers.unknown;

  const content = renderer(data);

  // Return content directly without extra wrapper for cleaner output
  return content;
}

// ========== WIDGET RENDERERS FOR ALL 10 COMPONENTS ==========
const widgetRenderers: Record<string, (data: any) => string> = {
  // ========== 1. TEXT WIDGET ==========
  'text': (d) => {
    const data = d || {};
    let content = data.content || '';


    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.color && `color: ${data.color}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      data.lineHeight && `line-height: ${data.lineHeight}%`,
      data.letterSpace && `letter-spacing: ${data.letterSpace}px`,
      data.padding?.top !== undefined ? `padding: ${data.padding.top}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px` : ''
    ].filter(Boolean).join('; ');

    return `<div${styles ? ` style="${styles}"` : ''}>${content}</div>`;
  },

  // ========== 2. HEADING WIDGET ==========
  'heading': (d) => {
    const data = d || {};
    const content = data.content || '';
    const headingType = data.headingType || 'h2';
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.color && `color: ${data.color}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      data.textAlign && `text-align: ${data.textAlign}`,
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}%`,
      data.letterSpace && `letter-spacing: ${data.letterSpace}px`,
      data.padding?.top !== undefined ? `padding: ${data.padding.top}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px` : ''
    ].filter(Boolean).join('; ');

    return `<${headingType}${styles ? ` style="${styles}"` : ''}>${content}</${headingType}>`;
  },

  // ========== 3. BUTTON WIDGET ==========
  'button': (d) => {
    const btnData = d || {};
    const containerAlign = btnData.textAlign || 'center';

    // Width handling: The editor likely provides width as 0-100 (percentage)
    // If widthAuto is true, we leave it auto (undefined/null usually results in auto width behavior)
    // If widthAuto is false, we apply the width.
    let widthStyle = '';
    if (btnData.widthAuto === false && btnData.width) {
      // Check if it already has % or px, otherwise assume %
      const wVal = String(btnData.width);
      widthStyle = `width: ${wVal}${wVal.match(/%|px/) ? '' : '%'}`;
    }

    const buttonStyles = [
      `display: inline-block`,
      `padding: ${btnData.padding?.top || 10}px ${btnData.padding?.right || 20}px ${btnData.padding?.bottom || 10}px ${btnData.padding?.left || 20}px`,
      `background-color: ${btnData.bgColor || '#007bff'}`,
      `color: ${btnData.textColor || '#ffffff'}`,
      `text-decoration: none`,
      `font-family: Arial, sans-serif`,
      btnData.borderRadius ? `border-radius: ${btnData.borderRadius.topLeft || 4}px ${btnData.borderRadius.topRight || 4}px ${btnData.borderRadius.bottomRight || 4}px ${btnData.borderRadius.bottomLeft || 4}px` : `border-radius: 4px`,
      btnData.fontSize && `font-size: ${btnData.fontSize}px`,
      btnData.fontWeight && `font-weight: ${btnData.fontWeight}`,
      btnData.fontStyle && `font-style: ${btnData.fontStyle}`,
      widthStyle,
      `border: none`,
      `cursor: pointer`,
      `text-align: center` // Ensure text inside button is centered
    ].filter(Boolean).join('; ');

    const href = btnData.url && !btnData.urlDisabled ? btnData.url : '#';

    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 10px 0; width: 100%;">
      <tr>
        <td align="${containerAlign}" style="text-align: ${containerAlign};">
          <a href="${escapeHtml(href)}" style="${buttonStyles}" target="_blank" rel="noopener">${escapeHtml(btnData.text || 'Button')}</a>
        </td>
      </tr>
    </table>`;
  },

  // ========== 4. TAX BILLING WIDGET ==========
  'taxBilling': (d) => {
    const data = d || {};
    // During export, we ALWAYS want placeholders for these fields
    const orderNumber = '{{order_id}}';
    const orderDate = '{{order_date}}';
    const subtotal = '{{order_subtotal}}';
    const shipping = '{{order_shipping}}';
    const tax = '{{tax_amount}}';
    const total = '{{order_total}}';

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      `border: 1px solid #dddddd`,
      `border-collapse: collapse`
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="12" cellspacing="0" style="${styles}">
      <tr style="background-color: #f8f9fa;">
        <td colspan="2" style="padding: 12px; font-weight: bold; font-size: 16px; border-bottom: 2px solid #dee2e6;">Tax Invoice #${orderNumber}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px 12px; border-bottom: 1px solid #eeeeee;">
          <strong>Order Date:</strong> ${orderDate}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">Subtotal</td>
        <td align="right" style="padding: 8px; border-bottom: 1px solid #eee;">${subtotal}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">Shipping</td>
        <td align="right" style="padding: 8px; border-bottom: 1px solid #eee;">${shipping}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee; color: #e53e3e;">Discount</td>
        <td align="right" style="padding: 8px; border-bottom: 1px solid #eee; color: #e53e3e;">-{{order_discount}}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">Tax</td>
        <td align="right" style="padding: 8px; border-bottom: 1px solid #eee;">${tax}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Total</td>
        <td align="right" style="padding: 8px; font-weight: bold;">${total}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 15px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
          <div style="font-weight: bold; margin-bottom: 8px;">Billing Address:</div>
          <div>{{billing_first_name}} {{billing_last_name}}</div>
          <div>{{billing_address_1}}</div>
          <div>{{billing_address_2}}</div>
          <div>{{billing_city}}, {{billing_state}} {{billing_postcode}}</div>
          <div>{{billing_country}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px 12px; font-weight: bold;">Tax Billing</td>
      </tr>
    </table>`;
  },

  'billingAddress': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : 'background-color: #ffffff',
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: 16px; border: 1px solid #dee2e6; vertical-align: top;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2d3748; border-bottom: 3px solid #007bff; padding-bottom: 8px;">BILL TO:</div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Name:</strong> {{billing_first_name}} {{billing_last_name}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Phone:</strong> {{billing_phone}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Email:</strong> {{billing_email}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Address Line 1:</strong> {{billing_address_1}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Address Line 2:</strong> {{billing_address_2}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>City:</strong> {{billing_city}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>State:</strong> {{billing_state}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Postal Code:</strong> {{billing_postcode}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Country:</strong> {{billing_country}}
          </div>
        </td>
      </tr>
    </table>`;
  },

  'shippingAddress': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : 'background-color: #ffffff',
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: 16px; border: 1px solid #dee2e6; vertical-align: top;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #2d3748; border-bottom: 3px solid #28a745; padding-bottom: 8px;">SHIP TO:</div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Name:</strong> {{shipping_first_name}} {{shipping_last_name}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Phone:</strong> {{shipping_phone}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Email:</strong> {{shipping_email}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Address Line 1:</strong> {{shipping_address_1}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Address Line 2:</strong> {{shipping_address_2}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>City:</strong> {{shipping_city}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>State:</strong> {{shipping_state}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Postal Code:</strong> {{shipping_postcode}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6;">
            <strong>Country:</strong> {{shipping_country}}
          </div>
        </td>
      </tr>
    </table>`;
  },

  'orderItems': (d) => {
    const data = d || {};
    // Force placeholders during export for dynamic WooCommerce data
    const orderNumber = '{{order_id}}';
    const orderDate = '{{order_date}}';

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px; ${styles}">
      <tr>
        <td style="padding: 0;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 16px; color: #2d3748;">[Order #${escapeHtml(orderNumber)}] (${escapeHtml(orderDate)})</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #dee2e6; border-collapse: collapse; background-color: #ffffff;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #2d3748;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #2d3748;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6; font-weight: bold; color: #2d3748;">Price</th>
              </tr>
            </thead>
            <tbody>
              {{order_items_rows}}
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #2d3748;">Subtotal:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #2d3748;">{{order_subtotal}}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #e53e3e;">Discount:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #e53e3e;">-{{order_discount}}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #2d3748;">Payment method:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #2d3748;">{{payment_method}}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td colspan="2" style="padding: 12px; font-weight: bold; border-top: 2px solid #dee2e6; color: #2d3748;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #dee2e6; color: #2d3748;">{{order_total}}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 16px; font-weight: bold; color: #2d3748;">Order Item</div>
        </td>
      </tr>
    </table>`;
  },

  // ========== 8. IMAGE WIDGET ==========
  'image': (d) => {
    const data = d || {};
    const styles = [
      data.width ? `width: ${String(data.width).match(/%|px/) ? data.width : data.width + 'px'}` : '',
      data.align === 'center' ? 'display: block; margin-left: auto; margin-right: auto' : '',
      data.align === 'right' ? 'display: block; margin-left: auto' : '',
      data.borderRadius ? `border-radius: ${data.borderRadius}` : '',
      `max-width: 100%`,
      `height: auto`
    ].filter(Boolean).join('; ');

    const altText = data.altText || 'Image';
    const src = data.src || 'https://via.placeholder.com/600x400?text=Image+Placeholder';

    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(altText)}"${styles ? ` style="${styles}"` : ''} />`;
  },

  // ========== 9. DIVIDER WIDGET ==========
  'divider': (d) => {
    const data = d || {};
    const width = data.width || '100';
    const thickness = data.thickness || 1;
    const style = data.style || 'solid';
    const color = data.color || '#cccccc';
    const alignment = data.alignment || 'center';

    const paddingTop = data.padding?.top || 10;
    const paddingBottom = data.padding?.bottom || 10;
    // We don't use left/right padding since we use margin for alignment

    const marginStyles = alignment === 'center' ? 'margin-left: auto; margin-right: auto' :
      alignment === 'right' ? 'margin-left: auto; margin-right: 0' :
        'margin-left: 0; margin-right: auto';

    const dividerStyles = [
      `width: ${width}%`,
      `border-top: ${thickness}px ${style} ${color}`,
      `height: 0`,
      `line-height: 0`,
      `font-size: 0`,
      marginStyles,
      `display: block`
    ].join('; ');

    return `
    <div style="padding: ${paddingTop}px 0 ${paddingBottom}px 0; width: 100%;">
      <div style="${dividerStyles}">&nbsp;</div>
    </div>`;
  },

  // ========== 10. SOCIAL ICONS WIDGET ==========
  'socialIcons': (d) => {
    const data = d || {};
    const icons = data.addedIcons?.icons || [];
    const urls = data.addedIcons?.url || [];
    const iconSize = data.iconSize || 32;
    const iconSpace = data.iconSpace || 8;

    // Use high-quality official icon assets (CDNs) for better look
    // NOTE: To use local icons, upload PNGs to assets/img/social/ and uncomment the code below
    // const pluginUrl = (window as any).emailTemplateAjax?.plugin_url || '';
    // const localIconBase = `${pluginUrl}assets/img/social/`;

    const socialIconImages: Record<string, string> = {
      // facebook: `${localIconBase}facebook.png`, 
      facebook: 'https://img.icons8.com/color/48/facebook-new.png',
      twitter: 'https://img.icons8.com/color/48/twitter--v1.png',
      linkedin: 'https://img.icons8.com/color/48/linkedin.png',
      instagram: 'https://img.icons8.com/color/48/instagram-new.png',
      pinterest: 'https://img.icons8.com/color/48/pinterest--v1.png',
      youtube: 'https://img.icons8.com/color/48/youtube-play.png',
      whatsapp: 'https://img.icons8.com/color/48/whatsapp--v1.png',
      reddit: 'https://img.icons8.com/color/48/reddit.png',
      github: 'https://img.icons8.com/ios-filled/50/000000/github.png', // Black filled for visibility
      telegram: 'https://img.icons8.com/color/48/telegram-app.png',
      envelope: 'https://img.icons8.com/color/48/email.png',
    };

    // Helper to generate icon HTML
    const getSocialIconHtml = (icon: string, size: number): string => {
      const src = socialIconImages[icon] || 'https://via.placeholder.com/32';
      return `<img src="${src}" alt="${icon}" width="${size}" height="${size}" style="display: block; border: 0;" />`;
    };

    if (icons.length === 0) return '';

    // Use table for better email client support
    const iconsHtml = icons.map((icon: string, index: number) => {
      const iconImg = getSocialIconHtml(icon, iconSize);
      const url = urls[index] || '#';

      return `
        <td style="padding: 0 ${iconSpace / 2}px;">
          <a href="${escapeHtml(url)}" style="text-decoration: none; display: block;" target="_blank" rel="noopener">${iconImg}</a>
        </td>`;
    }).join('');

    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: ${data.padding?.top || 10}px auto ${data.padding?.bottom || 10}px; border-collapse: collapse;">
      <tr>
        ${iconsHtml}
      </tr>
    </table>`;
  },


  // ========== 12. SPACER WIDGET ==========
  'spacer': (d) => {
    const data = d || {};
    const height = data.height || 20;
    const bgColor = data.backgroundColor || 'transparent';

    // Must trigger layout with &nbsp; and line-height/font-size
    return `<div style="height: ${height}px; line-height: ${height}px; font-size: 0px; background-color: ${bgColor}; width: 100%;">&nbsp;</div>`;
  },

  // ========== 13. LINK WIDGET ==========
  'link': (d) => {
    const data = d || {};
    const styles = [
      `color: ${data.color || '#007bff'}`,
      `font-size: ${data.fontSize || 14}px`,
      data.underline !== false ? 'text-decoration: underline' : 'text-decoration: none',
      'display: inline-block'
    ].filter(Boolean).join('; ');

    return `<a href="${escapeHtml(data.url || '#')}" style="${styles}" target="_blank" rel="noopener">${escapeHtml(data.text || 'Link')}</a>`;
  },

  // ========== 14. LINK BOX WIDGET ==========
  'linkBox': (d) => {
    const data = d || {};
    const links = data.links || [];

    const containerStyles = [
      `background-color: ${data.backgroundColor || '#f9f9f9'}`,
      `padding: ${data.padding || 10}px`,
      data.borderRadius ? `border-radius: ${data.borderRadius}px` : ''
    ].filter(Boolean).join('; ');

    const linksHtml = links.map((link: any, index: number) => `
      <div style="margin-bottom: ${index < links.length - 1 ? '8px' : '0'};">
        <a href="${escapeHtml(link.url || '#')}" 
           style="color: #007bff; text-decoration: none; font-size: 14px;"
           target="_blank" rel="noopener">
          ${escapeHtml(link.text || `Link ${index + 1}`)}
        </a>
      </div>
    `).join('');

    return `<div style="${containerStyles}">${linksHtml}</div>`;
  },

  // ========== 15. IMAGE BOX WIDGET ==========
  'imageBox': (d) => {
    const data = d || {};
    const src = data.src || 'https://cdn.tools.unlayer.com/image/placeholder.png';
    const alt = data.alt || 'Image';

    const containerStyles = [
      `width: ${data.width || '100%'}`,
      data.height ? `height: ${data.height}` : '',
      'margin: 0 auto'
    ].filter(Boolean).join('; ');

    const imgStyles = [
      'width: 100%',
      'height: auto',
      'display: block'
    ].filter(Boolean).join('; ');

    let content = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" style="${imgStyles}" />`;

    if (data.link) {
      content = `<a href="${escapeHtml(data.link)}" target="_blank" rel="noopener">${content}</a>`;
    }

    if (data.caption) {
      content += `<div style="text-align: center; font-size: 14px; color: #666; margin-top: 8px; padding: 8px; font-style: italic;">${escapeHtml(data.caption)}</div>`;
    }

    return `<div style="${containerStyles}">${content}</div>`;
  },

  // ========== 16. MAP WIDGET ==========
  'map': (d) => {
    const data = d || {};
    const location = encodeURIComponent(data.location || 'New York, NY');
    const zoom = data.zoom || 12;

    const styles = [
      `width: ${data.width || '100%'}`,
      `height: ${data.height || '300px'}`,
      'border: 1px solid #ddd',
      'border-radius: 4px'
    ].filter(Boolean).join('; ');

    // Use a static image for map instead of iframe (not supported in email)
    // We link to the Google Maps URL
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
    const placeholderMap = 'https://cdn.tools.unlayer.com/image/placeholder.png'; // Or a generic map icon

    return `
      <div style="${styles}">
        <a href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener" style="text-decoration: none; display: block; width: 100%; height: 100%;">
          <div style="background-color: #e9ecef; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #666; font-family: Arial, sans-serif;">
             <div style="text-align: center;">
               <div style="font-size: 24px; margin-bottom: 8px;">📍</div>
               <div>Map Location</div>
               <div style="font-size: 12px; margin-top: 4px; color: #007bff;">Click to view map</div>
             </div>
          </div>
        </a>
      </div>
    `;
  },

  // ========== 17. ICON WIDGET ==========
  'icon': (d) => {
    const data = d || {};
    const iconTypes: Record<string, string> = {
      'star': '★',
      'heart': '♥',
      'check': '✓',
      'warning': '⚠',
      'info': 'ℹ',
      'home': '⌂',
      'email': '✉',
      'phone': '☎',
      'calendar': '📅',
      'location': '📍'
    };

    const iconChar = iconTypes[data.iconType || 'star'] || '★';
    const styles = [
      `color: ${data.color || '#000000'}`,
      `font-size: ${data.size || 24}px`,
      'display: inline-block'
    ].filter(Boolean).join('; ');

    let content = `<span style="${styles}">${iconChar}</span>`;

    if (data.link) {
      content = `<a href="${escapeHtml(data.link)}" style="text-decoration: none;" target="_blank" rel="noopener">${content}</a>`;
    }

    return content;
  },



  // ========== 19. CONTAINER WIDGET ==========
  'container': (d) => {
    const data = d || {};
    const styles = [
      `max-width: ${data.maxWidth || '800px'}`,
      `background-color: ${data.backgroundColor || '#ffffff'}`,
      `padding: ${data.padding || 20}px`,
      data.border?.width ? `border: ${data.border.width}px ${data.border.style || 'solid'} ${data.border.color || '#ddd'}` : '',
      'margin: 0 auto',
      'box-sizing: border-box'
    ].filter(Boolean).join('; ');

    return `<div style="${styles}">${data.content || ''}</div>`;
  },

  // ========== 20. GROUP WIDGET ==========
  'group': (d) => {
    const data = d || {};
    const styles = [
      `text-align: ${data.alignment || 'left'}`,
      'display: flex',
      'flex-direction: column',
      `gap: ${data.spacing || 10}px`
    ].filter(Boolean).join('; ');

    const elements = data.elements || [];
    const elementsHtml = elements.map((element: string, index: number) => `
      <div style="background-color: #f8f9fa; padding: 12px; border-radius: 4px;">
        <div style="color: #495057; font-weight: 500;">Element ${index + 1}</div>
        <div style="font-size: 13px; color: #6c757d;">${escapeHtml(element)}</div>
      </div>
    `).join('');

    return `<div style="${styles}">${elementsHtml || '<div style="text-align: center; color: #6c757d; padding: 20px;">No elements in group</div>'}</div>`;
  },

  // ========== 21. SECTION WIDGET ==========
  'section': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#f5f5f5'}`,
      data.padding ? `padding: ${data.padding.top || 20}px ${data.padding.right || 20}px ${data.padding.bottom || 20}px ${data.padding.left || 20}px` : 'padding: 20px',
      data.border ? `border: ${data.border.width || 1}px ${data.border.style || 'solid'} ${data.border.color || '#ddd'}` : 'border: 1px solid #ddd',
      data.border?.radius ? `border-radius: ${data.border.radius}px` : '',
      'width: 100%',
      'box-sizing: border-box'
    ].filter(Boolean).join('; ');

    return `
      <div style="${styles}">
        <div style="text-align: center; color: #999; font-size: 14px;">Section Content Area</div>
      </div>`;
  },

  // ========== 22. ROW WIDGET ==========
  'row': (d) => {
    const data = d || {};
    const colCount = data.columns || 2;
    const gap = data.gap || 20;
    const colWidth = Math.floor(100 / colCount);

    const containerStyles = [
      `background-color: ${data.backgroundColor || 'transparent'}`,
      'width: 100%',
      'border-collapse: collapse'
    ].filter(Boolean).join('; ');

    let colsHtml = '';
    for (let i = 0; i < colCount; i++) {
      colsHtml += `
          <td width="${colWidth}%" style="width: ${colWidth}%; padding: ${gap / 2}px; border: 1px dashed #ccc; text-align: center; color: #aaa; font-size: 12px; vertical-align: top;">
            Column ${i + 1}
          </td>`;
    }

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${containerStyles}">
        <tr>
          ${colsHtml}
        </tr>
      </table>`;
  },

  // ========== 23. SOCIAL FOLLOW WIDGET ==========
  'socialFollow': (d) => {
    const data = d || {};
    const platforms = data.platforms || [];

    const containerStyles = [
      `text-align: center`,
      `padding: 16px 0`
    ].filter(Boolean).join('; ');

    const iconsHtml = platforms.map((platform: any, index: number) => {
      const iconHtml = getSocialIconHtml(platform.icon || 'link', data.iconSize || 24, data.iconColor || '#666666');
      return `
        <a href="${escapeHtml(platform.url || '#')}" 
           style="display: inline-block; margin: 0 ${data.spacing || 12}px; text-decoration: none;"
           target="_blank" rel="noopener"
           title="${escapeHtml(platform.name || 'Social Media')}">
          ${iconHtml}
        </a>
      `;
    }).join('');

    return `<div style="${containerStyles}">${iconsHtml || '<span style="color: #6c757d;">No social platforms added</span>'}</div>`;
  },

  // ========== 22. VIDEO WIDGET ==========
  'video': (d) => {
    const data = d || {};
    const videoUrl = data.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    // Extract YouTube video ID
    const videoId = videoUrl.includes('youtube.com')
      ? videoUrl.split('v=')[1]?.split('&')[0]
      : videoUrl.includes('youtu.be')
        ? videoUrl.split('/').pop()?.split('?')[0]
        : null;

    const styles = [
      `width: ${data.width || '100%'}`,
      `height: ${data.height || '315px'}`,
      'border: none'
    ].filter(Boolean).join('; ');

    if (videoId) {
      const autoplay = data.autoplay ? '?autoplay=1' : '';
      const controls = data.controls !== false ? '&controls=1' : '&controls=0';
      const videoThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const playIcon = 'https://cdn.tools.unlayer.com/image/play-button.png'; // Or generic play icon

      return `
        <div style="position: relative; width: 100%; max-width: ${data.width || '100%'}; margin: 0 auto;">
          <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener" style="display: block; position: relative;">
            <img src="${videoThumbnail}" alt="Play Video" style="width: 100%; height: auto; display: block;" />
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; background-color: rgba(0,0,0,0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
               <div style="width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 4px;"></div>
            </div>
          </a>
        </div>
      `;
    }

    return `<div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; padding: 40px; text-align: center; color: #6c757d;">
      <div style="font-weight: bold; margin-bottom: 8px;">Video Player</div>
      <div style="font-size: 13px;">Unsupported video URL</div>
    </div>`;
  },

  // ========== 23. CODE WIDGET ==========
  'code': (d) => {
    const data = d || {};
    const styles = [
      'background-color: #f8f9fa',
      'border: 1px solid #dee2e6',
      'border-radius: 4px',
      'padding: 16px',
      'font-family: "Courier New", monospace',
      'font-size: 14px',
      'overflow-x: auto',
      'white-space: pre-wrap',
      'word-break: break-all'
    ].filter(Boolean).join('; ');

    return `<pre style="${styles}"><code>${escapeHtml(data.code || '// No code provided')}</code></pre>`;
  },

  // ========== 24. COUNTDOWN WIDGET ==========
  'countdown': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#333'}`,
      `color: ${data.textColor || '#fff'}`,
      'padding: 20px',
      'border-radius: 8px',
      'text-align: center',
      'font-family: monospace',
      'font-size: 24px',
      'font-weight: bold',
      'letter-spacing: 2px'
    ].filter(Boolean).join('; ');

    const targetDate = data.targetDate || '2024-12-31T23:59:59';
    const labels = data.showLabels !== false;

    return `
      <div style="${styles}">
        <div style="margin-bottom: 8px; font-size: 16px; font-weight: normal;">Countdown Timer</div>
        <div>${labels ? 'DD:HH:MM:SS' : '--:--:--:--'}</div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">Ends: ${new Date(targetDate).toLocaleDateString()}</div>
      </div>
    `;
  },

  // ========== 25. PROGRESS BAR WIDGET ==========
  'progressBar': (d) => {
    const data = d || {};
    const value = data.value || 0;
    const max = data.max || 100;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const containerStyles = [
      'width: 100%',
      'background-color: #e9ecef',
      'border-radius: 20px',
      'overflow: hidden'
    ].filter(Boolean).join('; ');

    const barStyles = [
      `width: ${percentage}%`,
      `background-color: ${data.color || '#007bff'}`,
      'height: 20px',
      'transition: width 0.3s ease'
    ].filter(Boolean).join('; ');

    const labelHtml = data.label ? `<div style="margin-bottom: 8px; font-weight: 500; color: #495057;">${escapeHtml(data.label)}</div>` : '';
    const percentageHtml = data.showPercentage !== false ? `<div style="margin-top: 8px; text-align: right; font-size: 14px; color: #6c757d;">${percentage.toFixed(1)}%</div>` : '';

    return `
      <div style="width: 100%;">
        ${labelHtml}
        <div style="${containerStyles}">
          <div style="${barStyles}"></div>
        </div>
        ${percentageHtml}
      </div>
    `;
  },

  // ========== 26. PRODUCT WIDGET ==========
  'product': (d) => {
    const data = d || {};
    const styles = [
      'border: 1px solid #dee2e6',
      'border-radius: 8px',
      'overflow: hidden',
      'background-color: #ffffff'
    ].filter(Boolean).join('; ');

    const imageUrl = data.imageUrl || data.image || 'https://cdn.tools.unlayer.com/image/placeholder.png';
    const buttonUrl = data.buttonLink || data.buttonUrl || '#';

    return `
      <div style="${styles}">
        <div style="position: relative; overflow: hidden;">
          <img src="${escapeHtml(imageUrl)}" 
               alt="${escapeHtml(data.name || 'Product')}" 
               style="width: 100%; height: 200px; object-fit: cover; display: block;" />
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #2d3748;">
            ${escapeHtml(data.name || 'Product Name')}
          </div>
          <div style="font-size: 14px; color: #6c757d; margin-bottom: 12px; line-height: 1.5;">
            ${escapeHtml(data.description || 'Product description goes here')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 20px; font-weight: bold; color: #28a745;">
              ${escapeHtml(data.price || '$0.00')}
            </div>
            <a href="${escapeHtml(buttonUrl)}" 
               style="background-color: #007bff; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500;">
              ${escapeHtml(data.buttonText || 'Buy Now')}
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // ========== 27. PROMO CODE WIDGET ==========
  'promoCode': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#ffeb3b'}`,
      `color: ${data.textColor || '#333'}`,
      'border: 2px dashed #ffc107',
      'border-radius: 8px',
      'padding: 20px',
      'text-align: center',
      'font-family: monospace'
    ].filter(Boolean).join('; ');

    return `
      <div style="${styles}">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Promo Code</div>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px;">${escapeHtml(data.code || 'SAVE20')}</div>
        <div style="font-size: 14px; margin-bottom: 8px;">${escapeHtml(data.description || 'Use this code for discount')}</div>
        ${data.validUntil ? `<div style="font-size: 12px; opacity: 0.8;">Valid until: ${escapeHtml(data.validUntil)}</div>` : ''}
      </div>
    `;
  },

  // ========== 28. PRICE WIDGET ==========
  // ========== 28. PRICE WIDGET ==========
  'price': (d) => {
    const data = d || {};
    const features = data.features || [];

    // Format amount based on decimals and showDecimals settings
    let formattedAmount = data.amount || '0';
    if (!data.amount) {
      formattedAmount = '0';
    } else {
      const amountNum = parseFloat((data.amount || "").toString().replace(/[^0-9.-]+/g, ""));
      if (!isNaN(amountNum)) {
        let decimalPlaces = 2; // Default
        if (data.showDecimals === false) {
          decimalPlaces = 0;
        } else if (data.decimals !== undefined) {
          decimalPlaces = parseInt(data.decimals, 10);
        }
        formattedAmount = amountNum.toFixed(decimalPlaces);
      }
    }

    const styles = [
      'border: 2px solid #dee2e6',
      'border-radius: 12px',
      'overflow: hidden',
      'background-color: #ffffff',
      'text-align: center'
    ].filter(Boolean).join('; ');

    const featuresHtml = features.map((feature: string) => `
      <div style="padding: 8px 0; border-bottom: 1px solid #f1f3f5;">
        <span style="color: #28a745; margin-right: 8px;">✓</span>
        ${escapeHtml(feature)}
      </div>
    `).join('');

    return `
      <div style="${styles}">
        <div style="background-color: #f8f9fa; padding: 24px; border-bottom: 2px solid #dee2e6;">
          <div style="font-size: 14px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Pricing Plan</div>
          <div style="font-size: 48px; font-weight: bold; color: #2d3748; margin-bottom: 4px;">
            <span style="font-size: 24px; vertical-align: super;">${escapeHtml(data.currencySymbol || data.currency || '$')}</span>
            ${escapeHtml(formattedAmount)}
          </div>
          <div style="font-size: 16px; color: #6c757d;">${escapeHtml(data.period || '/month')}</div>
        </div>
        <div style="padding: 24px;">
          <div style="margin-bottom: 16px;">
            ${featuresHtml || '<div style="color: #6c757d; font-style: italic;">No features listed</div>'}
          </div>
          <a href="${escapeHtml(data.buttonUrl || '#')}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; width: 100%; box-sizing: border-box;">
            ${escapeHtml(data.buttonText || 'Get Started')}
          </a>
        </div>
      </div>
    `;
  },

  // ========== 29. TESTIMONIAL WIDGET ==========
  'testimonial': (d) => {
    const data = d || {};
    const stars = '★'.repeat(Math.min(data.rating || 5, 5));

    const styles = [
      'border-left: 4px solid #007bff',
      'background-color: #f8f9fa',
      'padding: 24px',
      'border-radius: 0 8px 8px 0',
      'position: relative'
    ].filter(Boolean).join('; ');

    return `
      <div style="${styles}">
        <div style="color: #ffc107; font-size: 20px; margin-bottom: 12px;">${stars}</div>
        <div style="font-size: 18px; font-style: italic; color: #495057; margin-bottom: 20px; line-height: 1.6;">
          "${escapeHtml(data.quote || 'This is an amazing product!')}"
        </div>
        <div style="display: flex; align-items: center;">
          ${data.avatar ? `<img src="${escapeHtml(data.avatar)}" alt="${escapeHtml(data.author || 'Author')}" style="width: 48px; height: 48px; border-radius: 50%; margin-right: 12px; object-fit: cover;" />` : ''}
          <div>
            <div style="font-weight: bold; color: #2d3748;">${escapeHtml(data.author || 'John Doe')}</div>
            <div style="font-size: 14px; color: #6c757d;">${escapeHtml(data.position || 'CEO, Company Inc')}</div>
          </div>
        </div>
      </div>
    `;
  },

  // ========== 30. NAVBAR WIDGET ==========
  'navbar': (d) => {
    const data = d || {};
    const links = data.links || [];

    const styles = [
      `background-color: ${data.backgroundColor || '#333'}`,
      `color: ${data.textColor || '#fff'}`,
      'padding: 16px',
      'border-radius: 4px'
    ].filter(Boolean).join('; ');

    const linksHtml = links.map((link: any) => `
      <a href="${escapeHtml(link.url || '#')}" 
         style="color: ${data.textColor || '#fff'}; text-decoration: none; margin: 0 16px; font-weight: 500;"
         target="_blank" rel="noopener">
        ${escapeHtml(link.text || 'Link')}
      </a>
    `).join('');

    const logoHtml = data.logo ? `<img src="${escapeHtml(data.logo)}" alt="Logo" style="height: 32px; margin-right: 24px;" />` : '';

    return `
      <div style="${styles}">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            ${logoHtml}
            <div style="font-weight: bold; font-size: 20px;">Brand</div>
          </div>
          <div>
            ${linksHtml}
          </div>
        </div>
      </div>
    `;
  },

  // ========== 31. CARD WIDGET ==========
  // ========== 31. CARD WIDGET ==========
  'card': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#ffffff'}`,
      `color: ${data.textColor || '#333333'}`,
      data.border ? `border: 1px solid ${data.borderColor || '#ddd'}` : '',
      data.shadow ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)' : '',
      `border-radius: ${data.borderRadius || 8}px`,
      `max-width: 400px`,
      'overflow: hidden',
      'margin: 0 auto'
    ].filter(Boolean).join('; ');

    return `
      <div style="${styles}">
        ${data.imageUrl || data.image ? `<img src="${escapeHtml(data.imageUrl || data.image)}" alt="Card image" style="width: 100%; height: 200px; object-fit: cover; display: block;" />` : ''}
        <div style="padding: 20px;">
          ${data.title ? `<h3 style="margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: bold; color: ${data.textColor || '#333333'};">${escapeHtml(data.title)}</h3>` : ''}
          ${data.content ? `<div style="line-height: 1.6; color: ${data.textColor || '#666666'};">${escapeHtml(data.content)}</div>` : ''}
        </div>
      </div>
    `;
  },

  // ========== 32. ALERT WIDGET ==========
  'alert': (d) => {
    const data = d || {};
    const typeColors: Record<string, { bg: string, border: string, text: string }> = {
      'info': { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
      'success': { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
      'warning': { bg: '#fff3cd', border: '#ffeeba', text: '#856404' },
      'error': { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' }
    };

    const colors = typeColors[data.type || 'info'] || typeColors.info;

    const styles = [
      `background-color: ${data.backgroundColor || colors.bg}`,
      `color: ${data.textColor || colors.text}`,
      'border: 1px solid',
      `border-color: ${colors.border}`,
      'border-radius: 4px',
      'padding: 16px',
      'position: relative'
    ].filter(Boolean).join('; ');

    const closeButton = data.closable !== false ? `
      <button style="
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: inherit;
        opacity: 0.5;
      " onclick="this.parentElement.style.display='none'">×</button>
    ` : '';

    return `
      <div style="${styles}">
        ${closeButton}
        ${data.title ? `<div style="font-weight: bold; margin-bottom: 8px;">${escapeHtml(data.title)}</div>` : ''}
        <div>${escapeHtml(data.message || 'Alert message')}</div>
      </div>
    `;
  },

  // ========== 33. PROGRESS WIDGET ==========
  'progress': (d) => {
    const data = d || {};
    const steps = data.steps || ['Step 1', 'Step 2', 'Step 3'];
    const currentStep = Math.min(Math.max(data.currentStep || 1, 1), steps.length);
    const orientation = data.orientation || 'horizontal';

    if (orientation === 'vertical') {
      return `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${steps.map((step: string, index: number) => `
            <div style="display: flex; align-items: center;">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: ${index + 1 <= currentStep ? '#007bff' : '#e9ecef'};
                color: ${index + 1 <= currentStep ? 'white' : '#6c757d'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                margin-right: 12px;
              ">${index + 1}</div>
              <div style="color: ${index + 1 <= currentStep ? '#007bff' : '#6c757d'}; font-weight: ${index + 1 <= currentStep ? 'bold' : 'normal'}">
                ${escapeHtml(step)}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Horizontal progress
    return `
      <div style="position: relative; padding: 40px 0 20px;">
        <div style="position: absolute; top: 12px; left: 0; right: 0; height: 4px; background-color: #e9ecef; z-index: 1;"></div>
        <div style="position: absolute; top: 12px; left: 0; width: ${((currentStep - 1) / (steps.length - 1)) * 100}%; height: 4px; background-color: #007bff; z-index: 2; transition: width 0.3s ease;"></div>
        <div style="display: flex; justify-content: space-between; position: relative; z-index: 3;">
          ${steps.map((step: string, index: number) => `
            <div style="text-align: center; flex: 1;">
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: ${index + 1 <= currentStep ? '#007bff' : '#e9ecef'};
                color: ${index + 1 <= currentStep ? 'white' : '#6c757d'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                margin: 0 auto 8px;
              ">${index + 1}</div>
              <div style="font-size: 12px; color: ${index + 1 <= currentStep ? '#007bff' : '#6c757d'}; max-width: 100px; margin: 0 auto;">
                ${escapeHtml(step)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ========== 34. FORM WIDGET ==========
  'form': (d) => {
    const data = d || {};
    const fields = data.fields || [];

    const styles = [
      'background-color: #f8f9fa',
      'border: 1px solid #dee2e6',
      'border-radius: 8px',
      'padding: 24px'
    ].filter(Boolean).join('; ');

    const fieldsHtml = fields.map((field: any) => {
      const required = field.required ? 'required' : '';
      let fieldHtml = '';

      switch (field.type) {
        case 'textarea':
          fieldHtml = `<textarea name="${escapeHtml(field.name)}" placeholder="${escapeHtml(field.label)}" ${required} style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;"></textarea>`;
          break;
        case 'select':
          fieldHtml = `<select name="${escapeHtml(field.name)}" ${required} style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;"></select>`;
          break;
        default:
          fieldHtml = `<input type="${field.type}" name="${escapeHtml(field.name)}" placeholder="${escapeHtml(field.label)}" ${required} style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box;" />`;
      }

      return `
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #495057;">
            ${escapeHtml(field.label)} ${field.required ? '<span style="color: #dc3545;">*</span>' : ''}
          </label>
          ${fieldHtml}
        </div>
      `;
    }).join('');

    return `
      <div style="${styles}">
        <form action="${escapeHtml(data.action || '#')}" method="${data.method || 'post'}" style="width: 100%;">
          ${fieldsHtml || '<div style="text-align: center; color: #6c757d; padding: 20px;">No form fields defined</div>'}
          <button type="submit" style="
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
          ">
            ${escapeHtml(data.submitText || 'Submit')}
          </button>
        </form>
      </div>
    `;
  },

  // ========== 35. SURVEY WIDGET ==========
  'survey': (d) => {
    const data = d || {};
    const options = data.options || [];

    const styles = [
      'background-color: #ffffff',
      'border: 2px solid #007bff',
      'border-radius: 8px',
      'padding: 24px'
    ].filter(Boolean).join('; ');

    const optionsHtml = options.map((option: string, index: number) => `
      <label style="display: block; margin-bottom: 12px; padding: 12px; background-color: #f8f9fa; border-radius: 4px; cursor: pointer;">
        <input type="${data.multiple ? 'checkbox' : 'radio'}" name="survey" value="${index}" style="margin-right: 8px;" />
        ${escapeHtml(option)}
      </label>
    `).join('');

    return `
      <div style="${styles}">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #2d3748;">
          ${escapeHtml(data.question || 'Survey Question')}
          ${data.required ? '<span style="color: #dc3545;">*</span>' : ''}
        </div>
        ${optionsHtml || '<div style="text-align: center; color: #6c757d; padding: 20px;">No options available</div>'}
        <div style="margin-top: 16px; text-align: right;">
          <button style="
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
          ">
            Vote
          </button>
        </div>
      </div>
    `;
  },

  // ========== 36. INPUT WIDGET ==========
  'input': (d) => {
    const data = d || {};
    const styles = [
      'width: 100%',
      'padding: 12px',
      'border: 1px solid #ced4da',
      'border-radius: 4px',
      'box-sizing: border-box',
      'font-size: 16px'
    ].filter(Boolean).join('; ');

    return `
      <div style="width: 100%;">
        ${data.label ? `<label style="display: block; margin-bottom: 8px; font-weight: 500; color: #495057;">${escapeHtml(data.label)}${data.required ? ' <span style="color: #dc3545;">*</span>' : ''}</label>` : ''}
        <input type="${data.type || 'text'}" 
               name="${escapeHtml(data.name || 'input')}" 
               placeholder="${escapeHtml(data.placeholder || 'Enter text')}" 
               ${data.required ? 'required' : ''}
               style="${styles}" />
      </div>
    `;
  },

  // ========== 37. TEXTAREA WIDGET ==========
  'textarea': (d) => {
    const data = d || {};
    const styles = [
      'width: 100%',
      'padding: 12px',
      'border: 1px solid #ced4da',
      'border-radius: 4px',
      'box-sizing: border-box',
      'font-size: 16px',
      'resize: vertical',
      'min-height: 100px'
    ].filter(Boolean).join('; ');

    return `
      <div style="width: 100%;">
        ${data.label ? `<label style="display: block; margin-bottom: 8px; font-weight: 500; color: #495057;">${escapeHtml(data.label)}${data.required ? ' <span style="color: #dc3545;">*</span>' : ''}</label>` : ''}
        <textarea name="${escapeHtml(data.name || 'textarea')}" 
                  placeholder="${escapeHtml(data.placeholder || 'Enter your message')}" 
                  rows="${data.rows || 4}"
                  ${data.required ? 'required' : ''}
                  style="${styles}"></textarea>
      </div>
    `;
  },

  // ========== 38. SELECT WIDGET ==========
  'select': (d) => {
    const data = d || {};
    const options = data.options || [];
    const styles = [
      'width: 100%',
      'padding: 12px',
      'border: 1px solid #ced4da',
      'border-radius: 4px',
      'box-sizing: border-box',
      'font-size: 16px',
      'background-color: white'
    ].filter(Boolean).join('; ');

    const optionsHtml = options.map((option: string) => `
      <option value="${escapeHtml(option)}">${escapeHtml(option)}</option>
    `).join('');

    return `
      <div style="width: 100%;">
        ${data.label ? `<label style="display: block; margin-bottom: 8px; font-weight: 500; color: #495057;">${escapeHtml(data.label)}${data.required ? ' <span style="color: #dc3545;">*</span>' : ''}</label>` : ''}
        <select name="${escapeHtml(data.name || 'select')}" 
                ${data.multiple ? 'multiple' : ''}
                ${data.required ? 'required' : ''}
                style="${styles}">
          ${optionsHtml || '<option value="">No options available</option>'}
        </select>
      </div>
    `;
  },

  // ========== 39. CHECKBOX WIDGET ==========
  'checkbox': (d) => {
    const data = d || {};
    const styles = [
      'margin-right: 8px',
      'transform: scale(1.2)'
    ].filter(Boolean).join('; ');

    return `
      <label style="display: flex; align-items: center; cursor: pointer;">
        <input type="checkbox" 
               name="${escapeHtml(data.name || 'checkbox')}" 
               value="${escapeHtml(data.value || '1')}"
               ${data.checked ? 'checked' : ''}
               style="${styles}" />
        <span>${escapeHtml(data.label || 'Checkbox')}</span>
      </label>
    `;
  },

  // ========== 40. RADIO WIDGET ==========
  'radio': (d) => {
    const data = d || {};
    const options = data.options || [];

    if (options.length === 0) {
      return '<div style="color: #6c757d; font-style: italic;">No radio options</div>';
    }

    const optionsHtml = options.map((option: string) => `
      <label style="display: block; margin-bottom: 8px; cursor: pointer;">
        <input type="radio" 
               name="${escapeHtml(data.name || 'radio')}" 
               value="${escapeHtml(option)}"
               ${data.selected === option ? 'checked' : ''}
               style="margin-right: 8px;" />
        ${escapeHtml(option)}
      </label>
    `).join('');

    return `
      <div>
        ${data.label ? `<div style="font-weight: 500; margin-bottom: 12px; color: #495057;">${escapeHtml(data.label)}</div>` : ''}
        ${optionsHtml}
      </div>
    `;
  },

  // ========== 41. LABEL WIDGET ==========
  'label': (d) => {
    const data = d || {};
    const styles = [
      `font-size: ${data.fontSize || 14}px`,
      `font-weight: ${data.fontWeight || 'normal'}`,
      `color: ${data.color || '#333'}`,
      'display: block',
      'margin-bottom: 4px'
    ].filter(Boolean).join('; ');

    return `<label for="${escapeHtml(data.for || '')}" style="${styles}">${escapeHtml(data.text || 'Label')}</label>`;
  },

  // ========== 42. EMAIL HEADER WIDGET ==========
  'emailHeader': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#4CAF50'}`,
      `color: ${data.textColor || '#ffffff'}`,
      `padding: ${data.padding || '20px'}`,
      `text-align: ${data.textAlign || 'center'}`,
      data.fontFamily && `font-family: ${data.fontFamily}`
    ].filter(Boolean).join('; ');

    const logoHtml = data.showLogo ? `
      <div style="margin-bottom: 10px;">
        <img src="${escapeHtml(data.logoUrl || 'https://via.placeholder.com/150x50?text=Logo')}" alt="Store Logo" style="max-width: ${data.logoWidth || '150px'}; height: auto; display: block; margin: 0 auto;" />
      </div>
    ` : '';

    const storeName = data.storeName || '{{site_title}}';
    const tagline = data.tagline || 'Quality products, delivered to your door';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="padding: 0;">
            ${logoHtml}
            <div style="font-size: ${data.fontSize || '28px'}; font-weight: ${data.fontWeight || 'bold'}; margin-bottom: 5px; color: ${data.textColor || '#ffffff'};">
              ${escapeHtml(storeName)}
            </div>
            ${data.showTagline ? `<div style="font-size: ${data.taglineFontSize || '14px'}; opacity: 0.9; color: ${data.textColor || '#ffffff'};">${escapeHtml(tagline)}</div>` : ''}
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 43. EMAIL FOOTER WIDGET ==========
  'emailFooter': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#333333'}`,
      `color: ${data.textColor || '#ffffff'}`,
      `padding: ${data.padding || '30px 20px'}`,
      `text-align: center`,
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`
    ].filter(Boolean).join('; ');

    const linkColor = data.linkColor || '#4CAF50';

    // Social icons with proper links
    const socialIconsHtml = data.showSocialMedia !== false ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 15px; border-collapse: collapse;">
        <tr>
          <td style="padding: 0 5px;">
            <a href="${escapeHtml(data.facebookUrl || '#')}" style="text-decoration: none;" target="_blank" rel="noopener">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="32" height="32" style="display: block; width: 32px; height: 32px; border: 0;" />
            </a>
          </td>
          <td style="padding: 0 5px;">
            <a href="${escapeHtml(data.twitterUrl || '#')}" style="text-decoration: none;" target="_blank" rel="noopener">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="32" height="32" style="display: block; width: 32px; height: 32px; border: 0;" />
            </a>
          </td>
          <td style="padding: 0 5px;">
            <a href="${escapeHtml(data.instagramUrl || '#')}" style="text-decoration: none;" target="_blank" rel="noopener">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="32" height="32" style="display: block; width: 32px; height: 32px; border: 0;" />
            </a>
          </td>
        </tr>
      </table>
    ` : '';

    const addressHtml = data.showAddress !== false ? `
      <div style="margin-bottom: 10px; font-size: 12px; color: ${data.textColor || '#ffffff'};">
        ${escapeHtml(data.storeAddress || '123 Main Street, New York, NY 10001')}
      </div>
    ` : '';

    const contactHtml = data.showContact !== false ? `
      <div style="margin-bottom: 10px; font-size: 12px; color: ${data.textColor || '#ffffff'};">
        Email: ${escapeHtml(data.contactEmail || 'support@yourstore.com')} | Phone: ${escapeHtml(data.contactPhone || '+1 (555) 123-4567')}
      </div>
    ` : '';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="padding: 0;">
            ${socialIconsHtml}
            ${addressHtml}
            ${contactHtml}
            <div style="margin-bottom: 15px; font-size: 12px;">
              <a href="#" style="color: ${linkColor}; margin: 0 10px; text-decoration: none;" target="_blank" rel="noopener">Privacy Policy</a>
              <a href="#" style="color: ${linkColor}; margin: 0 10px; text-decoration: none;" target="_blank" rel="noopener">Terms of Service</a>
              <a href="#" style="color: ${linkColor}; margin: 0 10px; text-decoration: none;" target="_blank" rel="noopener">Unsubscribe</a>
            </div>
            <div style="font-size: 11px; opacity: 0.8; color: ${data.textColor || '#ffffff'};">
              &copy; ${new Date().getFullYear()} ${escapeHtml(data.storeName || '{{site_title}}')}. All rights reserved.
            </div>
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 44. CTA BUTTON WIDGET ==========
  'ctaButton': (d) => {
    const data = d || {};

    const containerStyles = [
      `padding: ${data.padding || '20px'}`,
      `text-align: ${data.alignment || 'center'}`
    ].filter(Boolean).join('; ');

    const buttonStyles = [
      `background-color: ${data.backgroundColor || '#4CAF50'}`,
      `color: ${data.textColor || '#ffffff'}`,
      data.fontFamily && `font-family: ${data.fontFamily}`,
      `font-size: ${data.fontSize || '16px'}`,
      `font-weight: ${data.fontWeight || 'bold'}`,
      `padding: ${data.buttonPadding || '12px 30px'}`,
      `border-radius: ${data.borderRadius || '5px'}`,
      `text-transform: none`,
      `min-width: ${data.minWidth || '200px'}`,
      `display: inline-block`,
      `text-decoration: none`
    ].filter(Boolean).join('; ');

    return `
      <div style="${containerStyles}">
        <a href="${escapeHtml(data.buttonUrl || '#')}" style="${buttonStyles}">
          ${escapeHtml(data.buttonText || '{{button_text}}')}
        </a>
      </div>
    `;
  },

  // ========== 45. RELATED PRODUCTS WIDGET ==========
  'relatedProducts': (d) => {
    const data = d || {};
    const styles = [
      `padding: ${data.padding || '20px'}`,
      `background-color: ${data.backgroundColor || '#f9f9f9'}`,
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`
    ].filter(Boolean).join('; ');

    const titleStyles = [
      `text-align: center`,
      `margin-bottom: 20px`,
      `font-weight: ${data.titleFontWeight || 'bold'}`,
      `color: ${data.titleColor || '#333'}`,
      `font-size: 24px` // Approx h5
    ].filter(Boolean).join('; ');

    const cardStyles = [
      `background-color: #fff`,
      `height: 100%`,
      `display: flex`,
      `flex-direction: column`,
      data.showCardShadow !== false ? (data.cardShadow ? `box-shadow: ${data.cardShadow}` : `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`) : '',
      `border-radius: 4px`,
      `overflow: hidden`
    ].filter(Boolean).join('; ');

    // Generate strict placeholders for products
    // We'll generate the requested number of product slots (productsToShow)
    // using placeholders {{product_name_1}}, {{product_price_1}} etc.
    const count = data.productsToShow || 3;
    let productsHtml = '';

    for (let i = 1; i <= count; i++) {
      const name = data.useManualData ? (data[`p${i}_name`] || `{{product_name_${i}}}`) : `{{product_name_${i}}}`;
      const price = data.useManualData ? (data[`p${i}_price`] || `{{product_price_${i}}}`) : `{{product_price_${i}}}`;
      const image = data.useManualData ? (data[`p${i}_image`] || `{{product_image_${i}}}`) : `{{product_image_${i}}}`;
      const url = data.useManualData ? (data[`p${i}_url`] || `{{product_url_${i}}}`) : `{{product_url_${i}}}`;

      const imgHtml = data.showImages !== false ? `
          <img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
        ` : '';

      productsHtml += `
          <div style="width: 30%; min-width: 200px; flex-grow: 1; margin: 10px;">
            <div style="${cardStyles}">
              ${imgHtml}
              <div style="padding: 16px; text-align: center; flex-grow: 1;">
                 <div style="font-size: 16px; margin-bottom: 8px; font-weight: bold;">${escapeHtml(name)}</div>
                 <div style="color: ${data.priceColor || '#4CAF50'}; font-weight: bold; margin-bottom: 10px; font-size: 16px;">${escapeHtml(price)}</div>
                 <a href="${escapeHtml(url)}" style="
                    display: inline-block;
                    background-color: ${data.buttonColor || '#4CAF50'};
                    color: #fff;
                    padding: 6px 16px;
                    border-radius: 4px;
                    text-decoration: none;
                    font-size: 14px;
                 ">${data.buttonText || 'View Product'}</a>
              </div>
            </div>
          </div>
        `;
    }

    return `
      <div style="${styles}">
        <div style="${titleStyles}">
          ${data.title || '{{related_products_title}}'}
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center;">
          ${productsHtml}
        </div>
      </div>
    `;
  },

  'orderSubtotal': (d) => {
    const data = d || {};
    const spacing = data.spacing || 0;

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      'padding: 10px',
    ].filter(Boolean).join('; ');

    // If using the placeholder {{order_totals_table}} or {{order_subtotal}}, render full table
    if (data.value === '{{order_totals_table}}' || data.value === '{{order_subtotal}}' || !data.value) {
      const rows = [
        { label: 'Subtotal', value: '{{order_subtotal}}' },
        { label: 'Discount', value: '-{{order_discount}}', color: '#e53e3e' },
        { label: 'Shipping', value: '{{order_shipping}}' },
        { label: 'Order fully refunded', value: '-{{order_total}}', weight: 'bold', border: true },
        { label: 'Refund', value: '-{{refund_amount}}' },
      ];

      return `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
          ${rows.map((row, index) => `
            <tr${index < rows.length - 1 ? ` style="margin-bottom: ${spacing}px;"` : ''}>
              <td style="padding: ${spacing}px 0; ${row.weight ? `font-weight: ${row.weight};` : ''} ${row.border ? 'border-top: 1px solid #eee;' : ''} ${row.color ? `color: ${row.color};` : ''}">
                ${row.label}:
              </td>
              <td align="right" style="padding: ${spacing}px 0; ${row.weight ? `font-weight: ${row.weight};` : ''} ${row.border ? 'border-top: 1px solid #eee;' : ''} ${row.color ? `color: ${row.color};` : ''}">
                ${row.value}
              </td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    // Manual mode - render just the label and value
    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="font-weight: bold; padding: ${spacing}px 0;">${escapeHtml(data.label || 'Subtotal')}:</td>
          <td align="right" style="padding: ${spacing}px 0;">${escapeHtml(data.value)}</td>
        </tr>
      </table>
    `;
  },

  // ========== 47. ORDER TOTAL WIDGET ==========
  'orderTotal': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      'padding: 10px',
    ].filter(Boolean).join('; ');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="font-weight: bold; font-size: 1.2em;">${escapeHtml(data.label || 'Total')}:</td>
          <td align="right" style="font-weight: bold; font-size: 1.2em;">${escapeHtml(data.value || '{{order_total}}')}</td>
        </tr>
      </table>
    `;
  },

  // ========== 48. SHIPPING METHOD WIDGET ==========
  'shippingMethod': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      'padding: 10px',
    ].filter(Boolean).join('; ');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="font-weight: bold;">${escapeHtml(data.label || 'Shipping Method')}:</td>
          <td align="right">${escapeHtml(data.value || '{{shipping_method}}')}</td>
        </tr>
      </table>
    `;
  },

  // ========== 49. PAYMENT METHOD WIDGET ==========
  'paymentMethod': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      'padding: 10px',
    ].filter(Boolean).join('; ');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="font-weight: bold;">${escapeHtml(data.label || 'Payment Method')}:</td>
          <td align="right">${escapeHtml(data.value || '{{payment_method}}')}</td>
        </tr>
      </table>
    `;
  },

  // ========== 50. CUSTOMER NOTE WIDGET ==========
  'customerNote': (d) => {
    const data = d || {};
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.textAlign && `text-align: ${data.textAlign}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      'padding: 10px',
    ].filter(Boolean).join('; ');

    const label = data.label === 'Customer Note' || !data.label ? 'Note' : data.label;

    return `
      <div style="${styles}">
        <div style="font-weight: bold; margin-bottom: 5px;">${escapeHtml(label)}:</div>
        <div style="padding: 10px; background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; font-style: italic;">
          ${escapeHtml(data.value || '{{customer_note}}')}
        </div>
      </div>
    `;
  },

  // ========== UNKNOWN WIDGET FALLBACK ==========
  'unknown': (d) => {
    return `<div style="padding: 20px; background-color: #f8f9fa; border: 2px dashed #dee2e6; text-align: center; color: #6c757d; font-family: Arial, sans-serif;">
      <div style="font-weight: bold; margin-bottom: 8px;">Unsupported Widget</div>
      <div style="font-size: 13px;">This widget type is not supported in HTML export.</div>
    </div>`;
  }

};

// ========== HELPER FUNCTIONS ==========
function parseContentData(contentData: string | null): any {
  if (!contentData) return null;
  try {
    return JSON.parse(contentData);
  } catch {
    return contentData;
  }
}


function escapeHtml(text: any): string {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSocialIconHtml(platform: string, size: number = 24, color: string = '#666666'): string {
  const socialIconImages: Record<string, string> = {
    facebook: 'https://img.icons8.com/color/48/facebook-new.png',
    twitter: 'https://img.icons8.com/color/48/twitter--v1.png',
    linkedin: 'https://img.icons8.com/color/48/linkedin.png',
    instagram: 'https://img.icons8.com/color/48/instagram-new.png',
    pinterest: 'https://img.icons8.com/color/48/pinterest--v1.png',
    youtube: 'https://img.icons8.com/color/48/youtube-play.png',
    whatsapp: 'https://img.icons8.com/color/48/whatsapp--v1.png',
    reddit: 'https://img.icons8.com/color/48/reddit.png',
    github: 'https://img.icons8.com/ios-filled/50/000000/github.png',
    telegram: 'https://img.icons8.com/color/48/telegram-app.png',
    envelope: 'https://img.icons8.com/color/48/email.png',
  };

  const src = socialIconImages[platform] || 'https://via.placeholder.com/24';
  return `<img src="${src}" alt="${platform}" width="${size}" height="${size}" style="display: block; border: 0;" />`;
}