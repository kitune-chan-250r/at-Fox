import { Fragment, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData, getFeed } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { makeStyles } from '@mui/styles';

// atproto
import { BskyAgent, AtpSessionData } from "@atproto/api";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { Virtuoso } from "react-virtuoso";
import Feed from "./Feed";

export enum FeedAlgorithm {
    ReverseChronological = 'reverse-chronological',
}

const useStyles = makeStyles({
    timeline: {
        width: '100%',
        height: '100%',
    }
});

interface Props {
    // agent: BskyAgent;
}

export const Timeline = (props: Props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [agent, setAgent] = useState({} as BskyAgent);
    const [queryParams, setQueryParams] = useState({ limit: 50 } as QueryParams);
    const [feeds, setFeeds] = useState([] as FeedViewPost[]);
    const [isInit, setInit] = useState(false);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        console.info(isInit);
        if (!isInit) {
            getMyTimeline();
            setInit(true);
        }

        // setFeeds([...feeds, ...[{} as FeedViewPost]]);
    }, []);

    const getMyTimeline = async() => {
        console.info('more read');
        const service = cookies?.service;
        if (service === undefined) return;
        
        let tempAgent = agent;

        if (!tempAgent.session) {
            const agent = await new BskyAgent({ service: service });
            agent.resumeSession(cookies?.sessionData);
            setAgent(agent);
            tempAgent = agent;
        }
        // const agent = await new BskyAgent({ service: service });
        // agent.resumeSession(cookies?.sessionData);

        tempAgent.getTimeline(queryParams)
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 30;

                setFeeds([...feeds, ...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
    }
    
    const updateIndexFeed = async(index: number, feed: FeedViewPost) => {
        console.info(':before:');
        console.info(feeds[index]);

        const res =  await getFeed(cookies?.service, cookies?.sessionData, feed.post.uri);
        
        console.info(':recive FeedVieewPost:');
        console.info(res.data.thread);
        const updatedFeeds = feeds;
        updatedFeeds[index] = res.data.thread as FeedViewPost;

        setFeeds([...updatedFeeds]);
    }

    // const result = useMemo(async() => {
    //     // return getMyTimeline();
    //     console.info('more read');
    //     const service = cookies?.service;
    //     if (service === undefined) return;

    //     const agent = await new BskyAgent({ service: service});
    //     agent.resumeSession(cookies?.sessionData);

    //     queryParams.algorithm = FeedAlgorithm.ReverseChronological;
    //     var response = await agent.getTimeline(queryParams) as TimelineResponse;
    //     // cursor 更新
    //     queryParams.cursor = response.data.cursor;

    //     setFeeds([...feeds, ...response.data.feed]);
    //     setQueryParams(queryParams);
    //     console.info(response);
    // }, []);

    // const handleScroll = (event: any) => {
    //     // console.info(event.currentTarget.scrollTop);
    //     // 一番下までスクロールされたら
    //     if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    //         console.log("End");
    //     }
    // }

   
    const loginData = cookies.sessionData as AtpSessionData;

    return(
        <Fragment>
            {/* <div>
                {cookies?.sessionData.did}
            </div> */}
            <Virtuoso
                className={classes.timeline}
                totalCount={feeds.length}
                endReached={getMyTimeline}
                // startReached={getMyTimeline}
                // totalListHeightChanged={getMyTimeline}
                increaseViewportBy={1000}
                reversed={true}
                // overscan={200}
                data={feeds}
                itemContent={
                    (index, data) => (
                    <Feed 
                        index={index} 
                        feed={data} 
                        updateIndexFeed={updateIndexFeed}
                    />)
                }
            />
        </Fragment>    
    )
}

export default Timeline;