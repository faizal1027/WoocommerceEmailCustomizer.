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
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Text Settings
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Title Text
              </Typography>
              <TextField
                value={countdownEditorOptions.title || ''}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ title: e.target.value }))}
                size="small"
                fullWidth
                placeholder="e.g. SALES ENDS IN"
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Footer Text
              </Typography>
              <TextField
                value={countdownEditorOptions.footer || ''}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ footer: e.target.value }))}
                size="small"
                fullWidth
                placeholder="e.g. All courses 50% off"
              />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Unit Labels</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Days"
                value={countdownEditorOptions.daysLabel || 'Days'}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ daysLabel: e.target.value }))}
                size="small"
              />
              <TextField
                label="Hours"
                value={countdownEditorOptions.hoursLabel || 'Hours'}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ hoursLabel: e.target.value }))}
                size="small"
              />
              <TextField
                label="Minutes"
                value={countdownEditorOptions.minutesLabel || 'Minutes'}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ minutesLabel: e.target.value }))}
                size="small"
              />
              <TextField
                label="Seconds"
                value={countdownEditorOptions.secondsLabel || 'Seconds'}
                onChange={(e) => dispatch(updateCountdownEditorOptions({ secondsLabel: e.target.value }))}
                size="small"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Visibility
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={countdownEditorOptions.showDays !== false}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({ showDays: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption">Days</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={countdownEditorOptions.showHours !== false}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({ showHours: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption">Hours</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={countdownEditorOptions.showMinutes !== false}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({ showMinutes: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption">Minutes</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={countdownEditorOptions.showSeconds !== false}
                  onChange={(e) => dispatch(updateCountdownEditorOptions({ showSeconds: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="caption">Seconds</Typography>}
            />
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Box Background"
              value={countdownEditorOptions.backgroundColor || '#d32f2f'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

            <ColorPicker
              label="Box Text Color"
              value={countdownEditorOptions.textColor || '#ffffff'}
              onChange={(color) => handleColorChange('textColor', color)}
            />

            <ColorPicker
              label="Label Color"
              value={countdownEditorOptions.labelColor || '#333333'}
              onChange={(color) => handleColorChange('labelColor', color)}
            />

            <ColorPicker
              label="Title Color"
              value={countdownEditorOptions.titleColor || '#000000'}
              onChange={(color) => handleColorChange('titleColor', color)}
            />

            <ColorPicker
              label="Footer Color"
              value={countdownEditorOptions.footerColor || '#000000'}
              onChange={(color) => handleColorChange('footerColor', color)}
            />

            <ColorPicker
              label="Container Background"
              value={countdownEditorOptions.containerBgColor || 'transparent'}
              onChange={(color) => handleColorChange('containerBgColor', color)}
            />

          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CountdownWidgetEditor;