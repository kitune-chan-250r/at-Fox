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
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

export enum FeedAlgorithm {
    ReverseChronological = 'reverse-chronological',
}

export const Home = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isInit, setIsInit] = useState(false);
    const [myProfile, setMyProfile] = useState({} as ProfileResponse);
    const [feeds, setFeeds] = useState([] as FeedViewPost[]);
    const [queryParams, setQueryParams] = useState({ limit: 50 } as QueryParams);
    const client = BskyClient.getInstance();
    const navigate = useNavigate();
    // const loginData = cookies.sessionData as AtpSessionData;
    // const service = cookies?.service;
    // var agent: BskyAgent;
    // var agent = new BskyAgent({service: cookies?.service});

    useEffect(() => {
        sessionManage();
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
                    removeCookie('sessionData');
                    navigate('/login');
                });
        }

        setIsInit(true);
    }

    // 初期取得時と下スクロールじに配列の最後にタイムラインを付け足す
    const getMyTimeline = async() => {
        const res = await client.getTimeline(queryParams)
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 50;

                setFeeds([...feeds, ...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
    }

    // feedコンポーネント内から内容を更新する場合に使用
    const updateIndexFeed = async(index: number, feed: FeedViewPost) => {
        console.info(':update feed in local:');
        console.info(feed);
        const updatedFeeds = feeds;
        updatedFeeds[index] = feed;

        setFeeds([...updatedFeeds]);
        
        console.info(updatedFeeds[index])
    }

    /**
     * 現状の挙動として、
     * refreshTimelineFeeds() => feeds配列を最新の50件に置き換え、元データ廃棄
     * getMyTimeline() => queryParams.cursor を元にさかのぼって50件をfeeds配列の後ろに付け足し
     * 
     * 理想の挙動としては、
     * refreshTimelineFeeds() => 現状のfeeds配列の先頭に最新データのみ追加、元データの廃棄は上限までしない
     * getMyTimeline() => そのまま
     */
    const refreshTimelineFeeds = async() => {
        const res = await client.getTimeline({ limit: 50 })
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 50;

                // setFeeds([...res.data.feed, ...feeds]);
                setFeeds([...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
    }

    // 一定時間でこの関数を実行して指定したfeedsをまとめてアップデートする
    const updateTimelineFeeds = async() => {
        const res = await client.getTimeline({ limit: 50 })
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 50;

                setFeeds([...feeds, ...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
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
                    feeds={feeds}
                    getMyTimeline={getMyTimeline}
                    updateIndexFeed={updateIndexFeed}
                    refreshTimelineFeeds={refreshTimelineFeeds}
                    updateTimelineFeeds={updateTimelineFeeds}
                />
            }
            refreshTimelineFeeds={refreshTimelineFeeds}
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