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
  const { blocks, selectedBlockId, isMobileView } = useSelector(
    (state: RootState) => state.workspace
  );
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
      console.error("emailCustomizerAjax is undefined");
      alert("Error: AJAX configuration is missing");
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
            let parsedBlocks: DroppedBlock[] = JSON.parse(response.data.data.json_data);


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
            console.error("Problematic template JSON:", response.data.data.json_data);
            console.error("JSON string length:", response.data.data.json_data?.length);
            console.error("First 100 characters:", response.data.data.json_data?.substring(0, 100));

            // Attempt automatic recovery
            const shouldRecover = window.confirm(
              "Template data is corrupted and cannot be loaded.\n\n" +
              "Would you like to reset this template to empty?\n\n" +
              "Click OK to reset and start fresh, or Cancel to go back."
            );

            if (shouldRecover) {
              // Reset template to empty
              const resetFormData = new URLSearchParams();
              resetFormData.append("action", "save_email_template");
              resetFormData.append("template_id", templateId);
              resetFormData.append("template_name", "Recovered Template " + templateId);
              resetFormData.append("json_data", "[]");
              resetFormData.append("_ajax_nonce", window.emailCustomizerAjax.nonce);

              axios.post(window.emailCustomizerAjax.ajax_url, resetFormData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
              }).then(() => {
                alert("Template has been reset successfully. The page will reload.");
                window.location.reload();
              }).catch((error) => {
                console.error("Failed to reset template:", error);
                alert("Failed to reset template. Please contact support or use the fix-all-templates.php script.");
              });
            } else {
              // User cancelled, go back to templates list
              window.location.href = window.location.origin + window.location.pathname.replace(/&id=\d+/, '');
            }
          }
        } else {
          const errorMsg = response.data?.data?.message || "Invalid response format";
          console.error("Error:", errorMsg);
          alert("Error: " + errorMsg);
        }
      } catch (error: any) {
        console.error("AJAX Error:", error.message || error);
        alert("An error occurred while fetching the data: " + (error.message || error));
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
  // Confirmation dialog removed as per user request


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
      onClickCapture={handleClickOutside}
      sx={{
        width: "100%",
        backgroundColor: previewMode ? "#fff" : "#f5f7f9",
        padding: previewMode ? 0 : 2,
        paddingTop: 0,
        paddingX: 0,
        height: previewMode ? "auto" : "100%",
        cursor: previewMode ? "default" : "auto",
        overflowY: "auto",
      }}
    >
      {blocks.length === 0 && !previewMode && !isLayoutSelectorOpen && (
        <Box
          sx={{
            border: "2px dashed #3ba0f3ff",
            borderRadius: "8px",
            padding: 4,
            textAlign: "center",
            color: "#6cb7f4ff",
            fontSize: "16px",
            width: isMobileView ? "100%" : "700px",
            height: isMobileView ? "100%" : "440px",
            margin: isMobileView ? "0" : "20px auto",
            alignContent: "center",
            justifyItems: "center",
            background: "#e8e8e8ff",
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
                transform: "scale(1.2)",
              },
            }}
          />
          <Typography>
            Click or drag a layout to get started
          </Typography>
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

      {isLayoutSelectorOpen && !previewMode && (
        <Box
          sx={{
            width: "fit-content",
            margin: "15px auto",
            padding: "16px 24px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1.5,
              mb: 1,
            }}
          >
            {[1, 2, 3, 4].map((cols) => (
              <Box
                key={cols}
                onClick={() => handleAddLayout(cols)}
                sx={{
                  width: 70,
                  height: 35,
                  border: "1px solid #e0e0e0",
                  borderRadius: "3px",
                  display: "flex",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "#3ba0f3",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {Array.from({ length: cols }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      backgroundColor: "#6c757d",
                      borderRight: i < cols - 1 ? "1px solid #fff" : "none",
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>
          <Typography
            onClick={() => setIsLayoutSelectorOpen(false)}
            sx={{
              fontSize: "12px",
              color: "#1976d2",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" }
            }}
          >
            Cancel
          </Typography>
        </Box>
      )}

      {blocks.length > 0 && !previewMode && !isLayoutSelectorOpen && (
        <Box sx={{ textAlign: "center", my: 3 }}>
          <Tooltip title="Add Layout">
            <AddCircleOutlineIcon
              onClick={() => setIsLayoutSelectorOpen(true)}
              sx={{
                fontSize: 40,
                color: "#1275c6ff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#42a5f5",
                  transform: "scale(1.1)",
                },
              }}
            />
          </Tooltip>
        </Box>
      )}
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
        display: isMobileView ? "flex" : "table",
        tableLayout: "fixed",
        flexDirection: isMobileView ? "column" : "row",
        maxWidth: isMobileView ? "100%" : previewMode ? "100%" : "80%",
        margin: previewMode ? "0" : "0 auto",
        width: "100%",
        boxSizing: "border-box",
        cursor: previewMode ? "default" : "pointer",
        opacity: isDragging ? 0.5 : 1,
        zIndex: (selectedBlockId === block.id || isDragging) ? 2 : 1,
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
              right: -70,
              display: "flex",
              justifyContent: "right",
              width: 70,
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
          sx={{ fontSize: "14px", color: "#999", textAlign: "center", width: "100%" }}
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
            />
          )}
        </DraggableWidgetWrapper>
      );
    });
  };

  const columnDisplayHeight =
    typeof column.style.height === "number"
      ? column.style.height
      : column.widgetContents.length === 0
        ? 100 // Keep empty columns tall for easy dragging
        : Math.max(30, column.widgetContents.length * 20); // Compact for filled columns to avoid gaps

  // Calculate correct column width based on number of columns
  const columnWidth = 100 / block.columns.length;

  // Build inline styles object
  if (!previewMode) {

  }
  const columnStyle: React.CSSProperties = {
    display: isMobileView ? 'block' : 'table-cell',
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
    height: column.style.height === 'auto' ? 'auto' : `${column.style.height}px`,
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
        alignItems: alignItems,
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