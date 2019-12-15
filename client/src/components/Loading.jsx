import React from "react";
import {css} from '@emotion/core';
import {BounceLoader} from 'react-spinners';
import PropTypes from 'prop-types';

const override = css`
    display: block;
    margin: auto;
    border-color: red;
`;

class Loading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: null
        };
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({loading: this.props.loading});
        if (this.props.promise) {
            this.setState({loading: true});
            this.props.promise.finally(() => {
                if (this._isMounted) {
                    this.setState({loading: false})
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promise && this._isMounted) {
            this.setState({loading: true});
            nextProps.promise.finally(() => {
                if (this._isMounted) {
                    this.setState({loading: false})
                }
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (!this.state.loading) {
            return null;
        }
        return (
            <>
                <div className="position-absolute w-100 h-100 bg-white loading d-flex">
                    <BounceLoader
                        css={override}
                        sizeUnit={"px"}
                        size={70}
                        color={'#123abc'}
                        loading={this.state.loading}
                    />
                </div>
            </>
        );
    }
}

Loading.propTypes = {
    loading: PropTypes.bool,
    promise: PropTypes.shape({
        then: PropTypes.func.isRequired,
        catch: PropTypes.func.isRequired
    })
};

export default Loading;
