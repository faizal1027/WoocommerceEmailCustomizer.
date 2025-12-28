import React from 'react'
import { Box } from '@mui/material';
import FormWidget from './Widgets/formWidget';
import SurveyWidget from './Widgets/surveyWidget';
import InputWidget from './Widgets/inputWidget';
import TextareaWidget from './Widgets/textareaWidget';
import SelectWidget from './Widgets/selectWidget';
import CheckboxWidget from './Widgets/checkboxWidget';
import RadioWidget from './Widgets/radioWidget';
import LabelWidget from './Widgets/labelWidget';

export const formsWidgets = [
  { Component: FormWidget, name: 'Form' },
  { Component: SurveyWidget, name: 'Survey' },
  { Component: InputWidget, name: 'Input' },
  { Component: TextareaWidget, name: 'Textarea' },
  { Component: SelectWidget, name: 'Select' },
  { Component: CheckboxWidget, name: 'Checkbox' },
  { Component: RadioWidget, name: 'Radio' },
  { Component: LabelWidget, name: 'Label' },
];

const FormsLayout = ({ searchTerm = '' }: { searchTerm?: string }) => {
  const filteredWidgets = formsWidgets.filter(widget =>
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
          No form elements found
        </Box>
      )}
    </Box>
  );
};

export default FormsLayout;