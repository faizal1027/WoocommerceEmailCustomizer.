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
      data.lineHeight && `line-height: ${data.lineHeight}px`,
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
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.letterSpace && `letter-spacing: ${data.letterSpace}px`,
      data.padding?.top !== undefined ? `padding: ${data.padding.top}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px` : '',
      'margin: 0',
      'word-break: break-word',
      'white-space: pre-wrap'
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
      btnData.lineHeight && `line-height: ${btnData.lineHeight}px`,
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
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : 'background-color: #ffffff',
      data.padding && `padding: ${data.padding}`,
      `border: 1px solid #dddddd`,
      `border-collapse: collapse`
    ].filter(Boolean).join('; ');

    const innerTableStyles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: ${data.padding || '15px'};">
          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse: collapse; ${innerTableStyles}">
            <tr style="background-color: #f8f9fa;">
              <td colspan="2" style="padding: 12px; font-weight: bold; font-size: 1.2em; border-bottom: 2px solid #dee2e6;">Tax Invoice #${orderNumber}</td>
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
              <td style="padding: 10px 8px; border-bottom: 1px solid #eee;">Tax Rate</td>
              <td align="right" style="padding: 10px 8px; border-bottom: 1px solid #eee;">{{tax_rate}}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Total</td>
              <td align="right" style="padding: 8px; font-weight: bold;">${total}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 15px; background-color: #f9f9f9; border-top: 1px solid #ddd; ${innerTableStyles}">
                <div style="font-weight: bold; margin-bottom: 8px;">Billing Address:</div>
                <div style="color: inherit;">{{billing_first_name}} {{billing_last_name}}</div>
                <div style="color: inherit;">{{billing_address_1}}</div>
                <div style="color: inherit;">{{billing_address_2}}</div>
                <div style="color: inherit;">{{billing_city}}, {{billing_state}} {{billing_postcode}}</div>
                <div style="color: inherit;">{{billing_country}}</div>
              </td>
            </tr>
          </table>
        </td>
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
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : 'background-color: #ffffff',
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: ${data.padding || '16px'}; vertical-align: top;">
          <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 12px; text-align: ${data.textAlign || 'left'};">BILL TO:</div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Name:</strong> {{billing_first_name}} {{billing_last_name}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Phone:</strong> {{billing_phone}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Email:</strong> {{billing_email}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Address Line 1:</strong> {{billing_address_1}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Address Line 2:</strong> {{billing_address_2}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>City:</strong> {{billing_city}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>State:</strong> {{billing_state}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Postal Code:</strong> {{billing_postcode}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
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
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : 'background-color: #ffffff',
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: ${data.padding || '16px'}; vertical-align: top;">
          <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 12px; text-align: ${data.textAlign || 'left'};">SHIP TO:</div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Name:</strong> {{shipping_first_name}} {{shipping_last_name}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Phone:</strong> {{shipping_phone}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Email:</strong> {{shipping_email}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Address Line 1:</strong> {{shipping_address_1}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Address Line 2:</strong> {{shipping_address_2}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>City:</strong> {{shipping_city}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>State:</strong> {{shipping_state}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
            <strong>Postal Code:</strong> {{shipping_postcode}}
          </div>
          <div style="margin-bottom: 4px; line-height: 1.6; color: inherit;">
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

    const textStyle = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
    ].filter(Boolean).join('; ');

    const alignmentStyle = `text-align: ${data.textAlign || 'left'}`;
    const backgroundStyle = data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '';

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px; ${textStyle}; ${backgroundStyle}">
      <tr>
        <td style="padding: ${data.padding || '0px'};">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 16px; ${alignmentStyle}; ${textStyle}">${data.orderNumberTitle || '[Order'} #${escapeHtml(orderNumber)}] (${escapeHtml(orderDate)})</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #dee2e6; border-collapse: collapse; background-color: #ffffff; ${textStyle}">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: bold;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: bold;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6; font-weight: bold;">Price</th>
              </tr>
            </thead>
            <tbody>
              {{order_items_rows}}
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Subtotal:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right;">{{order_subtotal}}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #e53e3e;">Discount:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #e53e3e;">-{{order_discount}}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Payment method:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right;">{{payment_method}}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td colspan="2" style="padding: 12px; font-weight: bold; border-top: 2px solid #dee2e6;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #dee2e6;">{{order_total}}</td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>`;
  },

  // ========== 8. IMAGE WIDGET ==========
  'image': (d) => {
    const data = d || {};

    // Wrapper styles for alignment and padding (matching ImageFieldComponent)
    const containerStyles = [
      `text-align: ${data.align || 'left'}`,
      data.padding ? `padding: ${data.padding.top || 0}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px` : '',
      'width: 100%'
    ].filter(Boolean).join('; ');

    // Image styles
    const imgStyles = [
      data.width ? `width: ${String(data.width).match(/%|px/) ? data.width : data.width + 'px'}` : '',
      data.autoWidth ? 'width: 100%' : '',
      data.borderRadius ? `border-radius: ${data.borderRadius}` : '',
      `max-width: 100%`,
      `height: auto`,
      'display: inline-block'
    ].filter(Boolean).join('; ');

    const altText = data.altText || 'Image';
    const src = data.src || 'https://via.placeholder.com/600x400?text=Image+Placeholder';

    return `
      <div style="${containerStyles}">
        <img src="${escapeHtml(src)}" alt="${escapeHtml(altText)}"${imgStyles ? ` style="${imgStyles}"` : ''} />
      </div>
    `;
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

    const containerStyle = [
      `text-align: ${data.iconAlign || 'center'}`, // Support alignment
      data.padding ? `padding: ${data.padding.top || 10}px ${data.padding.right || 10}px ${data.padding.bottom || 10}px ${data.padding.left || 10}px` : 'padding: 10px',
      'width: 100%'
    ].filter(Boolean).join('; ');

    // Use a wrapper div/table for alignment and padding
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="${containerStyle}; width: 100%;">
      <tr>
        <td align="${data.iconAlign || 'center'}">
          <table role="presentation" cellpadding="0" cellspacing="0" style="display: inline-table;">
            <tr>
              ${iconsHtml}
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
  },


  // ========== 12. SPACER WIDGET ==========
  'spacer': (d) => {
    const data = d || {};
    // Ensure height is parsed correctly (removing 'px' if present in string)
    const heightVal = parseInt(String(data.height || 20), 10);
    const height = isNaN(heightVal) ? 20 : heightVal;
    const bgColor = data.backgroundColor || 'transparent';

    // Must trigger layout with &nbsp; and line-height/font-size
    // Added min-height, clear:both to ensure it consumes space in all clients
    return `<div style="height: ${height}px; line-height: ${height}px; font-size: 0px; background-color: ${bgColor}; width: 100%; min-height: ${height}px; clear: both; display: block;">&nbsp;</div>`;
  },

  // ========== 13. LINK WIDGET ==========
  'link': (d) => {
    const data = d || {};
    // Inner link styles
    const linkStyles = [
      `color: ${data.color || '#007bff'}`,
      `font-size: ${data.fontSize || 14}px`,
      data.underline !== false ? 'text-decoration: underline' : 'text-decoration: none',
      'display: inline-block',
      data.padding ? `padding: ${data.padding.top || 0}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px` : ''
    ].filter(Boolean).join('; ');

    // Container styles for alignment
    const containerStyles = [
      `text-align: ${data.textAlign || 'left'}`,
      'width: 100%'
    ].join('; ');

    return `
      <div style="${containerStyles}">
        <a href="${escapeHtml(data.url || '#')}" style="${linkStyles}" target="_blank" rel="noopener">${escapeHtml(data.text || 'Link')}</a>
      </div>
    `;
  },





  // ========== 16. MAP WIDGET ==========


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

    const iconStyles = [
      `color: ${data.color || '#000000'}`,
      `font-size: ${data.size || 24}px`,
      'display: inline-block',
      'line-height: 1',
      data.paddingTop !== undefined ? `padding: ${data.paddingTop}px ${data.paddingRight || 0}px ${data.paddingBottom || 0}px ${data.paddingLeft || 0}px` : ''
    ].filter(Boolean).join('; ');

    const containerStyles = [
      `text-align: ${data.alignment || 'left'}`,
      'width: 100%'
    ].join('; ');

    let content = `<span style="${iconStyles}">${iconChar}</span>`;

    if (data.link) {
      content = `<a href="${escapeHtml(data.link)}" style="text-decoration: none;" target="_blank" rel="noopener">${content}</a>`;
    }

    return `<div style="${containerStyles}">${content}</div>`;
  },



  // ========== 19. CONTAINER WIDGET ==========
  'container': (d) => {
    const data = d || {};
    const styles = [
      `max-width: ${data.maxWidth || '800px'}`,
      `background-color: ${data.backgroundColor || '#ffffff'}`,
      typeof data.padding === 'object'
        ? `padding: ${data.padding.top || 0}px ${data.padding.right || 0}px ${data.padding.bottom || 0}px ${data.padding.left || 0}px`
        : `padding: ${data.padding || 20}px`,
      data.border?.width ? `border: ${data.border.width}px ${data.border.style || 'solid'} ${data.border.color || '#ddd'}` : '',
      'margin: 0 auto',
      'box-sizing: border-box'
    ].filter(Boolean).join('; ');

    const children = data.children || [];
    let contentHtml = '';

    if (children.length > 0) {
      contentHtml = children.map((child: any) => widgetToHTML(child)).join('');
    } else {
      contentHtml = data.content || '';
    }

    return `<div style="${styles}">${contentHtml}</div>`;
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
  // ========== 22. ROW WIDGET ==========
  'row': (d) => {
    const data = d || {};
    const colCount = data.columns || 2;
    const gap = data.gap || 20;
    const backgroundColor = data.backgroundColor || 'transparent';
    const columnsData = data.columnsData || [];

    // Calculate column width percentages
    const colWidth = Math.floor(100 / colCount);

    const containerStyles = [
      `background-color: ${backgroundColor}`,
      'width: 100%',
      'border-collapse: collapse'
    ].filter(Boolean).join('; ');

    let colsHtml = '';

    for (let i = 0; i < colCount; i++) {
      const colData = columnsData[i];
      let childrenHtml = '';

      if (colData && colData.children && colData.children.length > 0) {
        childrenHtml = colData.children.map((child: any) => {
          return widgetToHTML(child);
        }).join('');
      }

      // Apply gap as padding
      const padding = gap / 2;

      // Use a wrapper div for padding inside TD to ensure gap logic works visually similar to grid
      colsHtml += `
          <td width="${colWidth}%" style="width: ${colWidth}%; padding: ${padding}px; vertical-align: top;">
            ${childrenHtml}
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

  // ========== 24. COUNTDOWN WIDGET ==========
  'countdown': (d) => {
    const data = d || {};
    const title = data.title || '';
    const footer = data.footer || '';
    const titleColor = data.titleColor || '#000000';
    const footerColor = data.footerColor || '#000000';
    const labelColor = data.labelColor || '#333333';
    const boxBgColor = data.backgroundColor || '#d32f2f';
    const valColor = data.textColor || '#ffffff';
    const containerBg = data.containerBgColor && data.containerBgColor !== 'transparent' ? `background-color: ${data.containerBgColor}` : '';

    const units = [
      { label: data.daysLabel || 'Days', value: '07', show: data.showDays !== false },
      { label: data.hoursLabel || 'Hours', value: '02', show: data.showHours !== false },
      { label: data.minutesLabel || 'Minutes', value: '01', show: data.showMinutes !== false },
      { label: data.secondsLabel || 'Seconds', value: '03', show: data.showSeconds !== false }
    ].filter(unit => unit.show);

    const unitsHtml = units.map(unit => `
      <td align="center" style="padding: 0 10px;">
        <div style="color: ${labelColor}; font-size: 14px; font-weight: 500; margin-bottom: 8px; font-family: sans-serif;">${escapeHtml(unit.label)}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="background-color: ${boxBgColor}; border-radius: 12px; width: 80px; height: 80px;">
          <tr>
            <td align="center" valign="middle" style="color: ${valColor}; font-size: 32px; font-weight: bold; font-family: sans-serif;">
              ${unit.value}
            </td>
          </tr>
        </table>
      </td>
    `).join('');

    return `
      <div style="padding: 30px 20px; text-align: center; ${containerBg}">
        ${title ? `<div style="color: ${titleColor}; font-size: 32px; font-weight: 900; text-transform: uppercase; margin-bottom: 25px; font-family: sans-serif;">${escapeHtml(title)}</div>` : ''}
        <table role="presentation" cellpadding="0" cellspacing="0" align="center">
          <tr>
            ${unitsHtml}
          </tr>
        </table>
        ${footer ? `<div style="color: ${footerColor}; font-size: 24px; font-weight: bold; margin-top: 25px; font-family: sans-serif;">${escapeHtml(footer)}</div>` : ''}
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
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${escapeHtml(data.title || 'SPECIAL OFFER!')}</div>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px;">${escapeHtml(data.code || 'SAVE20')}</div>
        <div style="font-size: 14px; margin-bottom: 8px;">${escapeHtml(data.description || 'Use this code to get 20% off your purchase!')}</div>
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

    const currencySymbol = data.showCurrencySymbol !== false ? (data.currencySymbol || '$') : '';
    const currencyCode = data.showCurrencyCode !== false ? (data.currency || 'USD') : '';

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
          <div style="font-size: 14px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${escapeHtml(data.label || 'Price')}</div>
          <div style="font-size: 48px; font-weight: bold; color: #2d3748; margin-bottom: 4px;">
            <span style="font-size: 24px; vertical-align: super;">${escapeHtml(currencySymbol)}</span>
            ${escapeHtml(formattedAmount)}
            <span style="font-size: 0.5em; color: #666; vertical-align: middle;">${escapeHtml(currencyCode)}</span>
          </div>
          <div style="font-size: 16px; color: #6c757d;">${escapeHtml(data.period || '')}</div>
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





  // ========== 42. EMAIL HEADER WIDGET ==========
  'emailHeader': (d) => {
    const data = d || {};
    const styles = [
      `background-color: ${data.backgroundColor || '#4CAF50'}`,
      `color: ${data.textColor || '#ffffff'}`,
      `text-align: ${data.textAlign || 'center'}`,
      data.fontFamily && `font-family: ${data.fontFamily}`
    ].filter(Boolean).join('; ');

    return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
      <tr>
        <td style="padding: ${data.padding || '20px'};">
          ${data.showLogo && data.logoUrl ? `<img src="${escapeHtml(data.logoUrl)}" width="${escapeHtml(data.logoWidth || '150')}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">` : ''}
        </td>
      </tr>
    </table>`;
  },

  // ========== 43. EMAIL FOOTER WIDGET ==========
  'emailFooter': (d) => {
    const data = d || {};
    const textAlign = data.textAlign || 'center';

    const styles = [
      `background-color: ${data.backgroundColor || '#333333'}`,
      `color: ${data.textColor || '#ffffff'}`,
      `text-align: ${textAlign}`,
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`
    ].filter(Boolean).join('; ');

    const linkColor = data.linkColor || '#4CAF50';

    // Social icons with proper links
    const icons = data.socialIcons?.icons || [];
    const urls = data.socialIcons?.urls || [];

    // Determine alignment for flex-like behavior in tables
    const socialMargin = textAlign === 'left' ? '0 auto 15px 0' : textAlign === 'right' ? '0 0 15px auto' : '0 auto 15px';

    const socialIconsHtml = (data.showSocialMedia !== false && icons.length > 0) ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: ${socialMargin}; border-collapse: collapse;">
        <tr>
          ${icons.map((icon: string, index: number) => {
      const url = urls[index] || '#';
      const iconImg = getSocialIconHtml(icon, 32);
      return `
               <td style="padding: 0 5px;">
                 <a href="${escapeHtml(url)}" style="text-decoration: none;" target="_blank" rel="noopener">
                   ${iconImg}
                 </a>
               </td>`;
    }).join('')}
        </tr>
      </table>
    ` : '';

    const addressHtml = data.showAddress !== false ? `
      <div style="margin-bottom: 10px; font-size: inherit; color: inherit;">
        ${escapeHtml(data.storeAddress || '123 Main Street, New York, NY 10001')}
      </div>
    ` : '';

    const contactHtml = data.showContact !== false ? `
      <div style="margin-bottom: 10px; font-size: inherit; color: inherit;">
        ${data.emailLabel || 'Email:'} ${escapeHtml(data.contactEmail || 'support@yourstore.com')} | ${data.phoneLabel || 'Phone:'} ${escapeHtml(data.contactPhone || '+1 (555) 123-4567')}
      </div>
    ` : '';

    const legalLinksHtml = data.showLegal !== false ? `
      <div style="margin-bottom: 15px; font-size: inherit;">
        ${data.privacyLinkUrl ? `<a href="${escapeHtml(data.privacyLinkUrl)}" style="color: ${linkColor}; margin: 0 10px; text-decoration: none;" target="_blank" rel="noopener">${escapeHtml(data.privacyLinkText || 'Privacy Policy')}</a>` : ''}
        ${data.termsLinkUrl ? `<a href="${escapeHtml(data.termsLinkUrl)}" style="color: ${linkColor}; margin: 0 10px; text-decoration: none;" target="_blank" rel="noopener">${escapeHtml(data.termsLinkText || 'Terms & Conditions')}</a>` : ''}
      </div>
    ` : '';

    const currentYear = String(new Date().getFullYear());
    const copyrightContent = data.copyrightText
      ? data.copyrightText.replace('{{year}}', currentYear).replace('{{current_year}}', currentYear)
      : `&copy; ${currentYear} ${escapeHtml(data.storeName || '{{site_title}}')}. All rights reserved.`;

    const copyrightHtml = data.showCopyright !== false ? `
      <div style="font-size: inherit; opacity: 0.8; color: inherit;">
          ${copyrightContent}
      </div>
    ` : '';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="padding: ${data.padding || '30px 20px'};">
            ${socialIconsHtml}
            ${addressHtml}
            ${contactHtml}
            ${legalLinksHtml}
            ${legalLinksHtml}
            ${copyrightHtml}
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 44. CTA BUTTON WIDGET ==========
  'ctaButton': (d) => {
    const data = d || {};

    const containerStyles = [
      `text-align: ${data.alignment || 'center'}`
    ].filter(Boolean).join('; ');

    const buttonStyles = [
      `background-color: ${data.backgroundColor || '#4CAF50'}`,
      `color: ${data.textColor || '#ffffff'}`,
      data.fontFamily && `font-family: ${data.fontFamily}`,
      `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize || '16px'}`,
      `padding: 12px 24px`,
      `text-decoration: none`,
      `border-radius: 4px`,
      `display: inline-block`,
      `font-weight: bold`
    ].filter(Boolean).join('; ');

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${containerStyles}">
        <tr>
          <td style="padding: ${data.padding || '20px'};">
            <a href="${escapeHtml(data.buttonUrl || '#')}" style="${buttonStyles}" target="_blank" rel="noopener">
              ${escapeHtml(data.buttonText || 'Click Here')}
            </a>
          </td>
        </tr>
      </table>`;
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
    const padding = data.padding || '10px';
    const labelAlign = data.labelAlign || 'left';
    const valueAlign = data.valueAlign || 'right';
    const borderWidth = data.borderWidth || 0;
    const borderColor = data.borderColor || '#eeeeee';
    const lastColumnWidth = data.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

    // Outer Styles
    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      `padding: ${borderWidth > 0 ? '0' : padding}`, // Remove outer padding if grid is active
      borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor}` : ''
    ].filter(Boolean).join('; ');

    const tableStyles = `width: 100%; border-collapse: collapse; font-family: inherit; font-size: inherit; color: inherit;`;

    // Cell styling logic
    const getCellPadding = () => borderWidth > 0 ? (padding === '0px' ? '10px' : padding) : `${spacing}px 0`;
    const commonCellStyles = borderWidth > 0 ? `padding: ${getCellPadding()};` : `padding: ${getCellPadding()};`;

    const rows = [
      { label: escapeHtml(data.subtotalLabel || 'Subtotal'), value: '{{order_subtotal}}' },
      { label: escapeHtml(data.discountLabel || 'Discount'), value: '-{{order_discount}}', color: '#e53e3e' },
      { label: escapeHtml(data.shippingLabel || 'Shipping'), value: '{{order_shipping}}' },
      { label: escapeHtml(data.refundedFullyLabel || 'Order fully refunded'), value: '-{{order_total}}', weight: 'bold', border: true }, // Logic handled below
      { label: escapeHtml(data.refundedPartialLabel || 'Refund'), value: '-{{refund_amount}}' },
    ];

    const innerContent = (data.value === '{{order_totals_table}}' || data.value === '{{order_subtotal}}' || !data.value) ? `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${tableStyles}">
          ${rows.map((row, index) => {
      // Border Logic matches React
      const borderBottom = (index < 4 && borderWidth > 0) ? `border-bottom: ${borderWidth}px solid ${borderColor};` : '';
      const borderTop = (row.border && !borderWidth) ? 'border-top: 1px solid #eee;' : '';
      const borderRight = borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : '';
      const verticalAlign = borderWidth > 0 ? 'middle' : 'top'; // Stretch effect simulation

      return `
            <tr>
              <td align="${labelAlign === 'center' ? 'center' : (labelAlign === 'right' ? 'right' : 'left')}" width="${labelColumnWidth}%" style="${commonCellStyles} ${borderBottom} ${borderRight} ${borderTop} font-weight: ${row.weight || data.fontWeight || 'bold'}; ${row.color ? `color: ${row.color};` : ''} vertical-align: ${verticalAlign};">
                ${row.label}:
              </td>
              <td align="${valueAlign === 'center' ? 'center' : (valueAlign === 'left' ? 'left' : 'right')}" width="${lastColumnWidth}%" style="${commonCellStyles} ${borderBottom} ${borderTop} ${row.weight ? `font-weight: ${row.weight};` : ''} ${row.color ? `color: ${row.color};` : ''} vertical-align: ${verticalAlign};">
                ${row.value}
              </td>
            </tr>
          `;
    }).join('')}
        </table>` : `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${tableStyles}">
        <tr>
          <td align="${labelAlign}" width="${labelColumnWidth}%" style="font-weight: ${data.fontWeight || 'bold'}; ${commonCellStyles} ${borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : ''}">${escapeHtml(data.label || 'Subtotal')}:</td>
          <td align="${valueAlign}" width="${lastColumnWidth}%" style="${commonCellStyles}">${escapeHtml(data.value)}</td>
        </tr>
      </table>`;

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${styles}">
        <tr>
          <td style="padding: ${borderWidth > 0 ? '0' : padding};">
            ${innerContent}
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 47. ORDER TOTAL WIDGET ==========
  'orderTotal': (d) => {
    const data = d || {};
    const padding = data.padding || '10px';
    const labelAlign = data.labelAlign || 'left';
    const valueAlign = data.valueAlign || 'right';
    const borderWidth = data.borderWidth || 0;
    const borderColor = data.borderColor || '#eeeeee';
    const lastColumnWidth = data.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      `padding: ${borderWidth > 0 ? '0' : padding}`,
    ].filter(Boolean).join('; ');

    // Only apply border to the outer table if width > 0
    const outerTableStyles = `width: 100%; border-collapse: collapse; ${styles}; ${borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : ''}`;

    // Cell Padding: If border exists, move padding inside cells.
    const cellPadding = borderWidth > 0 ? (padding === '0px' ? '10px' : padding) : '5px 0';
    const verticalAlign = borderWidth > 0 ? 'middle' : 'top';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${outerTableStyles}">
        <tr>
          <td style="padding: ${borderWidth > 0 ? '0' : padding};">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; color: inherit; font-family: inherit; font-size: inherit;">
              <tr>
                <td align="${labelAlign === 'center' ? 'center' : (labelAlign === 'right' ? 'right' : 'left')}" width="${labelColumnWidth}%" style="font-size: 1.2em; padding: ${cellPadding}; ${borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : ''} vertical-align: ${verticalAlign};">${escapeHtml(data.label || 'Total')}:</td>
                <td align="${valueAlign === 'center' ? 'center' : (valueAlign === 'left' ? 'left' : 'right')}" width="${lastColumnWidth}%" style="font-size: 1.2em; padding: ${cellPadding}; vertical-align: ${verticalAlign};">${escapeHtml(data.value || '{{order_total}}')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 48. SHIPPING METHOD WIDGET ==========
  'shippingMethod': (d) => {
    const data = d || {};
    const padding = data.padding || '10px';
    const labelAlign = data.labelAlign || 'left';
    const valueAlign = data.valueAlign || 'right';
    const borderWidth = data.borderWidth || 0;
    const borderColor = data.borderColor || '#eeeeee';
    const lastColumnWidth = data.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      `padding: ${borderWidth > 0 ? '0' : padding}`,
    ].filter(Boolean).join('; ');

    const outerTableStyles = `width: 100%; border-collapse: collapse; ${styles}; ${borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : ''}`;
    const cellPadding = borderWidth > 0 ? (padding === '0px' ? '10px' : padding) : '5px 0';
    const verticalAlign = borderWidth > 0 ? 'middle' : 'top';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${outerTableStyles}">
        <tr>
          <td style="padding: ${borderWidth > 0 ? '0' : padding};">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; color: inherit; font-family: inherit; font-size: inherit;">
              <tr>
                <td align="${labelAlign === 'center' ? 'center' : (labelAlign === 'right' ? 'right' : 'left')}" width="${labelColumnWidth}%" style="padding: ${cellPadding}; ${borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : ''} vertical-align: ${verticalAlign};">${escapeHtml(data.label || 'Shipping Method')}:</td>
                <td align="${valueAlign === 'center' ? 'center' : (valueAlign === 'left' ? 'left' : 'right')}" width="${lastColumnWidth}%" style="padding: ${cellPadding}; vertical-align: ${verticalAlign};">${escapeHtml(data.value || '{{shipping_method}}')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 49. PAYMENT METHOD WIDGET ==========
  'paymentMethod': (d) => {
    const data = d || {};
    const padding = data.padding || '10px';
    const labelAlign = data.labelAlign || 'left';
    const valueAlign = data.valueAlign || 'right';
    const borderWidth = data.borderWidth || 0;
    const borderColor = data.borderColor || '#eeeeee';
    const lastColumnWidth = data.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      `padding: ${borderWidth > 0 ? '0' : padding}`,
    ].filter(Boolean).join('; ');

    const outerTableStyles = `width: 100%; border-collapse: collapse; ${styles}; ${borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : ''}`;
    const cellPadding = borderWidth > 0 ? (padding === '0px' ? '10px' : padding) : '5px 0';
    const verticalAlign = borderWidth > 0 ? 'middle' : 'top';

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${outerTableStyles}">
        <tr>
          <td style="padding: ${borderWidth > 0 ? '0' : padding};">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; color: inherit; font-family: inherit; font-size: inherit;">
              <tr>
                <td align="${labelAlign === 'center' ? 'center' : (labelAlign === 'right' ? 'right' : 'left')}" width="${labelColumnWidth}%" style="padding: ${cellPadding}; ${borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : ''} vertical-align: ${verticalAlign};">${escapeHtml(data.label || 'Payment Method')}:</td>
                <td align="${valueAlign === 'center' ? 'center' : (valueAlign === 'left' ? 'left' : 'right')}" width="${lastColumnWidth}%" style="padding: ${cellPadding}; vertical-align: ${verticalAlign};">${escapeHtml(data.value || '{{payment_method}}')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  },

  // ========== 50. CUSTOMER NOTE WIDGET ==========
  'customerNote': (d) => {
    const data = d || {};
    const padding = data.padding || '10px';
    const labelAlign = data.labelAlign || 'left';
    const valueAlign = data.valueAlign || 'right';
    const borderWidth = data.borderWidth || 0;
    const borderColor = data.borderColor || '#eeeeee';
    const lastColumnWidth = data.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

    const styles = [
      data.fontFamily && `font-family: ${data.fontFamily}`,
      data.fontSize && `font-size: ${typeof data.fontSize === 'number' ? data.fontSize + 'px' : data.fontSize}`,
      data.textColor && `color: ${data.textColor}`,
      data.fontWeight && `font-weight: ${data.fontWeight}`,
      data.lineHeight && `line-height: ${data.lineHeight}px`,
      data.backgroundColor && data.backgroundColor !== 'transparent' ? `background-color: ${data.backgroundColor}` : '',
      `padding: ${borderWidth > 0 ? '0' : padding}`,
    ].filter(Boolean).join('; ');

    const outerTableStyles = `width: 100%; border-collapse: collapse; ${styles}; ${borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : ''}`;
    const cellPadding = borderWidth > 0 ? (padding === '0px' ? '10px' : padding) : '5px 0';
    const verticalAlign = borderWidth > 0 ? 'middle' : 'top';
    const label = data.label === 'Customer Note' || !data.label ? 'Note' : data.label;

    return `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${outerTableStyles}">
        <tr>
          <td style="padding: ${borderWidth > 0 ? '0' : padding};">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; color: inherit; font-family: inherit; font-size: inherit;">
              <tr>
                <td align="${labelAlign === 'center' ? 'center' : (labelAlign === 'right' ? 'right' : 'left')}" width="${labelColumnWidth}%" style="padding: ${cellPadding}; ${borderWidth > 0 ? `border-right: ${borderWidth}px solid ${borderColor};` : ''} vertical-align: ${verticalAlign};">${escapeHtml(label)}:</td>
                <td align="${valueAlign === 'center' ? 'center' : (valueAlign === 'left' ? 'left' : 'right')}" width="${lastColumnWidth}%" style="padding: ${cellPadding}; vertical-align: ${verticalAlign};">${escapeHtml(data.value || '{{customer_note}}')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  },


  // ========== 51. CONTACT WIDGET ==========
  'contact': (d) => {
    const data = d || {};
    const padding = data.padding || '10px';
    const align = data.textAlign || 'center';

    const styles = [
      data.backgroundColor ? `background-color: ${data.backgroundColor}` : '',
      data.textColor ? `color: ${data.textColor}` : '',
      data.fontFamily ? `font-family: ${data.fontFamily}` : '',
      data.fontWeight ? `font-weight: ${data.fontWeight}` : '',
      data.fontWeight ? `font-weight: ${data.fontWeight}` : '',
      data.lineHeight ? `line-height: ${data.lineHeight}px` : '',
      `padding: ${padding}`,
      `text-align: ${align}`
    ].filter(Boolean).join('; ');

    const iconSize = data.iconSize || 20;
    const items = [];

    if (data.showUrl !== false) {
      items.push({ icon: 'home', text: data.url || '{{site_url}}' });
    }
    if (data.showEmail !== false) {
      items.push({ icon: 'email', text: data.email || '{{admin_email}}' });
    }
    if (data.showPhone !== false) {
      items.push({ icon: 'phone', text: data.phone || '' });
    }

    const itemRows = items.map(item => `
      <tr>
        <td style="padding: 5px 5px 5px 0; width: ${iconSize}px; vertical-align: middle;">
           <img src="https://img.icons8.com/ios-filled/50/${data.iconColor ? data.iconColor.replace('#', '') : '333333'}/${item.icon}.png" width="${iconSize}" height="${iconSize}" style="display: block;" alt="${item.icon}" />
        </td>
        <td style="padding: 5px; text-align: left; vertical-align: middle;">
           <span style="font-size: ${data.fontSize || '14px'};">${escapeHtml(item.text)}</span>
        </td>
      </tr>
    `).join('');

    // Determine table alignment props
    const tableAlign = align === 'center' ? 'center' : (align === 'right' ? 'right' : 'left');
    const tableStyle = [
      'width: auto',
      data.fontFamily ? `font-family: ${data.fontFamily}` : '',
      data.textColor ? `color: ${data.textColor}` : '',
      (align === 'center' ? 'margin: 0 auto' : ''),
      (align === 'right' ? 'margin-left: auto' : ''),
    ].filter(Boolean).join('; ');

    const wrapperStyles = [
      data.backgroundColor ? `background-color: ${data.backgroundColor}` : '',
      `padding: ${padding}`,
      `text-align: ${align}` // Aligns the table within the wrapper
    ].filter(Boolean).join('; ');

    return `
      <div style="${wrapperStyles}">
        <table align="${tableAlign}" cellpadding="0" cellspacing="0" role="presentation" style="${tableStyle}">
            ${itemRows}
        </table>
      </div>
    `;
  },

  // ========== 52. PRODUCT DETAILS WIDGET ==========
  'productDetails': (d) => {
    const data = d || {};
    // Product details typically rendered by WooCommerce placeholder {{email_order_items_table}}.
    // We wrap it to apply styles where possible, although WooCommerce styles might override.

    const styles = [
      data.backgroundColor ? `background-color: ${data.backgroundColor}` : '',
      data.padding ? `padding: ${data.padding}` : '',
    ].filter(Boolean).join('; ');

    const placeholder = (data.showImage) ? '{{order_details_table_with_images}}' : '{{order_details_table_basic}}';

    return `
      <div style="${styles}">
          ${placeholder}
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