import React from "react";
import Skeleton from 'react-loading-skeleton';

class SkeletonProductRaw extends React.Component {
    render() {
        return (
            <tr className={"w-100"}>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
                <th scope={'row'}>
                    <div style={{'height': '48px'}} className={"d-flex w-100 align-items-center"}>
                        <div className={"w-100"}>
                            <Skeleton/>
                        </div>
                    </div>
                </th>
            </tr>
        )
    }
}

SkeletonProductRaw.propTypes = {
};

export default SkeletonProductRaw;