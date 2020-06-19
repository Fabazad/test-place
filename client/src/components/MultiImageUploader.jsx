import React, {useRef} from "react";
// reactstrap components
import {
    Badge
} from "reactstrap";
import PropTypes from "prop-types";
import ImageUploader from "./ImageUploader";
import constants from "../helpers/constants";
import {Link} from "react-router-dom";

const MultiImageUploader = props => {

    const lastUploaderRef = useRef(null);

    const onChange = (image, index) => {
        const newImages = props.images.slice(0);
        newImages[index] = image;
        props.onChange(newImages);
    };

    const removeImage = (e, index) => {
        e.preventDefault();
        const newImages = props.images.slice(0);
        newImages.splice(index, 1);
        props.onChange(newImages);
    };

    const onNewImage = image => {
        const newImages = props.images.slice(0);
        newImages.push(image);
        props.onChange(newImages);
    };

    return (
        <div className="w-100 text-center overflow-x-auto white-space-nowrap">
            {
                props.images.map((image, index) => {
                    let imageUrl = '';
                    if (typeof image === 'object') {
                        imageUrl = URL.createObjectURL(image);
                    } else {
                        imageUrl = image;
                    }
                    return (
                        <div className="d-inline-block mx-2 mt-3 position-relative" key={imageUrl}>
                            <ImageUploader onChange={file => onChange(file, index)} src={imageUrl}
                                           baseUrl={constants.BASE_PRODUCT_PICTURE_URL}/>
                            <Badge pill className="badge-circle cursor-pointer position-absolute" color={'danger'}
                                   tag={Link} style={{top: '-12px', right: '-12px'}} to={'#'}
                                   onClick={e => removeImage(e, index)}>
                                <i className="fa fa-times"/>
                            </Badge>
                        </div>
                    )
                })
            }

            {
                props.images.length < props.maxFile ? (
                    <div className="d-inline-block mx-2 mt-3 position-relative">
                        <ImageUploader onChange={onNewImage}
                                       baseUrl={constants.BASE_PRODUCT_PICTURE_URL} ref={lastUploaderRef}/>
                    </div>
                ) : null
            }
        </div>
    );
}

MultiImageUploader.propTypes = {
    images: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    maxFile: PropTypes.number.isRequired
};

export default MultiImageUploader;