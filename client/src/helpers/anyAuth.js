import React, { memo, useEffect, useState } from "react";
import Loading from "../components/Loading";
import DemoNavbar from "../components/Navbars/DemoNavbar";
import userService from "../services/user.services";
import { getCookie } from "./cookies";

const anyAuth = (ComponentToProtect) => {
  return memo((props) => {
    console.log({ props: JSON.parse(JSON.stringify(props)) });
    const [loadingPromise, setLoadingPromise] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      console.log("anyAuth");
      if (!getCookie("token")) {
        userService.logout();
        setChecked(true);
      } else {
        const promise = userService.checkToken().then(() => {
          setChecked(true);
        });
        setLoadingPromise(promise);
      }
    }, []);

    if (!userService.isAlreadyChecked() && !checked) {
      return <Loading key={"0"} loading={true} />;
    }

    return (
      <React.Fragment>
        <div id="login">
          <Loading promise={loadingPromise} loading={false} />
          <DemoNavbar {...props} />
          <ComponentToProtect {...props} />
        </div>
      </React.Fragment>
    );
  });
};

export default anyAuth;
