import React from "react";
import $ from "jquery";
import ImageUploaderNative from 'react-images-upload';
import PropTypes from "prop-types";

class ImageUploader extends React.Component {

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(pictures) {
        const picture = pictures[pictures.length - 1];
        this.props.onChange(picture);
    }

    onImageClick() {
        $(".imageUploader").click();
    }

    render() {
        const pictureUrl = this.props.src ? this.props.src : this.props.baseUrl;
        return (
            <>
                <div className="position-relative w-fit-content mx-auto rounded shadow-lg overflow-hidden">
                    <div className="overlay-image-uploader position-absolute h-100 w-100 cursor-pointer d-flex"
                         onClick={() => this.onImageClick()}>
                        <i className="fa fa-edit m-auto fa-4x"/>
                    </div>
                    <img
                        src={pictureUrl} alt=""
                        className="img-fluid"
                        style={{"maxHeight": "200px", "maxWidth": "200px"}}
                    />
                </div>
                <div className="d-none">
                    <ImageUploaderNative
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        buttonClassName={"imageUploader"}
                        singleImage={true}
                    />
                </div>
            </>
        );
    }
}

ImageUploader.propTypes = {
    onChange: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired,
    src: PropTypes.string
};

export default ImageUploader;
