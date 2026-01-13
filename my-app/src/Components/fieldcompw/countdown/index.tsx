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
        border: '1px solid transparent',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: countdownEditorOptions.containerBgColor || 'transparent',
        position: 'relative',
        textAlign: 'center',
        '&:hover': {
          border: '1px dashed #ccc',
        }
      }}
    >
      {countdownEditorOptions.title && (
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 900,
            color: countdownEditorOptions.titleColor || '#000',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '2.5rem'
          }}
        >
          {countdownEditorOptions.title}
        </Typography>
      )}

      {timeLeft.expired ? (
        <Typography variant="h5" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
          {countdownEditorOptions.endMessage || 'The offer has ended!'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
          {[
            { value: timeLeft.days, label: countdownEditorOptions.daysLabel || 'Days', show: countdownEditorOptions.showDays !== false },
            { value: timeLeft.hours, label: countdownEditorOptions.hoursLabel || 'Hours', show: countdownEditorOptions.showHours !== false },
            { value: timeLeft.minutes, label: countdownEditorOptions.minutesLabel || 'Minutes', show: countdownEditorOptions.showMinutes !== false },
            { value: timeLeft.seconds, label: countdownEditorOptions.secondsLabel || 'Seconds', show: countdownEditorOptions.showSeconds !== false }
          ].filter(item => item.show).map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: countdownEditorOptions.labelColor || '#333',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {item.label}
              </Typography>
              <Box
                sx={{
                  backgroundColor: countdownEditorOptions.backgroundColor || '#d32f2f',
                  borderRadius: '15px',
                  width: '90px',
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: countdownEditorOptions.textColor || '#fff',
                    fontSize: '2.5rem'
                  }}
                >
                  {item.value.toString().padStart(2, '0')}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {countdownEditorOptions.footer && (
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            fontWeight: 'bold',
            color: countdownEditorOptions.footerColor || '#000',
            fontSize: '1.8rem'
          }}
        >
          {countdownEditorOptions.footer}
        </Typography>
      )}
    </Box>
  );
};

export default CountdownFieldComponent;