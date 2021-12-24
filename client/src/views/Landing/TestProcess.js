import {Container} from "reactstrap";
import React from "react";
import {withTranslation} from "react-i18next";
import ReactPlayer from "react-player";

const TestProcess = props => {

    const {t} = props;

    return (
        <Container>
            <div className="w-100 text-center mt-3">
                <h1 className="text-white display-3">{t("HOW_DOES_IT_WORK")}</h1>
            </div>
            <div className="justify-content-around pt-5 d-block d-md-flex">
                <div className="text-center flex-grow-1">
                    <div className="icon icon-shape bg-gradient-white text-primary rounded-circle shadow">
                        <i className="fa fa-question"/>
                    </div>
                    <div className="text-white mt-2 white-space-pre-line"><b>{t("TEST_REQUEST")}</b></div>
                </div>
                <div className="text-center flex-grow-0">
                    <i className="fa fa-ellipsis-h text-white fa-2x mt-2 d-none d-md-inline"/>
                    <i className="fa fa-ellipsis-v d-block d-md-none text-white fa-2x mt-2 my-4"/>
                </div>
                <div className="text-center flex-grow-1">
                    <div className="icon icon-shape bg-gradient-white text-primary rounded-circle shadow">
                        <i className="fa fa-box-open"/>
                    </div>
                    <div className="text-white mt-2 white-space-pre-line"><b>{t("BUY_ON_AMAZON")}</b></div>
                </div>
                <div className="text-center flex-grow-0">
                    <i className="fa fa-ellipsis-h text-white fa-2x mt-2 d-none d-md-inline"/>
                    <i className="fa fa-ellipsis-v d-block d-md-none text-white fa-2x mt-2 my-4"/>
                </div>
                <div className="text-center flex-grow-1">
                    <div className="icon icon-shape bg-gradient-white text-primary rounded-circle shadow">
                        <i className="fa fa-star"/>
                    </div>
                    <div className="text-white mt-2 white-space-pre-line"><b>{t("PRODUCT_REVIEW")}</b></div>
                </div>
                <div className="text-center flex-grow-0">
                    <i className="fa fa-ellipsis-h text-white fa-2x mt-2 d-none d-md-inline"/>
                    <i className="fa fa-ellipsis-v d-block d-md-none text-white fa-2x mt-2 my-4"/>
                </div>
                <div className="text-center flex-grow-1">
                    <div className="icon icon-shape bg-gradient-white text-primary rounded-circle shadow">
                        <i className="fa fa-dollar-sign"/>
                    </div>
                    <div className="text-white mt-2 white-space-pre-line"><b>{t("REFUND")}</b></div>
                </div>
            </div>
            <div className="w-100 d-flex justify-content-center mt-5">
                <div className="w-100">
                    <ReactPlayer controls width="auto" url="https://www.youtube.com/watch?v=W0nGhLXuCr4"/>
                </div>
            </div>
        </Container>
    )
};

export default withTranslation()(TestProcess);