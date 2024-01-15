import {
    Fragment,
    memo,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import {
    AppBskyFeedDefs,
    AppBskyFeedGetPosts,
    AppBskyNotificationListNotifications,
    AtpSessionData,
    BskyAgent,
    ProfileRecord,
} from "@atproto/api";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import Timeline from "../components/Timeline";
import { Grid, makeStyles } from "@mui/material";
import BskyClient from "../utils/BskyClient";
import PostFeed from "../components/PostFeed";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import {
    Response as TimelineResponse,
    QueryParams,
} from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline";
import { VirtuosoHandle } from "react-virtuoso";
import { RoutePath } from "../routes/Router";
import Notifications from "../components/Notification/Notifications";
import { TimelineContext } from "../contexts/TimelineProvider";
import { NotificationContext } from "../contexts/NotificationProvider";
// import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

export enum FeedAlgorithm {
    ReverseChronological = "reverse-chronological",
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
    const navigate = useNavigate();
    const virtuoso = useRef<VirtuosoHandle>(null);

    const { refreshTimelineFeeds } = useContext(TimelineContext);

    useEffect(() => {
        sessionManage();
    }, []);

    const sessionManage = async () => {
        var isLogin = checkSessionData(cookies?.sessionData);
        if (!isLogin) {
            navigate("/login");
        } else {
            // agent = new BskyAgent({ service: service});
            // await agent.resumeSession(loginData);
            const bskyClient = BskyClient.getInstance();
            bskyClient.init(cookies?.service, cookies?.sessionData);

            // 自分のプロフィールは持っておく
            const loginData = cookies?.sessionData as AtpSessionData;
            bskyClient
                .getMyAvatar(loginData.handle)
                .then((profile) => {
                    setMyProfile(profile);
                })
                .catch((e) => {
                    console.info(e);
                    removeCookie("sessionData");
                    navigate("/login");
                });
        }

        setIsInit(true);
    };

    // 一番上へスクロール
    const virtuosoScrollTop = () => {
        virtuoso.current?.scrollToIndex({
            index: 0,
            align: "center",
            behavior: "smooth",
        });
    };

    const refreshTimelineAndScrolleTop = () => {
        refreshTimelineFeeds();
        virtuosoScrollTop();
    };

    return (
        <SideNavBar
            myProfile={myProfile}
            middleMainContent={
                <Fragment>
                    {path === RoutePath.HOME && (
                        <Timeline
                            virtuosoRef={virtuoso}
                            myProfile={myProfile}
                            isInit={isInit}
                            refreshTimelineAndScrolleTop={
                                refreshTimelineAndScrolleTop
                            }
                        />
                    )}
                    {path === RoutePath.NOTIFICATIONS && (
                        <Notifications
                            isInit={isInit}
                            // bskyNotificationList={bskyNotificationList}
                            // getListNotifications={getListNotifications}
                        />
                    )}
                </Fragment>
            }
            refreshTimelineAndScrolleTop={refreshTimelineAndScrolleTop}
        />
    );
};

export default memo(Home);
