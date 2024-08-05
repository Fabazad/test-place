import { css } from "@emotion/react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

const override = css`
  display: block;
  margin: auto;
  border-color: red;
`;

console.log(React.version);

const Loading = (props) => {
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (props.promise) {
      setLoading(true);
      props.promise.finally(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (props.promise) {
      setLoading(true);
      props.promise.finally(() => setLoading(false));
    }
  }, [props.promise]);

  if (!loading && !props.loading) {
    return null;
  }
  return (
    <>
      <div className="position-absolute w-100 h-100 bg-white loading d-flex overflow-hidden top-0 left-0">
        <BounceLoader
          css={override}
          sizeUnit={"px"}
          size={70}
          color={"#123abc"}
          loading={loading || props.loading}
        />
      </div>
    </>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool,
  promise: PropTypes.shape({
    then: PropTypes.func.isRequired,
    catch: PropTypes.func.isRequired,
  }),
};

export default Loading;
