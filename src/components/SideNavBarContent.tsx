import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import { AtpSessionData, BskyAgent } from "@atproto/api";
import Timeline from "../components/Timeline";
import { Grid } from "@mui/material";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';


export const SideNavBarContent = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();
    // const loginData = cookies.sessionData as AtpSessionData;
    // const service = cookies?.service;
    // var agent: BskyAgent;
    // var agent = new BskyAgent({service: cookies?.service});

    useEffect(() => {
        sessionManage();
        
        // }
    }, []);

    const sessionManage = async() => {
        var isLogin = checkSessionData(cookies?.sessionData);
        if (!isLogin) {
            navigate('/login');
        } else {
            // agent = new BskyAgent({ service: service});
            // await agent.resumeSession(loginData);
        }
    }
   
    return(
        <Grid container >

        </Grid>
    )
}

export default SideNavBarContent;