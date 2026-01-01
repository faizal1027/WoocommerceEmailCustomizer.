import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";

interface TextFieldComponentProps {
    blockId: string;
    columnIndex: number;
    widgetIndex: number;
    onClick?: (e: React.MouseEvent) => void;
    isSelected?: boolean;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
    blockId,
    columnIndex,
    widgetIndex,
    onClick,
    isSelected,
}) => {
    const { blocks } = useSelector((state: RootState) => state.workspace);
    const block = blocks.find((b) => b.id === blockId);
    const column = block?.columns[columnIndex];
    const widget = column?.widgetContents[widgetIndex];

    if (!widget || widget.contentType !== "text") return null;

    const content = widget.contentData
        ? JSON.parse(widget.contentData)
        : { content: "Text Block" };

    const sxStyles = {
        fontFamily: content.fontFamily,
        fontSize: content.fontSize,
        color: content.color,
        textAlign: content.textAlign,
        backgroundColor: content.backgroundColor,
        lineHeight: content.lineHeight ? `${content.lineHeight}%` : undefined,
        letterSpacing: content.letterSpace ? `${content.letterSpace}px` : undefined,
        paddingTop: content.padding?.top,
        paddingRight: content.padding?.right,
        paddingBottom: content.padding?.bottom,
        paddingLeft: content.padding?.left,
        whiteSpace: "pre-wrap",
    };

    return (
        <div onClick={onClick} style={{ cursor: "pointer", border: isSelected ? "2px solid blue" : "none" }}>
            <Typography
                sx={sxStyles}
                dangerouslySetInnerHTML={{ __html: content.content }}
            />
        </div>
    );
};

export default TextFieldComponent;
