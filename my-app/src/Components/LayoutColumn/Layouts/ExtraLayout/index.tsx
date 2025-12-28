import React from 'react'
import { Box } from '@mui/material';
import SocialFollowWidget from './Widgets/socialFollowWidget';
import VideoWidget from './Widgets/videoWidget';
import CodeWidget from './Widgets/codeWidget';
import CountdownWidget from './Widgets/countdownWidget';
import ProgressBarWidget from './Widgets/progressBarWidget';
import ProductWidget from './Widgets/productWidget';
import PromoCodeWidget from './Widgets/promoCodeWidget';
import PriceWidget from './Widgets/priceWidget';
import TestimonialWidget from './Widgets/testimonialWidget';
import NavbarWidget from './Widgets/navbarWidget';
import CardWidget from './Widgets/cardWidget';
import AlertWidget from './Widgets/alertWidget';
import ProgressWidget from './Widgets/progressWidget';

export const extraWidgets = [
  { Component: SocialFollowWidget, name: 'Social Follow' },
  { Component: VideoWidget, name: 'Video' },
  { Component: CodeWidget, name: 'Code' },
  { Component: CountdownWidget, name: 'Countdown' },
  { Component: ProgressBarWidget, name: 'Progress Bar' },
  { Component: ProductWidget, name: 'Product' },
  { Component: PromoCodeWidget, name: 'Promo Code' },
  { Component: PriceWidget, name: 'Price' },
  { Component: TestimonialWidget, name: 'Testimonial' },
  { Component: NavbarWidget, name: 'Navbar' },
  { Component: CardWidget, name: 'Card' },
  { Component: AlertWidget, name: 'Alert' },
  { Component: ProgressWidget, name: 'Progress' },
];

const ExtraLayout = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const filteredWidgets = extraWidgets.filter(widget =>
    !searchTerm || widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        p: 2,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1,
        placeItems: "left"
      }}
    >
      {filteredWidgets.map(({ Component, name }) => (
        <Component key={name} />
      ))}
      {filteredWidgets.length === 0 && (
        <Box sx={{ gridColumn: '1 / -1', p: 1, textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}>
          No extra blocks found
        </Box>
      )}
    </Box>
  );
};

export default ExtraLayout;