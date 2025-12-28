import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';


interface RowFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
}

const RowFieldComponent: React.FC<RowFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();

  const storeWidgetContent = useSelector((state: RootState) => {
    const block = state.workspace.blocks.find((b) => b.id === blockId);
    return block?.columns[columnIndex]?.widgetContents[widgetIndex] || null;
  });

  const widgetContent = widgetData || storeWidgetContent;

  const rowOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      backgroundColor: 'transparent',
      columns: 2,
      gap: 20
    };

  const numColumns = rowOptions.columns || 2;

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
        backgroundColor: rowOptions.backgroundColor || 'transparent',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '4px',
        padding: `${rowOptions.gap || 20}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
        gap: `${rowOptions.gap || 20}px`,
        position: 'relative',
        minHeight: '100px',
      }}
    >
      {Array.from({ length: numColumns }).map((_, idx) => (
        <Box
          key={idx}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            border: '1px dashed #ccc',
            borderRadius: '2px',
            minHeight: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ fontSize: '12px', color: '#999' }}>Column {idx + 1}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RowFieldComponent;
