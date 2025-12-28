import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';

interface CountdownFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
}

const CountdownFieldComponent: React.FC<CountdownFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex
}) => {
  const dispatch = useDispatch();
  const { countdownEditorOptions } = useSelector((state: RootState) => state.workspace);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = countdownEditorOptions.targetDate 
        ? new Date(countdownEditorOptions.targetDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, expired: false };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [countdownEditorOptions.targetDate]);

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
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: countdownEditorOptions.backgroundColor || '#f8f9fa',
        color: countdownEditorOptions.textColor || '#333333',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {countdownEditorOptions.title || 'Sale Ends In'}
      </Typography>
      
      {timeLeft.expired ? (
        <Typography variant="h5" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
          {countdownEditorOptions.endMessage || 'The offer has ended!'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '10px 15px',
                minWidth: '80px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007bff' }}>
                {item.value.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#666' }}>
        Target: {new Date(countdownEditorOptions.targetDate || Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CountdownFieldComponent;