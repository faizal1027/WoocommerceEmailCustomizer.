import React from 'react';
import { Box, Typography, Button, Radio, Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface SurveyFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const SurveyFieldComponent: React.FC<SurveyFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { surveyEditorOptions } = useSelector((state: RootState) => state.workspace);

  const sampleQuestions = [
    { id: 1, text: 'How satisfied are you with our service?', type: 'radio', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'Very Unsatisfied'] },
    { id: 2, text: 'What features would you like to see added?', type: 'checkbox', options: ['Mobile App', 'More Templates', 'Better Support', 'Lower Price'] },
    { id: 3, text: 'How likely are you to recommend us to others?', type: 'radio', options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'] },
  ];

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
        maxWidth: '600px',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {surveyEditorOptions.title || 'Customer Survey'}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: '#666', textAlign: 'center' }}>
        Please take a moment to complete our survey. Your feedback is important to us.
      </Typography>

      {sampleQuestions.map((question, qIndex) => (
        <Box key={question.id} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
            {qIndex + 1}. {question.text}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            {question.options.map((option, oIndex) => (
              <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                {question.type === 'radio' ? (
                  <Radio disabled size="small" />
                ) : (
                  <Checkbox disabled size="small" />
                )}
                <Typography variant="body2">{option}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px 30px',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          {surveyEditorOptions.submitText || 'Submit Survey'}
        </Button>
      </Box>
    </Box>
  );
};

export default SurveyFieldComponent;