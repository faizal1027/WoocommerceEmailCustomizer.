import { Box } from '@mui/material';
import ButtonWidget from './Widgets/buttonWidget';
import DividerWidget from './Widgets/dividerWidget';
import HeadingWidget from './Widgets/headingWidget';
import IconWidget from './Widgets/iconWidget';
import ImageBoxWidget from './Widgets/imageBoxWidget';
import ImageWidget from './Widgets/imageWidget';
import LinkBoxWidget from './Widgets/linkBoxWidget';
import LinkWidget from './Widgets/linkWidget';
import MapWidget from './Widgets/mapWidget';
import SectionWidget from './Widgets/sectionWidget';
import SpacerWidget from './Widgets/spacerWidget';
import TextWidget from './Widgets/textWidget';
import SocialIconsWidget from './Widgets/socialIconsWidget';

export const basicsWidgets = [
  { Component: ButtonWidget, name: 'Button' },
  { Component: HeadingWidget, name: 'Heading' },
  { Component: IconWidget, name: 'Icon' },
  { Component: ImageBoxWidget, name: 'Image Box' },
  { Component: TextWidget, name: 'Text' },
  { Component: ImageWidget, name: 'Image' },
  { Component: LinkBoxWidget, name: 'Link Box' },
  { Component: LinkWidget, name: 'Link' },
  { Component: MapWidget, name: 'Map' },
  { Component: SectionWidget, name: 'Section' },
  { Component: SpacerWidget, name: 'Spacer' },
  { Component: DividerWidget, name: 'Divider' },
  { Component: SocialIconsWidget, name: 'Social Icons' },
];

const MainLayout = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const filteredWidgets = basicsWidgets.filter(widget =>
    !searchTerm || widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%", p: 2,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 1,
        placeItems: "left"
      }}
    >
      {filteredWidgets.map(({ Component, name }, index) => (
        <Component key={name} />
      ))}
      {filteredWidgets.length === 0 && (
        <Box sx={{ gridColumn: '1 / -1', p: 1, textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}>
          No blocks found
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;