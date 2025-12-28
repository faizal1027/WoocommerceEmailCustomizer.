import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface FormFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { formEditorOptions } = useSelector((state: RootState) => state.workspace);

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
        maxWidth: '500px',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        {formEditorOptions.title || 'Contact Us'}
      </Typography>

      <Box
        component="form"
        method={formEditorOptions.method || 'POST'}
        action={formEditorOptions.submitUrl || '#'}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Name</Typography>
          <Box
            sx={{
              width: '100%',
              height: '40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              padding: '8px 12px',
            }}
          >
            <Typography variant="body2" sx={{ color: '#999' }}>John Doe</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Email</Typography>
          <Box
            sx={{
              width: '100%',
              height: '40px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              padding: '8px 12px',
            }}
          >
            <Typography variant="body2" sx={{ color: '#999' }}>john@example.com</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Message</Typography>
          <Box
            sx={{
              width: '100%',
              minHeight: '100px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
              padding: '8px 12px',
            }}
          >
            <Typography variant="body2" sx={{ color: '#999' }}>
              Your message here...
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          {formEditorOptions.submitText || 'Submit'}
        </Button>
      </Box>


    </Box>
  );
};

export default FormFieldComponent;