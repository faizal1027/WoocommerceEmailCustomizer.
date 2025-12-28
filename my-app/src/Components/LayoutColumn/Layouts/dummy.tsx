import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";

const Dummy = () => {

  const { blocks } = useSelector((state: RootState) => state.workspace);
    
  const renderColumnContent = (column: any) => {
    switch (column.contentType) {
      case "text":
        return (
          <Typography
            sx={{ ...column.textEditorOptions, whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: column.textEditorOptions.content }}
          />
        );
      case "heading":
        return (
          <Typography
            component={column.headingEditorOptions.headingType}
            sx={{ ...column.headingEditorOptions, whiteSpace: "pre-wrap" }}
          >
            {column.contentData || "Heading"}
          </Typography>
        );
      case "socialIcons":
        return (
          <Typography>
            {column.socialIconsEditorOptions.addedIcons.icons.join(", ") || "Social Icons"}
          </Typography>
        );
      case "divider":
        return <Box sx={{ borderTop: `${column.dividerEditorOptions.thickness}px ${column.dividerEditorOptions.style} ${column.dividerEditorOptions.color}`, width: column.dividerEditorOptions.width }} />;
      case "image":
        return (
          <Box
            component="img"
            src={column.imageEditorOptions.src || "https://via.placeholder.com/150"}
            alt={column.imageEditorOptions.altText || "Image"}
            sx={{ width: column.imageEditorOptions.width, textAlign: column.imageEditorOptions.align as any }}
          />
        );
      case "button":
        return (
          <Typography
            sx={{
              padding: `${column.buttonEditorOptions.padding.top}px ${column.buttonEditorOptions.padding.right}px ${column.buttonEditorOptions.padding.bottom}px ${column.buttonEditorOptions.padding.left}px`,
              backgroundColor: column.buttonEditorOptions.bgColor,
              color: column.buttonEditorOptions.textColor,
              textAlign: column.buttonEditorOptions.textAlign,
              borderRadius: `${column.buttonEditorOptions.borderRadius.topLeft}px`,
            }}
          >
            {column.contentData ? JSON.parse(column.contentData).text : "Button"}
          </Typography>
        );
      case "shippingAddress":
        return (
          <Typography>
            {column.contentData ? JSON.parse(column.contentData).fullName : "Shipping Address"}
          </Typography>
        );
      default:
        return (
          <Typography sx={{ fontSize: "12px", color: "#1976d2", textAlign: "center" }}>
            No content
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {blocks.length === 0 ? (
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: 4,
            textAlign: "center",
            color: "#666",
            width: "700px",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>No template created yet</Typography>
        </Box>
      ) : (
        blocks.map((block) => (
          <Box
            key={block.id}
            sx={{
              maxWidth: "50%",
              margin: "0 auto",
              position: "relative",
              display: "flex",
              boxSizing: "border-box",
              backgroundColor: block.style.bgColor,
              borderTop: `${block.style.borderTopSize}px ${block.style.borderStyle} ${block.style.borderTopColor}`,
              borderBottom: `${block.style.borderBottomSize}px ${block.style.borderStyle} ${block.style.borderBottomColor}`,
              borderLeft: `${block.style.borderLeftSize}px ${block.style.borderStyle} ${block.style.borderLeftColor}`,
              borderRight: `${block.style.borderRightSize}px ${block.style.borderStyle} ${block.style.borderRightColor}`,
              padding: `${block.style.padding.top}px ${block.style.padding.right}px ${block.style.padding.bottom}px ${block.style.padding.left}px`,
            }}
          >
            {block.columns.map((column, columnIndex) => (
              <Box
                key={column.id}
                sx={{
                  flex: 1,
                  borderLeft: `${column.style.borderLeftSize}px ${column.style.borderStyle} ${column.style.borderLeftColor}`,
                  borderTop: `${column.style.borderTopSize}px ${column.style.borderStyle} ${column.style.borderTopColor}`,
                  borderBottom: `${column.style.borderBottomSize}px ${column.style.borderStyle} ${column.style.borderBottomColor}`,
                  borderRight: `${column.style.borderRightSize}px ${column.style.borderStyle} ${column.style.borderRightColor}`,
                  backgroundColor: column.style.bgColor,
                  padding: `${column.style.padding.top}px ${column.style.padding.right}px ${column.style.padding.bottom}px ${column.style.padding.left}px`,
                  minHeight: column.style.height === "auto" ? "100px" : column.style.height,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderColumnContent(column)}
              </Box>
            ))}
          </Box>
        ))
      )}
    </Box>
  );
};

export default Dummy;