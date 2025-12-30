import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Divider,
  Switch
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateCountdownEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const CountdownWidgetEditor = () => {
  const dispatch = useDispatch();
  const { countdownEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  // Initialize targetDate from countdownEditorOptions
  const getInitialDate = () => {
    if (countdownEditorOptions.targetDate) {
      try {
        return new Date(countdownEditorOptions.targetDate);
      } catch (e) {
        console.error("Invalid date format:", countdownEditorOptions.targetDate);
      }
    }
    // Default: 7 days from now
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  };

  const [targetDate, setTargetDate] = useState<Date>(getInitialDate());
  const [dateInputValue, setDateInputValue] = useState<string>('');

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Initialize date input value on component mount
  useEffect(() => {
    const initialDate = getInitialDate();
    setTargetDate(initialDate);
    setDateInputValue(formatDateForInput(initialDate));
  }, [countdownEditorOptions.targetDate]);

  const handleChange = (field: keyof typeof countdownEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = 'target' in e ? e.target.value : (e as React.ChangeEvent<HTMLInputElement>).target.value;

    if (field === 'showLabels') {
      const checked = (e as React.ChangeEvent<HTMLInputElement>).target.checked;
      dispatch(updateCountdownEditorOptions({ [field]: checked }));
    } else {
      dispatch(updateCountdownEditorOptions({ [field]: value as string }));
    }
  };

  const handleColorChange = (field: string, newColor: string) => {
    dispatch(updateCountdownEditorOptions({ [field]: newColor }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);

    if (value) {
      try {
        const newDate = new Date(value);
        setTargetDate(newDate);
        dispatch(updateCountdownEditorOptions({ targetDate: newDate.toISOString() }));
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  };

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
              Countdown
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Set timer settings.
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
            Target Time
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Date & Time
              </Typography>
              <TextField
                type="datetime-local"
                value={dateInputValue}
                onChange={handleDateChange}
                size="small"
                fullWidth
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Selected: {targetDate.toLocaleString()}
            </Typography>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Format
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  id="format-select"
                  value={countdownEditorOptions.format || 'DD:HH:MM:SS'}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({
                    format: e.target.value as string
                  }))}
                >
                  <MenuItem value="DD:HH:MM:SS">Days:Hours:Minutes:Seconds</MenuItem>
                  <MenuItem value="HH:MM:SS">Hours:Minutes:Seconds</MenuItem>
                  <MenuItem value="MM:SS">Minutes:Seconds</MenuItem>
                  <MenuItem value="DD days HH hours">Days & Hours</MenuItem>
                  <MenuItem value="DDd HHh MMm SSs">Compact Format</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={countdownEditorOptions.showLabels !== false}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({
                    showLabels: e.target.checked
                  }))}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  Show time labels
                </Typography>
              }
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Background Color"
              value={countdownEditorOptions.backgroundColor || '#f8f9fa'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

            <ColorPicker
              label="Text Color"
              value={countdownEditorOptions.textColor || '#333333'}
              onChange={(color) => handleColorChange('textColor', color)}
            />

          </Stack>
        </Box>

        <Divider />

        <Box sx={{
          p: 2,
          bgcolor: countdownEditorOptions.backgroundColor || '#f8f9fa',
          borderRadius: 1,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block', color: countdownEditorOptions.textColor || '#333333', fontWeight: 'bold' }}>
            Preview
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 1,
            p: 1,
            minHeight: '40px'
          }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {countdownEditorOptions.format || 'DD:HH:MM:SS'}
              <br />
              <Typography variant="caption" component="div">
                {countdownEditorOptions.showLabels !== false ? '(Labels On)' : '(Labels Off)'}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default CountdownWidgetEditor;