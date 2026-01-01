import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { RootState } from '../../../Store/store';


interface SectionFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any;
}

const SectionFieldComponent: React.FC<SectionFieldComponentProps> = ({
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

  const sectionOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      backgroundColor: '#f5f5f5',
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      border: { width: 1, style: 'solid', color: '#ddd', radius: 0 }
    };

  // Ensure padding exists
  if (!sectionOptions.padding) {
    sectionOptions.padding = { top: 20, right: 20, bottom: 20, left: 20 };
  }

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
        backgroundColor: sectionOptions.backgroundColor || '#f5f5f5',
        paddingTop: `${sectionOptions.padding?.top || 20}px`,
        paddingRight: `${sectionOptions.padding?.right || 20}px`,
        paddingBottom: `${sectionOptions.padding?.bottom || 20}px`,
        paddingLeft: `${sectionOptions.padding?.left || 20}px`,
        border: isSelected ? '2px dashed blue' : `${sectionOptions.border?.width || 1}px ${sectionOptions.border?.style || 'solid'} ${sectionOptions.border?.color || '#ddd'}`,
        borderRadius: `${sectionOptions.border?.radius || 0}px`,
        position: 'relative',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography sx={{ color: '#999', fontSize: '14px' }}>Section Content Area</Typography>
    </Box>
  );
};

export default SectionFieldComponent;
