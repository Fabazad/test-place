import React from "react";
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: auto;
    border-color: red;
`;

class Loading extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: null
        }
    }

    componentDidMount() {
        console.log(this.props.loading);
        this.setState({ loading: this.props.loading });
        if (this.props.promise) {
            this.setState({loading: true});
            this.props.promise.finally(() => this.setState({loading: false}));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promise) {
            this.setState({loading: true});
            nextProps.promise.finally(() => this.setState({loading: false}));
        }
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

export default Loading;
