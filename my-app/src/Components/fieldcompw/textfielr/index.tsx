import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { defaultTextEditorOptions } from "../../../Store/Slice/workspaceSlice";

interface TextFieldComponentProps {
    blockId: string;
    columnIndex: number;
    widgetIndex: number;
    onClick?: (e: React.MouseEvent) => void;
    onWidgetClick?: (e: React.MouseEvent) => void;
    isSelected?: boolean;
    widgetData?: any;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
    blockId,
    columnIndex,
    widgetIndex,
    onClick,
    onWidgetClick,
    isSelected,
    widgetData
}) => {
    const { blocks } = useSelector((state: RootState) => state.workspace);
    const storeBlock = blocks.find((b) => b.id === blockId);
    const storeColumn = storeBlock?.columns[columnIndex];
    const storeWidget = storeColumn?.widgetContents[widgetIndex];

    const widget = widgetData || storeWidget;

    if (!widget || widget.contentType !== "text") return null;

    const content = widget.contentData
        ? { ...defaultTextEditorOptions, ...JSON.parse(widget.contentData) }
        : defaultTextEditorOptions;

    const sxStyles = {
        fontFamily: content.fontFamily,
        fontSize: content.fontSize,
        color: content.color,
        textAlign: content.textAlign,
        backgroundColor: content.backgroundColor,
        lineHeight: content.lineHeight ? `${content.lineHeight}px` : undefined,
        letterSpacing: content.letterSpace ? `${content.letterSpace}px` : undefined,
        paddingTop: content.padding?.top,
        paddingRight: content.padding?.right,
        paddingBottom: content.padding?.bottom,
        paddingLeft: content.padding?.left,
        whiteSpace: "pre-wrap",
    };

    const handleClick = (e: React.MouseEvent) => {
        if (onWidgetClick) {
            onWidgetClick(e);
        } else if (onClick) {
            e.stopPropagation();
            onClick(e);
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <Typography
                sx={sxStyles}
                dangerouslySetInnerHTML={{ __html: content.content }}
            />
        </div>
    );
};

export default TextFieldComponent;
