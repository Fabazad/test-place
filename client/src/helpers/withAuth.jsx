import React, { useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import userService from 'services/user.services';
import DemoNavbar from '../components/Navbars/DemoNavbar';
import Loading from 'components/Loading';

const withAuth = (ComponentToProtect) => {
    return (props) => {

        const [redirect, setRedirect] = useState(false);
        const [checked, setCheck] = useState(false);
        const [loadingPromise, setLoadingPromise] = useState(null);

        useEffect(() => {
            const loadingPromise = userService.checkToken()
                .then((res) => {
                    if (res && res.check) {
                        setCheck(true)
                    } else {
                        setCheck(true);
                        setRedirect(true)
                        userService.logout();
                    }
                });
            setLoadingPromise(loadingPromise)
        }, [])

        if (redirect) {
            return <Redirect to='/login'/>;
        }
        if (!userService.isAlreadyChecked() && !checked) {
            return (<><Loading key={"0"} loading={true}/></>);
        }
        return (
            <React.Fragment>
                <Loading key={"1"} promise={loadingPromise}/>
                <DemoNavbar {...props}/>
                <ComponentToProtect {...props} />
            </React.Fragment>
        );
    }

}

export default withAuth