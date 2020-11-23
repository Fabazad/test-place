import Button from "reactstrap/lib/Button";
import React, {useEffect, useState} from "react";
import Progress from "reactstrap/lib/Progress";

const CONFIRM_LOADING_STEP = {
    VALUE: 10,
    INTERVAL: 60
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
            setTimeout(() => setLoadingPercent(loadingPercent + CONFIRM_LOADING_STEP.VALUE), CONFIRM_LOADING_STEP.INTERVAL);
        }
    }, [loadingPercent]);

    const onMouseDown = (e) => {
        if (isOnButtonTarget(e)) {
            setIsMouseDown(true);
            setLoadingPercent(0);
        }
    };

    const onMouseUp = () => {
        setIsMouseDown(false);
        setTimeout(() => setLoadingPercent(null), CONFIRM_LOADING_STEP.INTERVAL + 5);
    };

    useEffect(() => {
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        }
    }, []);

    const handleClick = (e) => {
        if (loadingPercent < 100) e.preventDefault();
        else if (onClick !== undefined) onClick(e);
    };

    return <Button disabled={disabled} className={"confirm-button " + className || ""} id={"confirm-button-" + progressId}
                   color={color} onClick={handleClick}
                   type={type}>
        <Progress value={loadingPercent} color={color === "default" ? "white" : "dark"}/>
        {children}
        <span>{children}</span>
    </Button>
};

export default ConfirmButton;