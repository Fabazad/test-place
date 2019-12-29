import React from "react";
// reactstrap components
import {
    UncontrolledCarousel
} from "reactstrap";
import PropTypes from "prop-types";

class Carousel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    nextImage() {
        if (this.state.selectedIndex + 1 < this.props.imageUrls.length) {
            this.setState({selectedIndex: this.state.selectedIndex + 1});
        } else {
            this.setState({selectedIndex: 0})
        }
    }

    prevImage() {
        if (this.state.selectedIndex > 0) {
            this.setState({selectedIndex: this.state.selectedIndex - 1});
        } else {
            this.setState({selectedIndex: this.props.imageUrls.length - 1});
        }
    }

    selectImage(index) {
        this.setState({selectedIndex: index});
    }

    render() {
        return (
            <>
                <div className='rounded overflow-hidden shadow'>
                    <UncontrolledCarousel items={this.props.imageUrls.map(imageUrl => {
                        return {'src': imageUrl};
                    })} activeIndex={this.state.selectedIndex} next={() => this.nextImage()}
                                          previous={() => this.prevImage()}
                                          indicators={false}/>
                </div>

                <div className="w-100 overflow-x-auto white-space-nowrap">
                    {
                        this.props.imageUrls.map((imageUrl, index) => (
                            <img src={imageUrl} alt="thunbail"
                                 className={"rounded shadow m-2 cursor-pointer " + (index === this.state.selectedIndex ? 'selected' : '')}
                                 width="100" onClick={() => this.selectImage(index)}
                                 key={imageUrl}/>
                        ))
                    }
                </div>
            </>
        );
    }
}

Carousel.propTypes = {
    imageUrls: PropTypes.arrayOf(String).isRequired
};

export default Carousel;