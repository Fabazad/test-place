import Button from "reactstrap/lib/Button";
import React, {useEffect, useState} from "react";
import Progress from "reactstrap/lib/Progress";

const CONFIRM_LOADING_STEP = {
    VALUE: 5,
    INTERVAL: 50,
    START: 30
};

const ConfirmButton = ({children, disabled, className, color, type, onClick}) => {

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [loadingPercent, setLoadingPercent] = useState(null);
    const progressId = useState(Math.round(Math.random() * 10000))[0];

    const isOnButtonTarget = (e) => {
        const targetId = "confirm-button-" + progressId;
        return e.target.id === targetId || e.target.offsetParent.id === targetId
    };

    useEffect(() => {
        if (loadingPercent !== null && loadingPercent < 100 && isMouseDown && !disabled) {
            setTimeout(
                () => setLoadingPercent(loadingPercent + CONFIRM_LOADING_STEP.VALUE),
                CONFIRM_LOADING_STEP.INTERVAL
            );
        }
    }, [loadingPercent]);

    const onMouseDown = (e) => {
        if (isOnButtonTarget(e)) {
            setIsMouseDown(true);
            setLoadingPercent(CONFIRM_LOADING_STEP.START);
        }
    };

    const onMouseUp = () => {
        setIsMouseDown(false);
        setTimeout(() => setLoadingPercent(null), CONFIRM_LOADING_STEP.INTERVAL + 200);
    };

    const onTouchEnd = (e) => {
        e.target.click();
        onMouseUp();
    };

    useEffect(() => {
        document.addEventListener("mouseup", onMouseUp);
        return () => document.removeEventListener("mouseup", onMouseUp);
    }, []);

    const handleClick = (e) => {
        if (loadingPercent < 100) {
            if (e) e.preventDefault();
        }
        else if (onClick !== undefined) onClick();
    };

    return <Button disabled={disabled} className={"confirm-button " + className || ""}
                   id={"confirm-button-" + progressId} onTouchEnd={onTouchEnd}
                   color={color} onClick={handleClick} onTouchStart={onMouseDown}
                   onMouseDown={onMouseDown}
                   type={type}>
        <Progress value={loadingPercent} color={color === "default" ? "white" : "dark"}/>
        {children}
        <span>{children}</span>
    </Button>
};

export default ConfirmButton;