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
// import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
// import { Record as AppBskyFeedPost } from '@atproto/api/dist/client/types/app/bsky/feed/post';
import { SessionData } from "../types/SessionData";
import { XRPCResponse } from "@atproto/xrpc";
import { useCookies } from "react-cookie";

export default class BskyClient {
    // シングルトンのインスタンスを作ってagentが持つ認証情報を管理する
    private static _instance: BskyClient;
    private static _agent: BskyAgent;
    private isInit = false;

    private constructor() {}

    public static getInstance(): BskyClient {
        if (!BskyClient._instance) {
            this._instance = new BskyClient();
        }

        return BskyClient._instance;
    }

    public init(service: string, session: AtpSessionData) {
        BskyClient._agent = new BskyAgent({ service: service });
        BskyClient._agent.resumeSession(session).catch((e) => {
            console.info("(!) resume session error!");
            console.info("service: " + service);
            console.info("session: " + JSON.stringify(session));
        });

        console.info("(!) client init compleated.");
    }

    public getMyAvatar(handle: string): Promise<ProfileResponse> {
        return BskyClient._agent.getProfile({ actor: handle });
    }

    public getTimeline = async (
        params: AppBskyFeedGetTimeline.QueryParams
    ): Promise<AppBskyFeedGetTimeline.Response> => {
        return BskyClient._agent.getTimeline(params);
    };

    /**
     * 自身のセッション情報を返す
     * @returns セッション情報
     */
    public getSession = (): AtpSessionData | undefined => {
        return BskyClient._agent.session;
    };

    /**
     * 指定したfeedにlikeを付ける
     * @returns
     */
    public sendFeedLike = async (
        uri: string,
        cid: string
    ): Promise<{ uri: string; cid: string }> => {
        return BskyClient._agent.like(uri, cid);
    };

    /**
     * 指定したfeedのlikeを外す
     * @returns
     */
    public deleteFeedLike = async (viewerLikeAt: string) => {
        return BskyClient._agent.deleteLike(viewerLikeAt);
    };

    /**
     * 指定したfeedをrepostする
     * @returns
     */
    public sendFeedRepost = async (
        uri: string,
        cid: string
    ): Promise<{ uri: string; cid: string }> => {
        return BskyClient._agent.repost(uri, cid);
    };

    /**
     * 指定したfeedのrepostを外す
     * @returns
     */
    public deleteFeedRepost = async (viewerLikeAt: string) => {
        return BskyClient._agent.deleteRepost(viewerLikeAt);
    };

    /**
     * 指定したfeedを取得する(threadごと)
     * @returns
     */
    public getFeed = async (
        uri: string
    ): Promise<AppBskyFeedGetPostThread.Response> => {
        return BskyClient._agent.getPostThread({ uri: uri });
    };

    /**
     * feedをポストする
     * @returns
     */
    public postFeed = async (
        post: AppBskyFeedPost.Record
    ): Promise<{ uri: string; cid: string }> => {
        return BskyClient._agent.post(post);
    };

    /**
     * 画像などのコンテンツをアップロードする
     * feedにはembedコンテンツに戻り値を含む？
     * @returns
     */
    public uploadBlob = async (
        blob: ComAtprotoRepoUploadBlob.InputSchema,
        opts?: ComAtprotoRepoUploadBlob.CallOptions
    ): Promise<ComAtprotoRepoUploadBlob.Response> => {
        return BskyClient._agent.uploadBlob(blob, opts);
    };

    /**
     * 通知を取得する
     */
    public listNotifications = async (
        params: AppBskyNotificationListNotifications.QueryParams,
        opts?: AppBskyNotificationListNotifications.CallOptions
    ): Promise<AppBskyNotificationListNotifications.Response> => {
        return BskyClient._agent.listNotifications(params, opts);
    };

    /**
     * feedをまとめて取得する
     */
    public getFeeds = async (
        params: AppBskyFeedGetPosts.QueryParams
    ): Promise<AppBskyFeedGetPosts.Response> => {
        return BskyClient._agent.getPosts(params);
    };
}
