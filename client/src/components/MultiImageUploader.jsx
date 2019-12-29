import React from "react";
// reactstrap components
import {
    Badge
} from "reactstrap";
import PropTypes from "prop-types";
import ImageUploader from "./ImageUploader";
import constants from "../helpers/constants";
import {Link} from "react-router-dom";

class MultiImageUploader extends React.Component {

    constructor(props) {
        super(props);
        this.lastUploaderRef = React.createRef();
        this.state = {
            images: []
        }
    }

    componentDidMount() {
        this.setState({ images : this.props.images });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if ('images' in nextProps) {
            this.setState({ images: nextProps.images });
        }
    }

    onChange(image, index) {
        const {images} = this.props;
        images[index] = image;
        this.props.onChange(images);
    }

    removeImage(e, index) {
        e.preventDefault();
        const {images} = this.props;
        images.splice(index, 1);
        this.props.onChange(images);
    }

    onNewImage(image) {
        const {images} = this.props;
        images.push(image);
        this.props.onChange(images);
    }

    render() {
        return (
            <div className="w-100 text-center overflow-x-auto white-space-nowrap">
                {
                    this.props.images.map((image, index) => {
                        let imageUrl = '';
                        if (typeof image === 'object') {
                            imageUrl = URL.createObjectURL(image);
                        } else {
                            imageUrl = image;
                        }
                        return (
                            <div className="d-inline-block mx-2 mt-3 position-relative" key={imageUrl}>
                                <ImageUploader onChange={(file) => this.onChange(file, index)} src={imageUrl}
                                               baseUrl={constants.BASE_PRODUCT_PICTURE_URL}/>
                                <Badge pill className="badge-circle cursor-pointer position-absolute" color={'danger'}
                                       tag={Link} style={{top: '-12px', right: '-12px'}} to={'#'}
                                       onClick={e => this.removeImage(e, index)}>
                                    <i className="fa fa-close"/>
                                </Badge>
                            </div>
                        )
                    })
                }

                {
                    this.props.images.length < this.props.maxFile ? (
                        <div className="d-inline-block mx-2 mt-3 position-relative">
                            <ImageUploader onChange={(file) => this.onNewImage(file)}
                                           baseUrl={constants.BASE_PRODUCT_PICTURE_URL} ref={this.lastUploaderRef}/>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

MultiImageUploader.propTypes = {
    images: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    maxFile: PropTypes.number.isRequired
};

export default MultiImageUploader;