import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { AtpSessionData } from "@atproto/api";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

const useStyles = makeStyles({
    left: {
        // height: '100vh',
        // backgroundColor: 'red',
    },
    mid: {
        height: '100vh',
        width: '100vw',
        backgroundColor: 'blue',
        // maxWidth: '600px',
        // width: '600px',
    },
    right: {
        // height: '100vh',
        // backgroundColor: 'red',
        // backdropFilter: 'blur(30px)',
    },
});

interface Props {
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
        <Grid className={classes.mid} container alignItems='center' justifyContent='center'>
            {/* <div id='mid'  */}
                {props.middleMainContent}
            {/* </div> */}
        </Grid>
    )
}

export default SideNavBar;