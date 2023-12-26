import { Fragment, memo, useEffect, useState } from "react";
import {
    AppBskyNotificationListNotifications,
    AppBskyFeedDefs,
    AppBskyFeedGetPosts,
} from "@atproto/api";
import FeedEmbedImage from "./FeedEmbedImage";
import { makeStyles } from "@mui/styles";
import BskyClient from "../utils/BskyClient";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
} from "@mui/material";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import Notification from "./Notification";

const useStyles = makeStyles({
    timelineContainer: {
        maxWidth: "100%",
        overflowY: "scroll",
        height: "100%",
        "@media (min-width:1280px)": {
            marginLeft: 15,
        },
    },
    timeline: {
        maxWidth: 600,
    },
});

export interface ClientNotification {
    reasonSubject: AppBskyFeedDefs.PostView | undefined;
    likeOrRepost: AppBskyNotificationListNotifications.Notification[];
    other: AppBskyNotificationListNotifications.Notification;
    indexedAt: string;
}

interface Props {
    isInit: boolean;
    bskyNotificationList: AppBskyNotificationListNotifications.Notification[]
    getListNotifications: () => void;
}

/**
 *
 */
export const Notifications = ({
    isInit,
    bskyNotificationList,
    getListNotifications
}: Props) => {
    const [notifications, setNotifications] = useState(
        [] as ClientNotification[]
    );

    const classes = useStyles();
    const client = BskyClient.getInstance();

    /**
     * memo
     * bskyの通知機能では、listNotifications()で通知一覧を取得後
     * 通知に関係しているfeedの情報をgetPostsでまとめて取得して足りない情報を補完している
     */

    //useEffectで処理を実行
    useEffect(() => {
        if (isInit) {
            getListNotifications();
        }
    }, [isInit]);

    useEffect(() => {
        if (bskyNotificationList.length !== 0) {
            reGroupNotifications();
        }
    }, [bskyNotificationList]);

    /**
     * APIから返される通知の形式からクライアントで表示するコンポーネント
     * で扱いやすい形式に変換する
     */
    const reGroupNotifications = async () => {
        // like, repostなどのreasonSubjectがある通知をまとめて
        // 後からまとめてfeedの内容を取得するための重複のないリストを作成する
        let reasonSubjectList = Array.from(
            new Set(
                bskyNotificationList
                    .filter(
                        (notification) =>
                            notification.reasonSubject != undefined
                    )
                    .map((notification) => notification.reasonSubject as string)
            ).values()
        );

        let reasonSubjectQueryParams = {} as AppBskyFeedGetPosts.QueryParams;
        reasonSubjectQueryParams.uris = reasonSubjectList;

        // まとめてfeedの内容を取得
        let reasonSubjectRecords = await client.getFeeds(
            reasonSubjectQueryParams
        );

        let clientNotificationList = [] as ClientNotification[];

        // reasonSubjectごとにグループ化した通知をリストに入れる
        reasonSubjectList.forEach((reasonSubject) => {
            let clientNotification = {} as ClientNotification;
            clientNotification.reasonSubject =
                reasonSubjectRecords.data.posts.find(
                    (feed) => feed.uri === reasonSubject
                );
            clientNotification.likeOrRepost = bskyNotificationList.filter(
                (notifications) => notifications.reasonSubject === reasonSubject
            );
            clientNotification.indexedAt =
                clientNotification.likeOrRepost[0].indexedAt;
            clientNotificationList.push(clientNotification);
        });

        // followなどのreasonSubjectがない通知を整形してリストに入れる
        bskyNotificationList
            .filter((notification) => notification.reasonSubject == undefined)
            .forEach((notification) => {
                let clientNotification = {} as ClientNotification;
                clientNotification.other = notification;
                clientNotification.indexedAt = notification.indexedAt;
                clientNotificationList.push(clientNotification);
            });

        // ただ通知を詰めただけのリストの状態だと
        // 時間がめちゃくちゃなのでindexedAtでソートを行う
        clientNotificationList.sort(
            (a, b) =>
                new Date(b.indexedAt).getTime() -
                new Date(a.indexedAt).getTime()
        );

        // console.info(clientNotificationList);
        setNotifications(clientNotificationList);
    };

    return (
        <Fragment>
            <Grid
                className={classes.timelineContainer}
                container
                justifyContent="center"
            >
                <Timeline
                    className={classes.timeline}
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 0,
                        },
                    }}
                >
                    {notifications.map((notification, index) => (
                        <Notification
                            index={index}
                            clientNotification={notification}
                        />
                    ))}
                </Timeline>
            </Grid>
        </Fragment>
    );
};

export default memo(Notifications);
