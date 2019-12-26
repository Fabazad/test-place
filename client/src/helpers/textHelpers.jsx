import React from "react";
import { UncontrolledTooltip } from "reactstrap";

export function textSlice(text, max) {
    if (text.length > max) {
        const tooltipId = Math.ceil(Math.random() * 10000);
        return (
            <>
                { text.slice(0, max) }
                <span id={"tooltip" + tooltipId}>...</span>
                <UncontrolledTooltip
                    delay={0}
                    placement="top"
                    target={"tooltip" + tooltipId}
                >
                    {text}
                </UncontrolledTooltip>
            </>
        )
    }
    return text;
}

export function formatDate(d) {
    const date = new Date(d);
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const years = date.getFullYear();

    return `${days}/${months}/${years}`;
}