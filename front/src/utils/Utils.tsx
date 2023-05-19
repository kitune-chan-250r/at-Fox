import { BskyAgent, AtpSessionData, AppBskyFeedGetPostThread, AtpAgentOpts } from "@atproto/api";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { SessionData } from "../types/SessionData";
import { XRPCResponse } from '@atproto/xrpc';
import { useCookies } from "react-cookie";

// const Utils = () => {
//     // const [cookies, setCookie, removeCookie] = useCookies();
//     const [cookies] = useCookies();

//     export const checkSessionData = () => {

//     }
// }

// export default Utils;

// export const getTimeline = async(agent:queryParams: QueryParams): Promise<TimelineResponse> => {
//     const result = {} as TimelineResponse;
//     agent.getTimeline(queryParams)
//         .then((res: TimelineResponse) => {
//             return res;
//         })
//         .catch((e) => {
//             console.error(e.error);
//         });

//     return result;
// }

/**
 * cookieを確認して有効なセッションデータが入っているか確認
 * @returns boolean
 */
export const checkSessionData = (sessionData: AtpSessionData):boolean => {
    // console.info(sessionData);
    if (sessionData === undefined) {
        return false;
    }
    return true;
}

/**
 * 指定したfeedにlikeを付ける
 * @returns 
 */
export const sendFeedLike = async(
    service: string,
    sessionData: AtpSessionData,
    uri: string,
    cid: string
) => {
    const agent = await new BskyAgent({ service: service });
    agent.resumeSession(sessionData);

    try {
        const res = await agent.like(uri, cid);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 指定したfeedのlikeを外す
 * @returns 
 */
export const deleteFeedLike = async(
    service: string,
    sessionData: AtpSessionData,
    viewerLikeAt: string,
) => {
    const agent = await new BskyAgent({ service: service });
    agent.resumeSession(sessionData);

    try {
        const res = await agent.deleteLike(viewerLikeAt);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 指定したfeedをrepostする
 * @returns 
 */
export const sendFeedRepost = async(
    service: string,
    sessionData: AtpSessionData,
    uri: string,
    cid: string
) => {
    const agent = await new BskyAgent({ service: service });
    agent.resumeSession(sessionData);

    try {
        const res = await agent.repost(uri, cid);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 指定したfeedのrepostを外す
 * @returns 
 */
export const deleteFeedRepost = async(
    service: string,
    sessionData: AtpSessionData,
    viewerLikeAt: string,
) => {
    const agent = await new BskyAgent({ service: service });
    agent.resumeSession(sessionData);

    try {
        const res = await agent.deleteRepost(viewerLikeAt);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 指定したfeedを取得する(threadごと)
 * @returns 
 */
export const getFeed = async(
    service: string,
    sessionData: AtpSessionData,
    uri: string
    // cid: string
) => {
    const agent = await new BskyAgent({ service: service});
    agent.resumeSession(sessionData);

    const res = await agent.getPostThread({uri: uri}) as AppBskyFeedGetPostThread.Response;
    return res;
}
