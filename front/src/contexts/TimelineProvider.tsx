import {
    BskyAgent,
    AtpSessionData,
    AppBskyFeedGetPostThread,
    AtpAgentOpts,
    AppBskyFeedPost,
    AppBskyFeedGetTimeline,
    ComAtprotoRepoUploadBlob,
    AppBskyNotificationListNotifications,
    AppBskyFeedGetPosts,
} from "@atproto/api";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import {
    Response as TimelineResponse,
    QueryParams,
} from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline";
import { createContext, ReactNode, useMemo, useState } from "react";
import BskyClient from "../utils/BskyClient";

// タイムライン取得クエリに乗せるFeedAlgorithmの定義
export enum FeedAlgorithm {
    ReverseChronological = "reverse-chronological",
}

// インターフェースを定義
export type GetTimeLine = () => Promise<void>;
export type RefreshTimelineFeeds = () => Promise<void>;
export type UpdateIndexFeed = (
    index: number,
    feed: FeedViewPost
) => Promise<void>;

// このコンテキストにて外部に公開する値、メソッドのインターフェース
interface TimelineContextInterface {
    timeline: FeedViewPost[];
    getMyTimeline: GetTimeLine;
    refreshTimelineFeeds: RefreshTimelineFeeds;
    updateIndexFeed: UpdateIndexFeed;
}

// コンテキストを作成
export const TimelineContext = createContext({} as TimelineContextInterface);

export const TimelineProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [queryParams, setQueryParams] = useState({
        limit: 50,
    } as QueryParams);
    const [timeline, setTimeline] = useState([] as FeedViewPost[]);
    const client = BskyClient.getInstance();

    // 初期取得時
    const getMyTimeline = async () => {
        const res = await client
            .getTimeline(queryParams)
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 50;

                setTimeline([...timeline, ...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
    };

    // feedコンポーネント内から内容を更新する場合に使用
    const updateIndexFeed = async (index: number, feed: FeedViewPost) => {
        console.info(":update feed in local:");
        console.info(feed);
        const updatedFeeds = timeline;
        updatedFeeds[index] = feed;

        setTimeline([...updatedFeeds]);

        console.info(updatedFeeds[index]);
    };

    /**
     * 現状の挙動として、
     * refreshTimelineFeeds() => feeds配列を最新の50件に置き換え、元データ廃棄
     * getMyTimeline() => queryParams.cursor を元にさかのぼって50件をfeeds配列の後ろに付け足し
     *
     * 理想の挙動としては、
     * refreshTimelineFeeds() => 現状のfeeds配列の先頭に最新データのみ追加、元データの廃棄は上限までしない
     * getMyTimeline() => そのまま
     */
    const refreshTimelineFeeds = async () => {
        console.info("refrefhTimelineFeeds");
        // navigate(RoutePath.HOME);
        // virtuosoScrollTop();
        client.getTimeline({ limit: 50 }).then((res: TimelineResponse) => {
            // cursor 更新
            queryParams.cursor = res.data.cursor;
            queryParams.algorithm = FeedAlgorithm.ReverseChronological;
            queryParams.limit = 50;

            // setFeeds([...res.data.feed, ...feeds]);
            // if (feeds !== res.data.feed) setFeeds([...res.data.feed]);
            setTimeline([...res.data.feed]);
            setQueryParams(queryParams);
            console.info(res);
        });
    };

    // providerで公開する値はメモ化しておく
    const provider = useMemo(
        (): TimelineContextInterface => ({
            timeline,
            getMyTimeline,
            refreshTimelineFeeds,
            updateIndexFeed,
        }),
        [timeline, getMyTimeline, refreshTimelineFeeds, updateIndexFeed]
    );

    return (
        <TimelineContext.Provider value={provider}>
            {children}
        </TimelineContext.Provider>
    );
};
