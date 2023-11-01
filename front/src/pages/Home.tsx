import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import { AtpSessionData, BskyAgent, ProfileRecord } from "@atproto/api";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import Timeline from "../components/Timeline";
import { Grid, makeStyles } from "@mui/material";
import BskyClient from "../utils/BskyClient";
import PostFeed from "../components/PostFeed";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

export const Home = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isInit, setIsInit] = useState(false);
    const [myProfile, setMyProfile] = useState({} as ProfileResponse);
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
            const bskyClient = BskyClient.getInstance();
            bskyClient.init(cookies?.service, cookies?.sessionData);
            
            // 自分のプロフィールは持っておく
            const loginData = cookies?.sessionData as AtpSessionData;
            bskyClient.getMyAvatar(loginData.handle)
                .then(profile => {
                    setMyProfile(profile);
                })
                .catch(e => {
                    console.info(e);
                });
        }

        setIsInit(true);
    }
   
    return(
        // <div>
        //     did: { loginData?.did }
        // </div>
        <SideNavBar 
            myProfile={myProfile}
            middleMainContent={
                <Timeline 
                    myProfile={myProfile} 
                    isInit={isInit} 
                />
            }
            // middleSubContent={
            //     <PostFeed />
            // }
        />
        
        // <Grid container alignItems="center" justifyContent="center" style={{ height: '100vh', backgroundColor: 'blue' , maxWidth: 600}}>
        //     <Timeline isInit={isInit} />
        // </Grid>
    )
}

export default Home;