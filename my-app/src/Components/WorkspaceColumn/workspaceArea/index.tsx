import { useRef, useEffect, useState } from "react";
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
  defaultCodeEditorOptions,
  defaultPriceEditorOptions,
} from "../../../Store/Slice/workspaceSlice";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";

// Basics Field Components
import TextFieldComponent from "../../fieldcompw/textfielr/index";
import ButtonFieldComponent from "../../fieldcompw/button";
import HeadingFieldComponent from "../../fieldcompw/heading";
import SocialIconsFieldComponent from "../../fieldcompw/socialIcons";
import DividerFieldComponent from "../../fieldcompw/divider";
import ImageFieldComponent from "../../fieldcompw/Image";
import IconFieldComponent from "../../fieldcompw/icon";
import ImageBoxFieldComponent from "../../fieldcompw/imageBox";
import LinkFieldComponent from "../../fieldcompw/link";
import LinkBoxFieldComponent from "../../fieldcompw/linkBox";
import MapFieldComponent from "../../fieldcompw/map";
import SectionFieldComponent from "../../fieldcompw/section";
import SpacerFieldComponent from "../../fieldcompw/spacer";

// Layout Block Field Components 
import RowFieldComponent from "../../fieldcompw/row";
import ContainerFieldComponent from "../../fieldcompw/container";
import GroupFieldComponent from "../../fieldcompw/group";

// Forms Field Components
import FormFieldComponent from "../../fieldcompw/form";
import SurveyFieldComponent from "../../fieldcompw/survey";
import InputFieldComponent from "../../fieldcompw/input";
import TextareaFieldComponent from "../../fieldcompw/textarea";
import SelectFieldComponent from "../../fieldcompw/select";
import CheckboxFieldComponent from "../../fieldcompw/checkbox";
import RadioFieldComponent from "../../fieldcompw/radio";
import LabelFieldComponent from "../../fieldcompw/label";

// Extra Block Field Components 
import SocialFollowFieldComponent from "../../fieldcompw/socialFollow";
import VideoFieldComponent from "../../fieldcompw/video";
import CodeFieldComponent from "../../fieldcompw/code";
import CountdownFieldComponent from "../../fieldcompw/countdown";
import ProgressBarFieldComponent from "../../fieldcompw/progressBar";
import ProductFieldComponent from "../../fieldcompw/product";
import PromoCodeFieldComponent from "../../fieldcompw/promoCode";
import PriceFieldComponent from "../../fieldcompw/price";
import TestimonialFieldComponent from "../../fieldcompw/testimonial";
import NavbarFieldComponent from "../../fieldcompw/navbar";
import CardFieldComponent from "../../fieldcompw/card";
import AlertFieldComponent from "../../fieldcompw/alert";
import ProgressFieldComponent from "../../fieldcompw/progress";

// Woocommerce Field Components
import ShippingAddressFieldComponent from "../../fieldcompw/shippingAddress/index";
import BillingAddressFieldComponent from "../../fieldcompw/billingAddress";
import OrderItemsFieldComponent from "../../fieldcompw/orderItems";
import TaxBillingFieldComponent from "../../fieldcompw/taxBilling";
import EmailHeaderFieldComponent from "../../fieldcompw/emailHeader";
import EmailFooterFieldComponent from "../../fieldcompw/emailFooter";
import CtaButtonFieldComponent from "../../fieldcompw/ctaButton";
import RelatedProductsFieldComponent from "../../fieldcompw/relatedProducts";
import OrderSubtotalFieldComponent from "../../fieldcompw/orderSubtotal";
import OrderTotalFieldComponent from "../../fieldcompw/orderTotal";
import ShippingMethodFieldComponent from "../../fieldcompw/shippingMethod";
import PaymentMethodFieldComponent from "../../fieldcompw/paymentMethod";
import CustomerNoteFieldComponent from "../../fieldcompw/customerNote";
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
  const dropRef = useRef<HTMLDivElement>(null);

  const [, dropLayout] = useDrop(() => ({
    accept: "layout",
    drop: (item: { columns: number }) => {
      if (!previewMode) {
        dispatch(addBlock({ columns: item.columns }));
      }
    },
  }));

  useEffect(() => {
    if (dropRef.current) dropLayout(dropRef.current);
  }, [dropLayout]);

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
            const parsedBlocks: DroppedBlock[] = JSON.parse(response.data.data.json_data);
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
    setDeleteConfirmOpen(id);
  };

  const confirmDelete = (id: string) => {
    if (previewMode) return;
    dispatch(deleteBlock(id));
    setDeleteConfirmOpen(null);
  };

  const cancelDelete = () => {
    if (previewMode) return;
    setDeleteConfirmOpen(null);
  };

  const handleCopy = (id: string) => {
    if (previewMode) return;
    dispatch(copyBlock(id));
  };

  return (
    <Box
      ref={dropRef}
      onClickCapture={handleClickOutside}
      sx={{
        width: "100%",
        backgroundColor: previewMode ? "#fff" : "#eaeaea",
        padding: previewMode ? 0 : 2,
        paddingTop: 0,
        paddingX: 0,
        height: previewMode ? "auto" : "100%",
        cursor: previewMode ? "default" : "auto",
        overflowY: "auto",
      }}
    >
      {blocks.length === 0 && !previewMode && (
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
            Drag a layout from the general layout to get started
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
      {!previewMode && (
        <Dialog open={!!deleteConfirmOpen} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this block?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => confirmDelete(deleteConfirmOpen!)}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
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

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

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

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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
        maxWidth: isMobileView ? "100%" : previewMode ? "100%" : "80%",
        margin: previewMode ? "0" : "0 auto",
        position: "relative",
        display: isMobileView ? "flex" : "table",
        flexDirection: isMobileView ? "column" : undefined,
        width: "100%",
        tableLayout: isMobileView ? undefined : "fixed",
        boxSizing: "border-box",
        cursor: previewMode ? "default" : "pointer",
        opacity: isDragging ? 0.5 : 1,
        border: isOver ? "2px dashed #3ba0f3" : "none",
        ".action-btn": {
          display:
            !previewMode && selectedBlockId === block.id ? "block" : "none",
        },
      }}
    >
      {block.columns.map((column, i) => (
        <ColumnDropTarget
          key={column.id}
          block={block}
          column={column}
          columnIndex={i}
          isMobileView={isMobileView}
          previewMode={previewMode}
        />
      ))}

      {!previewMode && selectedBlockId === block.id && (
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
              }}
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(block.id);
              }}
            />
          </Tooltip>
        </Box>
      )}
    </Box>
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
    }) => {
      if (previewMode) return;
      let contentDataToSend: string | null = null;

      // Handle content data based on widget type
      if (item.widgetType === "text") {
        contentDataToSend = JSON.stringify(defaultTextEditorOptions);
      } else if (item.widgetType === "button") {
        contentDataToSend = JSON.stringify(defaultButtonEditorOptions);
      } else if (item.widgetType === "heading") {
        contentDataToSend = JSON.stringify(defaultHeadingEditorOptions);
      } else if (item.widgetType === "socialIcons") {
        contentDataToSend = JSON.stringify(defaultSocialIconsEditorOptions);
      } else if (item.widgetType === "image") {
        contentDataToSend = item.initialContent || "";
      } else if (item.widgetType === "divider") {
        contentDataToSend = JSON.stringify(defaultDividerEditorOptions);
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
      } else if (item.widgetType === "row") {
        contentDataToSend = JSON.stringify({
          backgroundColor: 'transparent',
          columns: 2,
          gap: 20
        });
      } else if (item.widgetType === "emailHeader") {
        contentDataToSend = JSON.stringify(defaultEmailHeaderEditorOptions);
      } else if (item.widgetType === "emailFooter") {
        contentDataToSend = JSON.stringify(defaultEmailFooterEditorOptions);
      } else if (item.widgetType === "code") {
        contentDataToSend = JSON.stringify(defaultCodeEditorOptions);
      } else if (item.widgetType === "price") {
        contentDataToSend = JSON.stringify(defaultPriceEditorOptions);
      } else if (item.widgetType === "section") {
        contentDataToSend = JSON.stringify({
          backgroundColor: '#f5f5f5',
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          border: { width: 1, style: 'solid', color: '#ddd', radius: 0 }
        });
      } else {
        // For new widgets, send empty JSON or default data
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
  }));

  useEffect(() => {
    if (columnRef.current) {
      drop(columnRef.current);
    }
  }, [columnRef, drop]);

  const renderContent = () => {
    if (column.widgetContents.length === 0) {
      return (
        <Typography
          sx={{ fontSize: "12px", color: "#1976d2", textAlign: "center" }}
        >
          No content here. Drag content from right.
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

      // Main switch statement for all widget types
      switch (widget.contentType) {
        // Basics Layout Widgets
        case "text":
          return (
            <TextFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              onClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "heading":
          return (
            <HeadingFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              onClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "socialIcons":
          return (
            <SocialIconsFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              onClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "divider":
          return (
            <DividerFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "image":
          return (
            <ImageFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "button":
          return (
            <ButtonFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "section":
          return (
            <SectionFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
            />
          );
        case "spacer":
          return (
            <SpacerFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "link":
          return (
            <LinkFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "linkBox":
          return (
            <LinkBoxFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "imageBox":
          return (
            <ImageBoxFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "map":
          return (
            <MapFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "icon":
          return (
            <IconFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );

        // Layout Block Widgets 
        case "row":
          return (
            <RowFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
            />
          );
        case "container":
          return (
            <ContainerFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "group":
          return (
            <GroupFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );

        // Forms Widgets
        case "form":
          return (
            <FormFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "survey":
          return (
            <SurveyFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "input":
          return (
            <InputFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "textarea":
          return (
            <TextareaFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "select":
          return (
            <SelectFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "checkbox":
          return (
            <CheckboxFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "radio":
          return (
            <RadioFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "label":
          return (
            <LabelFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );

        // Extra Block Widgets 
        case "socialFollow":
          return (
            <SocialFollowFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "video":
          return (
            <VideoFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "code":
          return (
            <CodeFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
            />
          );
        case "countdown":
          return (
            <CountdownFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "progressBar":
          return (
            <ProgressBarFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "product":
          return (
            <ProductFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "promoCode":
          return (
            <PromoCodeFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "price":
          return (
            <PriceFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
            />
          );
        case "testimonial":
          return (
            <TestimonialFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "navbar":
          return (
            <NavbarFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "card":
          return (
            <CardFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
              widgetData={widget}
            />
          );
        case "alert":
          return (
            <AlertFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "progress":
          return (
            <ProgressFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );

        // Woocommerce Widgets
        case "shippingAddress":
          return (
            <ShippingAddressFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "billingAddress":
          return (
            <BillingAddressFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "orderItems":
          return (
            <OrderItemsFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "taxBilling":
          return (
            <TaxBillingFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "emailHeader":
          return (
            <EmailHeaderFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "emailFooter":
          return (
            <EmailFooterFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "ctaButton":
          return (
            <CtaButtonFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "relatedProducts":
          return (
            <RelatedProductsFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "orderSubtotal":
          return (
            <OrderSubtotalFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "orderTotal":
          return (
            <OrderTotalFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "shippingMethod":
          return (
            <ShippingMethodFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "paymentMethod":
          return (
            <PaymentMethodFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );
        case "customerNote":
          return (
            <CustomerNoteFieldComponent
              key={index}
              blockId={block.id}
              columnIndex={columnIndex}
              widgetIndex={index}
              isSelected={isWidgetSelected}
              onClick={defaultOnClick}
              onWidgetClick={handleWidgetClick(widget.contentType, index)}
            />
          );

        default:
          return null;
      }
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
  const columnStyle: React.CSSProperties = {
    width: `${columnWidth}%`,
    minWidth: `${columnWidth}%`,
    maxWidth: `${columnWidth}%`,
    display: 'table-cell',
    verticalAlign: 'top',
    boxSizing: 'border-box',
    backgroundColor: column.style.bgColor,
    borderTop: `${column.style.borderTopSize}px ${column.style.borderStyle} ${column.style.borderTopColor}`,
    borderBottom: `${column.style.borderBottomSize}px ${column.style.borderStyle} ${column.style.borderBottomColor}`,
    borderLeft: `${column.style.borderLeftSize}px ${column.style.borderStyle} ${column.style.borderLeftColor}`,
    borderRight: `${column.style.borderRightSize}px ${column.style.borderStyle} ${column.style.borderRightColor}`,
    padding: `${column.style.padding.top}px ${column.style.padding.right}px ${column.style.padding.bottom}px ${column.style.padding.left}px`,
    minHeight: `${columnDisplayHeight}px`,
    position: 'relative',
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
    <div
      ref={columnRef}
      className="droppable-column"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        dispatch(setSelectedBlockId(block.id));
        dispatch(
          openEditor({ blockId: block.id, columnIndex, contentType: null })
        );
      }}
      style={columnStyle}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignItems,
        justifyContent: column.widgetContents.length ? 'flex-start' : 'center',
        gap: '8px',
        minHeight: `${columnDisplayHeight}px`,
        width: '100%',
      }}>
        {renderContent()}
      </div>
    </div>
  );
};