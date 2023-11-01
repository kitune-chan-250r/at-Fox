import { Fragment, useEffect } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Hidden } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { AtpSessionData } from "@atproto/api";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

const useStyles = makeStyles({
    main: {
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        // position: 'relative',
        // maxWidth: '600px',
        // width: '600px',
    }
});

interface Props {
    myProfile: ProfileResponse;
    middleMainContent: JSX.Element;
    middleSubContent?: JSX.Element; //?をつけるとオプショナルPropsになる
}

export const SideNavBar = (props: Props) => {
    // const [cookies, setCookie, removeCookie] = useCookies();
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        var isLogin = checkSessionData(cookies?.sessionData);
        if (!isLogin) {
            navigate('/login');
        }
    }, []);
   
    const loginData = cookies.sessionData as AtpSessionData;

    return(
        <Fragment>
            <Grid className={classes.main} container alignItems="center" justifyContent="center">
                {props.middleMainContent}

            </Grid>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
                
            }}>
                <Hidden lgDown>
                    <Grid container style={{width: '100%', height: '100vh', backgroundColor: 'blue'}}>
                        <p>hello</p>
                    </Grid>
                </Hidden>
                <Hidden lgDown>
                    <Grid container style={{width: '100%', height: '100vh', minWidth: 620, maxWidth: 620, backgroundColor: 'red'}}>
                    </Grid>
                </Hidden>
                <Hidden lgDown>
                    <Grid container style={{width: '100%', height: '100vh', backgroundColor: 'yellow'}}>
                        <p>hello</p>
                    </Grid>
                </Hidden>
            </Box>
        </Fragment>
    )
}

export default SideNavBar;