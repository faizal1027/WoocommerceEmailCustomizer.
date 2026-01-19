import { useRef, useEffect, useState } from "react";
import DraggableWidgetWrapper from "./DraggableWidgetWrapper";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { RootState } from "../../../Store/store";
import {
  addBlock,
  copyBlock,
  deleteBlock,
  setSelectedBlockId,
  openEditor,
  closeEditor,
  addColumnContent,
  defaultSocialIconsEditorOptions,
  reorderBlocks,
  Column,
  DroppedBlock,
  WidgetContentType,
  defaultButtonEditorOptions,
  defaultTextEditorOptions,
  defaultHeadingEditorOptions,
  defaultTaxBillingEditorOptions,
  setBlocks,
  defaultDividerEditorOptions,
  defaultSelectEditorOptions,
  defaultOrderSubtotalEditorOptions,
  defaultOrderTotalEditorOptions,
  defaultShippingMethodEditorOptions,
  defaultPaymentMethodEditorOptions,
  defaultCustomerNoteEditorOptions,
  defaultEmailHeaderEditorOptions,
  defaultEmailFooterEditorOptions,
  defaultPriceEditorOptions,
  defaultContactEditorOptions,
  defaultProductDetailsEditorOptions,
  setMobileView, // Added import
} from "../../../Store/Slice/workspaceSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import EditIcon from '@mui/icons-material/Edit';

import { getWidgetComponent } from "../../utils/getWidgetComponent";
import { useDrag } from "react-dnd";
import axios from "axios";
import { ajaxUrl } from "../../../Constants/Constants";


interface BlockItem {
  id: string;
  index: number;
}

interface WorkspaceAreaProps {
  viewMode: "desktop" | "mobile";
  previewMode?: boolean;
}

const WorkspaceArea = ({
  viewMode,
  previewMode = false,
}: WorkspaceAreaProps) => {
  const dispatch = useDispatch();
  const { blocks, selectedBlockId, isMobileView, bodyStyle } = useSelector(
    (state: RootState) => state.workspace
  );

  useEffect(() => {
    console.log("Renderer Version: EXACT_REPLICA_V1 (Height fixed)");
  }, []);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(
    null
  );
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const [, dropLayout] = useDrop(() => ({
    accept: "layout",
    drop: (item: { columns: number }, monitor) => {
      if (monitor.didDrop()) return;
      if (!previewMode) {
        dispatch(addBlock({ columns: item.columns }));
      }
    },
  }), [previewMode, dispatch]);

  useEffect(() => {
    if (dropRef.current) dropLayout(dropRef.current);
  }, [dropLayout]);


  useEffect(() => {
    if (viewMode === "mobile") {
      dispatch(setMobileView(true));
    } else {
      dispatch(setMobileView(false));
    }
  }, [viewMode, dispatch]);

  useEffect(() => {
    if (!window.emailCustomizerAjax) {
      // console.error("emailCustomizerAjax is undefined");
      return;
    }

    const templateId = new URLSearchParams(window.location.search).get("id");
    if (!templateId) {
      return;
    }

    const fetchTemplateData = async () => {
      try {
        const formData = new URLSearchParams();
        formData.append("action", "get_email_template_json");
        formData.append("template_id", templateId);
        formData.append("_ajax_nonce", window.emailCustomizerAjax.nonce);

        const response = await axios.post(
          window.emailCustomizerAjax.ajax_url,
          formData,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        if (response.data.success && response.data.data?.json_data) {
          try {
            let parsedBlocks: DroppedBlock[] = JSON.parse(response.data.data.json_data || '[]');

            if (parsedBlocks.length > 0) {
              parsedBlocks = parsedBlocks.map(block => {
                const firstCol = block.columns[0];
                const firstColContent = firstCol?.widgetContents?.[0];

                if (firstColContent && firstColContent.contentType && ['section', 'row', 'container'].includes(firstColContent.contentType) && block.columns.length > 1) {
                  const hasExtraEmptyCols = block.columns.slice(1).every(col => col.widgetContents.length === 0);
                  if (hasExtraEmptyCols) {
                    return {
                      ...block,
                      columns: [firstCol]
                    };
                  }
                }
                return block;
              });

              parsedBlocks = parsedBlocks.filter(block => {
                return !block.columns.every(col => col.widgetContents.length === 0);
              });
            }

            dispatch(setBlocks(parsedBlocks));
            sessionStorage.setItem("templateJsonData", response.data.data.json_data);
          } catch (parseError: any) {
            console.error("Error parsing template JSON data:", parseError);
          }
        }
      } catch (error: any) {
        console.error("AJAX Error:", error.message || error);
      }
    };

    fetchTemplateData();
  }, [dispatch]);

  const handleClickOutside = (e: any) => {
    if (previewMode) return;
    const clickedInsideBlock = e.target.closest(".block");
    const clickedInsideEditor = e.target.closest(".layout-editor-widget");
    if (!clickedInsideBlock && !clickedInsideEditor) {
      dispatch(setSelectedBlockId(null));
      dispatch(closeEditor());
    }
  };

  const handleBlockClick = (id: string) => {
    if (previewMode) return;
    dispatch(setSelectedBlockId(id));
    dispatch(openEditor({ blockId: id, columnIndex: null }));
  };

  const handleDelete = (id: string) => {
    if (previewMode) return;
    dispatch(deleteBlock(id));
  };

  const handleCopy = (id: string) => {
    if (previewMode) return;
    dispatch(copyBlock(id));
  };

  const handleAddLayout = (columns: number) => {
    dispatch(addBlock({ columns }));
    setIsLayoutSelectorOpen(false);
  };

  return (
    <Box
      ref={dropRef}
      onClick={(e) => {
        // Deselect if clicking on the background (Outer workspace)
        if (e.target === e.currentTarget && !previewMode) {
          dispatch(setSelectedBlockId(null));
          dispatch(closeEditor());
        }
      }}
      onClickCapture={handleClickOutside}
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0",
      }}
    >
      {/* Area 2: The Colored Background Section */}
      <Box
        sx={{
          width: "96%",
          margin: "0 auto",
          backgroundColor: bodyStyle?.backgroundColor || "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 0 20px 0",
          minHeight: "fit-content",
          position: "relative",
        }}
      >
        {/* Background Toolbar */}
        {!previewMode && (
          <Box sx={{
            width: '600px',
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px'
          }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setSelectedBlockId(null));
                dispatch(openEditor({
                  blockId: null, columnIndex: null, widgetIndex: null, contentType: null
                }));
              }}
              sx={{
                textTransform: 'none',
                border: 'none',
                color: '#333',
                backgroundColor: '#ebebeb',
                borderRadius: '0px',
                '&:hover': {
                  backgroundColor: '#dadada'
                }
              }}
            >
              Background
            </Button>
          </Box>
        )}

        {/* Area 1: The White Email Layout (600px) */}
        <Box
          sx={{
            width: previewMode ? "100%" : (isMobileView ? "100%" : "600px"),
            maxWidth: "600px",
            backgroundSize: "cover", // Ensure background image covers the area
            backgroundColor: "transparent", // Email area is transparent to show Wrapper color
            margin: "0 auto",
            minHeight: "120px",
            height: "auto",
            flexShrink: 0,
            boxShadow: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            boxSizing: "border-box",
            position: "relative",
            overflow: "visible",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !previewMode) {
              dispatch(setSelectedBlockId(null));
              dispatch(closeEditor());
            }
          }}
        >
          {/* Email Content Area */}
          <Box sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: "8px",
          }}>
            {blocks.length === 0 && !previewMode && !isLayoutSelectorOpen && (
              <Box
                sx={{
                  border: "1px dashed #cccccc",
                  borderRadius: "4px",
                  padding: 2,
                  textAlign: "center",
                  color: "#999",
                  fontSize: "14px",
                  width: "100%",
                  minHeight: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  boxSizing: 'border-box',
                  cursor: "pointer"
                }}
                onClick={() => setIsLayoutSelectorOpen(true)}
              >
                <AddCircleOutlineIcon
                  sx={{
                    fontSize: 40,
                    color: "#1275c6ff",
                    width: "60px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#42a5f5",
                      transform: "scale(1.1)",
                    },
                  }}
                />
                <Typography sx={{ mt: 1 }}>Add Layout</Typography>
              </Box>
            )}

            {blocks.map((block, index) => (
              <Block
                key={block.id}
                block={block}
                index={index}
                handleBlockClick={handleBlockClick}
                handleCopy={handleCopy}
                handleDelete={handleDelete}
                selectedBlockId={selectedBlockId}
                isMobileView={isMobileView}
                previewMode={previewMode}
              />
            ))}

            {isLayoutSelectorOpen && (
              <>
                <Box
                  onClick={() => setIsLayoutSelectorOpen(false)}
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 9,
                    cursor: 'default'
                  }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '15px 25px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    gap: '30px',
                    position: 'relative',
                    zIndex: 10,
                    width: 'fit-content',
                    margin: '20px auto'
                  }}
                >
                  {[1, 2, 3, 4].map((cols) => (
                    <Box
                      key={cols}
                      onClick={() => handleAddLayout(cols)}
                      sx={{
                        display: "flex",
                        gap: "2px",
                        cursor: "pointer",
                        width: "70px", // Fixed total width for all options
                        height: "45px",
                        transition: "opacity 0.2s",
                        opacity: 0.8,
                        "&:hover": {
                          opacity: 1
                        }
                      }}
                    >
                      {Array.from({ length: cols }).map((_, i) => (
                        <Box
                          key={i}
                          className="col-block"
                          sx={{
                            flex: 1, // Divide the 70px width equally
                            height: "100%",
                            backgroundColor: "#5e6266",
                            borderRadius: "2px"
                          }}
                        />
                      ))}
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {blocks.length > 0 && !previewMode && !isLayoutSelectorOpen && (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Tooltip title="Add Layout">
                  <AddCircleOutlineIcon
                    onClick={() => setIsLayoutSelectorOpen(true)}
                    sx={{
                      fontSize: 32,
                      color: "#999",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#666",
                        transform: "scale(1.1)",
                      },
                    }}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box> {/* End Area 1: White Box */}


      </Box>
    </Box>
  );
};

export default WorkspaceArea;

// Block Component
interface BlockProps {
  block: DroppedBlock;
  index: number;
  handleBlockClick: (id: string) => void;
  handleCopy: (id: string) => void;
  handleDelete: (id: string) => void;
  selectedBlockId: string | null;
  isMobileView: boolean;
  previewMode: boolean;
}

const Block = ({
  block,
  index,
  handleBlockClick,
  handleCopy,
  handleDelete,
  selectedBlockId,
  isMobileView,
  previewMode,
}: BlockProps) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "block",
    hover: (item: BlockItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;



      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      dispatch(reorderBlocks({ sourceId: item.id, targetId: block.id }));

      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop]);

  return (
    <Box
      ref={ref}
      className="block"
      onClick={(e) => {
        e.stopPropagation();
        if (!previewMode) {
          handleBlockClick(block.id);
        }
      }}
      sx={{
        display: isMobileView ? "flex" : "flex", // Force flex for better column control
        flexDirection: isMobileView ? "column" : "row",
        maxWidth: "100%",
        margin: previewMode ? "0" : "0 auto",
        width: "100%",
        boxSizing: "border-box",
        cursor: previewMode ? "default" : "pointer",
        opacity: isDragging ? 0.5 : 1,
        zIndex: (selectedBlockId === block.id || isDragging) ? 2 : 1,
        overflow: "visible", // Ensure actions at top-right are visible
        flexShrink: 0, // Ensure blocks don't collapse
        // Using pseudo-element overlay for guaranteed visibility
        position: "relative",
        boxShadow: "none",
        outline: "none",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 10,
          border: (isOver || (selectedBlockId === block.id && !previewMode)) ? "1px solid #2196F3" : "none",
        },
        "&:hover": {
          zIndex: 2,
          "&::after": {
            border: !previewMode ? "1px solid #2196F3" : undefined,
          },
          ".action-btn": {
            display: !previewMode ? "block" : "none",
          },
        },
      }}
    >
      {block.columns.map((column, i) => (
        <ColumnDropTarget
          key={column.id || i}
          block={block}
          column={column}
          columnIndex={i}
          isMobileView={isMobileView}
          previewMode={previewMode}
        />
      ))}

      {
        !previewMode && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: -70, // Float left into Area 1 (Colored section)
              display: "flex",
              justifyContent: "left",
              width: 70,
              backgroundColor: "transparent",
              zIndex: 11,
            }}
          >
            <Tooltip title="duplicate" placement="bottom">
              <ContentCopyTwoToneIcon
                sx={{
                  padding: "4px 8px",
                  fontSize: 34,
                  background: "transparent",
                  borderRadius: "50%",
                  transition: "0.2s ease",
                  "&:hover": {
                    background: "#3d3d3d",
                    color: "#fff",
                  },
                  display: selectedBlockId === block.id ? "block" : "none",
                }}
                className="action-btn"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(block.id);
                }}
              />
            </Tooltip>

            <Tooltip title="delete" placement="bottom">
              <DeleteOutlineTwoToneIcon
                fontSize="medium"
                className="action-btn"
                sx={{
                  padding: "3px 6px",
                  fontSize: 34,
                  background: "transparent",
                  transition: "0.2s ease",
                  borderRadius: "50%",
                  "&:hover": {
                    background: "#e12c05",
                    color: "#fff",
                  },
                  display: selectedBlockId === block.id ? "block" : "none",
                }}
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(block.id);
                }}
              />
            </Tooltip>
          </Box>
        )
      }
    </Box >
  );
};

// Column Component
interface ColumnDropTargetProps {
  block: DroppedBlock;
  column: Column;
  columnIndex: number;
  isMobileView: boolean;
  previewMode: boolean;
}

const ColumnDropTarget = ({
  block,
  column,
  columnIndex,
  isMobileView,
  previewMode,
}: ColumnDropTargetProps) => {
  const dispatch = useDispatch();
  const columnRef = useRef<HTMLDivElement>(null);
  const {
    selectedBlockForEditor,
    selectedColumnIndex,
    selectedContentType,
    selectedWidgetIndex,
  } = useSelector((state: RootState) => state.workspace);
  const isSelected =
    selectedBlockForEditor === block.id && selectedColumnIndex === columnIndex;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["content", "layout"],
    drop: (item: {
      widgetType: WidgetContentType;
      initialContent?: string;
    }, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (previewMode) return;
      let contentDataToSend: string | null = null;

      // Handle content data based on widget type
      if (item.widgetType === "image") {
        contentDataToSend = item.initialContent || "";
      } else if (item.widgetType === "row") {
        contentDataToSend = JSON.stringify({
          backgroundColor: 'transparent',
          columns: 1, // Corrected to 1 as Row manages its own cols
          gap: 20
        });
      } else if (item.widgetType === "emailHeader") {
        contentDataToSend = JSON.stringify(defaultEmailHeaderEditorOptions);
      } else if (item.widgetType === "emailFooter") {
        contentDataToSend = JSON.stringify(defaultEmailFooterEditorOptions);

      } else if (item.widgetType === "price") {
        contentDataToSend = JSON.stringify(defaultPriceEditorOptions);
      } else if (item.widgetType === "section") {
        contentDataToSend = JSON.stringify({
          backgroundColor: '#f5f5f5',
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          border: { width: 1, style: 'solid', color: '#ddd', radius: 0 }
        });
      } else if (item.widgetType === "taxBilling") {
        contentDataToSend = JSON.stringify(defaultTaxBillingEditorOptions);
      } else if (item.widgetType === "orderSubtotal") {
        contentDataToSend = JSON.stringify(defaultOrderSubtotalEditorOptions);
      } else if (item.widgetType === "orderTotal") {
        contentDataToSend = JSON.stringify(defaultOrderTotalEditorOptions);
      } else if (item.widgetType === "shippingMethod") {
        contentDataToSend = JSON.stringify(defaultShippingMethodEditorOptions);
      } else if (item.widgetType === "paymentMethod") {
        contentDataToSend = JSON.stringify(defaultPaymentMethodEditorOptions);
      } else if (item.widgetType === "customerNote") {
        contentDataToSend = JSON.stringify(defaultCustomerNoteEditorOptions);
      } else if (item.widgetType === "contact") {
        contentDataToSend = JSON.stringify(defaultContactEditorOptions);
      } else if (item.widgetType === "productDetails") {
        contentDataToSend = JSON.stringify(defaultProductDetailsEditorOptions);
      } else {
        contentDataToSend = JSON.stringify({});
      }

      dispatch(
        addColumnContent({
          blockId: block.id,
          columnIndex,
          contentType: item.widgetType,
          contentData: contentDataToSend,
        })
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [block.id, columnIndex, previewMode, dispatch]);

  useEffect(() => {
    if (columnRef.current) {
      drop(columnRef.current);
    }
  }, [columnRef, drop]);

  const renderContent = () => {
    if (column.widgetContents.length === 0) {
      return (
        <Typography
          sx={{
            fontSize: "14px",
            color: "#999",
            textAlign: "center",
            width: "100%",
            padding: "20px",
            border: "1px dashed #ccc",
            boxSizing: "border-box"
          }}
        >
          Drag Content Here
        </Typography>
      );

    }

    return column.widgetContents.map((widget, index) => {
      const handleWidgetClick =
        (contentType: WidgetContentType, widgetIndex: number) =>
          (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(
              openEditor({
                blockId: block.id,
                columnIndex,
                contentType,
                widgetIndex,
              })
            );
          };

      const defaultOnClick = () => {
        // No-op for default clicks
      };

      const isWidgetSelected =
        isSelected &&
        selectedContentType === widget.contentType &&
        selectedWidgetIndex === index;

      const WidgetComponent = getWidgetComponent(widget.contentType || '');

      const commonProps = {
        key: index,
        blockId: block.id,
        columnIndex: columnIndex,
        widgetIndex: index,
        isSelected: isWidgetSelected,
        onClick: defaultOnClick,
        onWidgetClick: handleWidgetClick(widget.contentType, index),
        widgetData: widget
      };

      return (
        <DraggableWidgetWrapper
          key={index}
          blockId={block.id}
          columnIndex={columnIndex}
          widgetIndex={index}
          isSelected={isWidgetSelected}
          previewMode={previewMode}
          onWidgetClick={handleWidgetClick(widget.contentType, index)}
        >
          {WidgetComponent && (
            <WidgetComponent

              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
              previewMode={previewMode}
            />
          )}
        </DraggableWidgetWrapper>
      );
    });
  };

  const columnDisplayHeight =
    column.widgetContents.length === 0
      ? 100 // Keep empty columns tall for easy dragging
      : 30; // Minimum floor for filled columns

  // Calculate correct column width based on number of columns
  const columnWidth = 100 / block.columns.length;

  // Build inline styles object
  if (!previewMode) {

  }
  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: isMobileView ? '1 1 auto' : '1 1 0', // Reverted to standard basis
    minWidth: 0, // Keep this to allow internal content clipping/scrolling if needed
    verticalAlign: 'top',
    width: isMobileView ? '100%' : `${columnWidth}%`,
    boxSizing: 'border-box',
    backgroundColor: column.style.bgColor,
    borderTop: `${column.style.borderTopSize || 0}px ${column.style.borderStyle || 'solid'} ${column.style.borderTopColor || 'transparent'}`,
    borderBottom: `${column.style.borderBottomSize || 0}px ${column.style.borderStyle || 'solid'} ${column.style.borderBottomColor || 'transparent'}`,
    borderLeft: `${column.style.borderLeftSize || 0}px ${column.style.borderStyle || 'solid'} ${column.style.borderLeftColor || 'transparent'}`,
    borderRight: `${column.style.borderRightSize || 0}px ${column.style.borderStyle || 'solid'} ${column.style.borderRightColor || 'transparent'}`,
    paddingTop: `${column.style.padding?.top ?? 10}px`,
    paddingRight: `${column.style.padding?.right ?? 10}px`,
    paddingBottom: `${column.style.padding?.bottom ?? 10}px`,
    paddingLeft: `${column.style.padding?.left ?? 10}px`,
    textAlign: (column.style.textAlign as any) || 'left',
    minHeight: `${columnDisplayHeight}px`,
    position: 'relative',
    height: 'auto', // Always auto to prevent clipping
  };

  // Map textAlign to flex alignItems
  const alignItemsMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    justify: 'stretch'
  };
  const alignItems = alignItemsMap[column.style.textAlign || 'left'] || 'flex-start';

  return (
    <Box
      ref={columnRef}
      className="droppable-column"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch(setSelectedBlockId(block.id));
        dispatch(
          openEditor({ blockId: block.id, columnIndex, contentType: null })
        );
      }}
      sx={columnStyle}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch', // Fill the column horizontally
        justifyContent: column.widgetContents.length ? 'flex-start' : 'center',
        gap: '0px',
        minHeight: `${columnDisplayHeight}px`,
        width: '100%',
      }}>
        {renderContent()}
      </Box>
    </Box>
  );
};