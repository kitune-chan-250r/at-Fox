import {
    AppBskyNotificationListNotifications,
    AppBskyFeedDefs,
    AppBskyFeedGetPosts,
} from "@atproto/api";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import BskyClient from "../utils/BskyClient";

// クライアント内で扱う通知のインターフェース
export interface ClientNotification {
    reasonSubject: AppBskyFeedDefs.PostView | undefined;
    likeOrRepost: AppBskyNotificationListNotifications.Notification[];
    other: AppBskyNotificationListNotifications.Notification;
    indexedAt: string;
}

export type GetListNotifications = () => Promise<void>;

interface NotificationContextInterface {
    notifications: ClientNotification[];
    getListNotifications: GetListNotifications;
}

export const NotificationContext = createContext(
    {} as NotificationContextInterface
);

export const NotificationProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [notifications, setNotifications] = useState(
        [] as ClientNotification[]
    );
    const [notificationQueryParams, setNotificationQueryParams] = useState({
        limit: 20,
    } as AppBskyNotificationListNotifications.QueryParams);
    // const [bskyNotificationList, setBskyNotificationList] = useState(
    //     [] as AppBskyNotificationListNotifications.Notification[]
    // );
    const client = BskyClient.getInstance();

    // useEffect(() => {
    //     if (bskyNotificationList.length !== 0) {
    //         reGroupNotifications();
    //     }
    // }, [bskyNotificationList]);

    /**
     * 通知を取得
     */
    const getListNotifications = async () => {
        console.info("get notification list");
        client
            .listNotifications(notificationQueryParams)
            .then((e) => {
                // queryParams.cursor = e.data.cursor; // 一旦除外
                setNotificationQueryParams(notificationQueryParams);
                // setBskyNotificationList(e.data.notifications);
                reGroupNotifications(e.data.notifications);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    /**
     * APIから返される通知の形式からクライアントで表示するコンポーネント
     * で扱いやすい形式に変換する
     */
    const reGroupNotifications = async (
        bskyNotificationList: AppBskyNotificationListNotifications.Notification[]
    ) => {
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

        setNotifications(clientNotificationList);
    };

    const provider = useMemo(
        (): NotificationContextInterface => ({
            notifications,
            getListNotifications,
        }),
        [notifications]
    );

    return (
        <NotificationContext.Provider value={provider}>
            {children}
        </NotificationContext.Provider>
    );
};
