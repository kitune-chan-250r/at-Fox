import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { makeStyles } from '@mui/styles';
import styled from '@emotion/styled'

// atproto
import { BskyAgent, AtpSessionData } from "@atproto/api";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import { Virtuoso } from "react-virtuoso";
import Feed from "./Feed";
import BskyClient from "../utils/BskyClient";
import PostFeed from "./PostFeed";

// export enum FeedAlgorithm {
//     ReverseChronological = 'reverse-chronological',
// }

const useStyles = makeStyles({
    timeline: {
        width: '100%',
        height: '100%',
        "@media (min-width:1280px)": {
            marginLeft: 15,
        },
    }
});

interface Props {
    virtuosoRef: any;
    isInit: boolean;
    myProfile: ProfileResponse;
    feeds: FeedViewPost[];
    getMyTimeline: () => Promise<void>;
    updateIndexFeed: (index: number, feed: FeedViewPost) => Promise<void>;
    refreshTimelineFeeds: () => Promise<void>;
    updateTimelineFeeds: () => Promise<void>;
}

export const Timeline = ({
    virtuosoRef,
    isInit,
    myProfile,
    feeds,
    getMyTimeline,
    updateIndexFeed,
    refreshTimelineFeeds,
    updateTimelineFeeds,
}: Props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    // const [agent, setAgent] = useState({} as BskyAgent);
    // const [queryParams, setQueryParams] = useState({ limit: 50 } as QueryParams);
    // const [feeds, setFeeds] = useState([] as FeedViewPost[]);
    // const client = BskyClient.getInstance();
    // const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        if (isInit && feeds.length === 0) {
            console.info("getMyTimeline");
            getMyTimeline();
            // refreshTimelineFeeds();
        }
    }, [isInit]);

    // 初期取得時と下スクロールじに配列の最後にタイムラインを付け足す
    // const getMyTimeline = async() => {
    //     const res = await client.getTimeline(queryParams)
    //         .then((res: TimelineResponse) => {
    //             // cursor 更新
    //             queryParams.cursor = res.data.cursor;
    //             queryParams.algorithm = FeedAlgorithm.ReverseChronological;
    //             queryParams.limit = 50;

    //             setFeeds([...feeds, ...res.data.feed]);
    //             setQueryParams(queryParams);
    //             console.info(res);
    //         });
    // }

    // feedコンポーネント内から内容を更新する場合に使用
    // const updateIndexFeed = async(index: number, feed: FeedViewPost) => {
    //     console.info(':update feed in local:');
    //     console.info(feed);
    //     const updatedFeeds = feeds;
    //     updatedFeeds[index] = feed;

    //     setFeeds([...updatedFeeds]);

    //     console.info(updatedFeeds[index])
    // }

    // 最新を配列の先頭に付け足す
    /**
     * 現状の挙動として、
     * refreshTimelineFeeds() => feeds配列を最新の50件に置き換え、元データ廃棄
     * getMyTimeline() => queryParams.cursor を元にさかのぼって50件をfeeds配列の後ろに付け足し
     * 
     * 理想の挙動としては、
     * refreshTimelineFeeds() => 現状のfeeds配列の先頭に最新データのみ追加、元データの廃棄は上限までしない
     * getMyTimeline() => そのまま
     */
    // const refreshTimelineFeeds = async() => {
    //     const res = await client.getTimeline({ limit: 50 })
    //         .then((res: TimelineResponse) => {
    //             // cursor 更新
    //             queryParams.cursor = res.data.cursor;
    //             queryParams.algorithm = FeedAlgorithm.ReverseChronological;
    //             queryParams.limit = 50;

    //             // setFeeds([...res.data.feed, ...feeds]);
    //             setFeeds([...res.data.feed]);
    //             setQueryParams(queryParams);
    //             console.info(res);
    //         });
    // }

    // 一定時間でこの関数を実行して指定したfeedsをまとめてアップデートする
    // const updateTimelineFeeds = async() => {
    //     const res = await client.getTimeline({ limit: 50 })
    //         .then((res: TimelineResponse) => {
    //             // cursor 更新
    //             queryParams.cursor = res.data.cursor;
    //             queryParams.algorithm = FeedAlgorithm.ReverseChronological;
    //             queryParams.limit = 50;

    //             setFeeds([...feeds, ...res.data.feed]);
    //             setQueryParams(queryParams);
    //             console.info(res);
    //         });
    // }

    const loginData = cookies.sessionData as AtpSessionData;

    const List = styled.div`width: 100vw;`
    return (
        <Fragment>
            {/* <div>
                {cookies?.sessionData.did}
            </div> */}
            {/* <PostFeed myProfile={myProfile} /> */}
            <Virtuoso
                className={classes.timeline}
                ref={virtuosoRef}
                totalCount={feeds.length}
                endReached={getMyTimeline}
                // startReached={getMyTimeline}
                // totalListHeightChanged={getMyTimeline}
                increaseViewportBy={1000}
                reversed={true}
                // overscan={200}
                data={feeds}
                components={{
                    Header: () => <PostFeed myProfile={myProfile} refreshTimelineFeeds={refreshTimelineFeeds} />,
                }}
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

export default memo(Timeline);