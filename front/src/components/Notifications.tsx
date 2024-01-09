import { Fragment, useContext, useEffect, useState } from "react";
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
import { NotificationContext } from "../contexts/NotificationProvider";

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
    // bskyNotificationList: AppBskyNotificationListNotifications.Notification[]
    // getListNotifications: () => void;
}

/**
 *
 */
export const Notifications = ({
    isInit,
}: // bskyNotificationList,
// getListNotifications
Props) => {
    // const [notifications, setNotifications] = useState(
    //     [] as ClientNotification[]
    // );

    const { notifications, getListNotifications } =
        useContext(NotificationContext);

    const classes = useStyles();
    const client = BskyClient.getInstance();

    /**
     * memo
     * bskyの通知機能では、listNotifications()で通知一覧を取得後
     * 通知に関係しているfeedの情報をgetPostsでまとめて取得して足りない情報を補完している
     */

    //useEffectで処理を実行
    useEffect(() => {
        if (isInit && notifications.length === 0) {
            getListNotifications();
        }
    }, [isInit]);

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

export default Notifications;
