import Skeleton from "react-loading-skeleton";
import React from "react";
import PropTypes from "prop-types";

const RowSkeleton = props => {

    const {colNumber} = props;

    return (
        <tr className={"w-100"}>
            {(new Array(colNumber)).fill(null).map((col, i) => (
                <th scope={'row'} key={'skeleton-row' + i}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
            ))}
        </tr>
    );
};

RowSkeleton.propTypes = {
    colNumber: PropTypes.number.isRequired
};


export default RowSkeleton;