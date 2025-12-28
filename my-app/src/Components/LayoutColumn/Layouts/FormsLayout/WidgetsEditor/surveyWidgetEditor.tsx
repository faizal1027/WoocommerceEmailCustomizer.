import React, { useState } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Button, Stack, Divider, List, ListItem, ListItemText, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateSurveyEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


interface Question {
  text: string;
  type: string;
  options: string[];
}

const SurveyWidgetEditor = () => {
  const dispatch = useDispatch();
  const { surveyEditorOptions } = useSelector((state: RootState) => (state as any).workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newQuestion, setNewQuestion] = useState<Question>({ text: '', type: 'text', options: [] });
  const [newOption, setNewOption] = useState('');

  const handleCloseEditor = () => {
    dispatch(closeEditor());
  };

  const handleDeleteContent = () => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      dispatch(
        deleteColumnContent({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
        })
      );
    }
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateSurveyEditorOptions({ [field]: value }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.text) {
      const currentQuestions = surveyEditorOptions.questions || [];
      const updatedQuestions = [...currentQuestions, newQuestion];
      dispatch(updateSurveyEditorOptions({ questions: updatedQuestions }));
      setNewQuestion({ text: '', type: 'text', options: [] });
      setNewOption('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const currentQuestions = surveyEditorOptions.questions || [];
    const updatedQuestions = currentQuestions.filter((_: any, i: number) => i !== index);
    dispatch(updateSurveyEditorOptions({ questions: updatedQuestions }));
  };

  const handleAddOptionToQuestion = () => {
    if (newOption) {
      setNewQuestion({ ...newQuestion, options: [...newQuestion.options, newOption] });
      setNewOption('');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">
              Survey
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit survey questions.
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" gap={1}>
            <Tooltip title="close" placement="bottom">
              <IconButton
                onClick={handleCloseEditor}
                sx={{
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  padding: 0,
                  minWidth: "unset",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="bottom">
              <IconButton
                onClick={handleDeleteContent}
                sx={{
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  padding: 0,
                  minWidth: "unset",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            General
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Survey Title
              </Typography>
              <TextField
                value={surveyEditorOptions.title || 'Customer Satisfaction Survey'}
                onChange={handleChange('title')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Submit Button Text
              </Typography>
              <TextField
                value={surveyEditorOptions.submitText || 'Submit Survey'}
                onChange={handleChange('submitText')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Questions
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ border: '1px solid #eee', p: 1.5, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 2, display: 'block' }}>Add New Question</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Question Text
                  </Typography>
                  <TextField
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Type
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    >
                      <MenuItem value="text">Text Input</MenuItem>
                      <MenuItem value="rating">Rating (1-5)</MenuItem>
                      <MenuItem value="choice">Multiple Choice</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {newQuestion.type === 'choice' && (
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                      Option
                    </Typography>
                    <Box display="flex" gap={1}>
                      <TextField
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <Button variant="outlined" size="small" onClick={handleAddOptionToQuestion} disabled={!newOption}>Add</Button>
                    </Box>
                  </Box>
                )}
                {newQuestion.type === 'choice' && newQuestion.options.length > 0 && (
                  <Typography variant="caption" color="textSecondary">
                    Options: {newQuestion.options.join(', ')}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.text}
                  size="small"
                >
                  Add Question
                </Button>
              </Stack>
            </Box>

            <List sx={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #eee', borderRadius: 1, p: 0 }}>
              {surveyEditorOptions.questions?.map((q: any, index: number) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveQuestion(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee' }}
                >
                  <ListItemText
                    primary={q.text}
                    secondary={`Type: ${q.type}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {(!surveyEditorOptions.questions || surveyEditorOptions.questions.length === 0) && (
                <ListItem>
                  <ListItemText primary="No questions added" primaryTypographyProps={{ variant: 'caption', color: 'textSecondary', align: 'center' }} />
                </ListItem>
              )}
            </List>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Validation
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={surveyEditorOptions.required || false}
                  onChange={handleChange('required')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">All Questions Required</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={surveyEditorOptions.multiple || false}
                  onChange={handleChange('multiple')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Allow Multiple Submissions</Typography>}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SurveyWidgetEditor;