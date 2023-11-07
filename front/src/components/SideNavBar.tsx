import { Fragment, useEffect } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Grid, Hidden, IconButton, Stack } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { AtpSessionData } from "@atproto/api";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import HomeIcon from '@mui/icons-material/Home';
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
    refreshTimelineFeeds: () => Promise<void>;
}

export const SideNavBar = ({ middleMainContent, refreshTimelineFeeds }: Props) => {
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
                {middleMainContent}

            </Grid>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
                
            }}>
                <Hidden lgDown>
                    <Grid container style={{width: '100%', height: '100vh', backgroundColor: 'blue'}} justifyContent="center">
                        <Stack style={{ width: '70%' }}>
                            {/* <IconButton>
                                <HomeIcon /> <p>Home</p>
                            </IconButton> */}
                            <Button variant="outlined" startIcon={<HomeIcon />} onClick={refreshTimelineFeeds}>
                                <p>Home</p>
                            </Button>
                        </Stack>
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