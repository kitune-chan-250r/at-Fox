import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import { AppBskyFeedDefs, AppBskyFeedGetPosts, AppBskyNotificationListNotifications, AtpSessionData, BskyAgent, ProfileRecord } from "@atproto/api";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import Timeline from "../components/Timeline";
import { Grid, makeStyles } from "@mui/material";
import BskyClient from "../utils/BskyClient";
import PostFeed from "../components/PostFeed";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { VirtuosoHandle } from "react-virtuoso";
import { RoutePath } from "../routes/Router";
import Notifications from "../components/Notifications";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

export enum FeedAlgorithm {
    ReverseChronological = 'reverse-chronological',
}

export interface ClientNotification {
    reasonSubject: AppBskyFeedDefs.PostView | undefined;
    likeOrRepost: AppBskyNotificationListNotifications.Notification[];
    other: AppBskyNotificationListNotifications.Notification;
    indexedAt: string;
}

interface Props {
    path: string;
}

export const Home = ({ path }: Props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isInit, setIsInit] = useState(false);
    const [myProfile, setMyProfile] = useState({} as ProfileResponse);
    const [feeds, setFeeds] = useState([] as FeedViewPost[]);
    const [queryParams, setQueryParams] = useState({ limit: 50 } as QueryParams);
    const [notificationQueryParams, setNotificationQueryParams] = useState({
        limit: 20,
    } as AppBskyNotificationListNotifications.QueryParams);
    const [bskyNotificationList, setBskyNotificationList] = useState(
        [] as AppBskyNotificationListNotifications.Notification[]
    );
    const client = BskyClient.getInstance();
    const navigate = useNavigate();
    const virtuoso = useRef<VirtuosoHandle>(null);

    useEffect(() => {
        sessionManage();
    }, []);

    const sessionManage = async () => {
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
    const getMyTimeline = async () => {
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
    const updateIndexFeed = async (index: number, feed: FeedViewPost) => {
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
    const refreshTimelineFeeds = async () => {
        console.info("refrefhTimelineFeeds");
        navigate(RoutePath.HOME);
        virtuosoScrollTop();
        client.getTimeline({ limit: 50 })
            .then((res: TimelineResponse) => {
                // cursor 更新
                queryParams.cursor = res.data.cursor;
                queryParams.algorithm = FeedAlgorithm.ReverseChronological;
                queryParams.limit = 50;

                // setFeeds([...res.data.feed, ...feeds]);
                // if (feeds !== res.data.feed) setFeeds([...res.data.feed]);
                setFeeds([...res.data.feed]);
                setQueryParams(queryParams);
                console.info(res);
            });
    }

    // 一定時間でこの関数を実行して指定したfeedsをまとめてアップデートする
    const updateTimelineFeeds = async () => {
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

    // 一番上へスクロール
    const virtuosoScrollTop = () => {
        virtuoso.current?.scrollToIndex({
            index: 0,
            align: 'center',
            behavior: 'smooth'
        });
    }

    /**
     * 通知を取得
     */
    const getListNotifications = () => {
        client
            .listNotifications(notificationQueryParams)
            .then((e) => {
                // queryParams.cursor = e.data.cursor; // 一旦除外
                setQueryParams(queryParams);
                setBskyNotificationList(e.data.notifications);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    return (
        <SideNavBar
            myProfile={myProfile}
            middleMainContent={
                <Fragment>
                    {
                        path === RoutePath.HOME &&
                        <Timeline
                            virtuosoRef={virtuoso}
                            myProfile={myProfile}
                            isInit={isInit}
                            feeds={feeds}
                            getMyTimeline={getMyTimeline}
                            updateIndexFeed={updateIndexFeed}
                            refreshTimelineFeeds={refreshTimelineFeeds}
                            updateTimelineFeeds={updateTimelineFeeds}
                        />
                    }
                    {
                        path === RoutePath.NOTIFICATIONS &&
                        <Notifications
                            isInit={isInit}
                            bskyNotificationList={bskyNotificationList}
                            getListNotifications={getListNotifications}
                        />
                    }
                </Fragment>
            }
            refreshTimelineFeeds={refreshTimelineFeeds}
        />
    )
}

export default memo(Home);