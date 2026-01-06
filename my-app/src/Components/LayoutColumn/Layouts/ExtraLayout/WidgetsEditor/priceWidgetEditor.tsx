import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Switch, FormControlLabel, Stack, Divider, InputAdornment, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updatePriceEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PriceWidgetEditor = () => {
  const dispatch = useDispatch();
  const { priceEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof priceEditorOptions) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updatePriceEditorOptions({ [field]: value }));
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
              Price Display
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit pricing format.
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
            Amount & Currency
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Label
              </Typography>
              <TextField
                value={priceEditorOptions.label}
                onChange={handleChange('label')}
                size="small"
                fullWidth
                placeholder="Price"
              />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Amount
                </Typography>
                <TextField
                  type="number"
                  value={priceEditorOptions.amount || 99.99}
                  onChange={handleChange('amount')}
                  size="small"
                  placeholder="99.99"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body2" color="textSecondary">
                          {priceEditorOptions.currencySymbol || '$'}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Currency
                </Typography>
                <TextField
                  value={priceEditorOptions.currency || ''}
                  onChange={handleChange('currency')}
                  size="small"
                  placeholder="USD"
                  fullWidth
                  disabled={priceEditorOptions.showCurrencyCode === false}
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Formatting
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Symbol
                </Typography>
                <Select
                  value={priceEditorOptions.currencySymbol || '$'}
                  onChange={handleChange('currencySymbol')}
                  size="small"
                  fullWidth
                  MenuProps={{ disablePortal: true }}
                >
                  {['$', '€', '£', '¥', '₹', 'Rp', 'R$', 'AED', 'sar', 'Fr'].map((symbol) => (
                    <MenuItem key={symbol} value={symbol}>
                      {symbol}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Decimals
                </Typography>
                <TextField
                  type="number"
                  value={priceEditorOptions.decimals || 2}
                  onChange={handleChange('decimals')}
                  size="small"
                  fullWidth
                  inputProps={{ min: 0, max: 4 }}
                />
              </Box>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={priceEditorOptions.showDecimals !== false}
                    onChange={handleChange('showDecimals')}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Show Decimals</Typography>}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={priceEditorOptions.showCurrencySymbol !== false}
                    onChange={handleChange('showCurrencySymbol')}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Show Symbol</Typography>}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={priceEditorOptions.showCurrencyCode !== false}
                    onChange={handleChange('showCurrencyCode')}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Show Currency Code</Typography>}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PriceWidgetEditor;