import { BskyAgent, AtpSessionData, AppBskyFeedGetPostThread, AtpAgentOpts } from "@atproto/api";
import { Response as TimelineResponse, QueryParams } from "@atproto/api/dist/client/types/app/bsky/feed/getTimeline"
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { SessionData } from "../types/SessionData";
import { XRPCResponse } from '@atproto/xrpc';
import { useCookies } from "react-cookie";

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
 * feedから指定したviewerの要素を取り除く
 * @param feed 
 * @param type 
 * @returns FeedViewPost
 */
export const deleteFeedViewer = (
    feed: FeedViewPost, 
    type: 'like' | 'repost'
): FeedViewPost => {
    if (type === 'like' && feed.post.viewer && feed.post.likeCount) {
        delete feed.post.viewer.like; // プロパティを削除
        feed.post.likeCount -= 1;
    } else if (type === 'repost' && feed.post.viewer && feed.post.repostCount) {
        delete feed.post.viewer.repost;
        feed.post.repostCount -= 1;
    }
    return feed;
}

/**
 * feedから指定したviewerの要素を追加する
 * @param feed 
 * @param type 
 * @returns FeedViewPost
 */
export const addFeedViewer = (
    feed: FeedViewPost, 
    type: 'like' | 'repost',
    uri: string
): FeedViewPost => {
    if (type === 'like' && feed.post.viewer && feed.post.likeCount) {
        feed.post.viewer.like = uri;
        feed.post.likeCount += 1;
    } else if (type === 'repost' && feed.post.viewer && feed.post.repostCount) {
        feed.post.viewer.repost = uri;
        feed.post.repostCount += 1;
    }
    return feed;
}

/**
 * 改行やスペース、タブを受け取った文字列から排除する
 * @param text 改行やスペース、タブを消したい文字列
 * @returns 改行やスペース、タブが消えた文字列
 */
export const deleteWhitespace = (text: string):string => {
    return text.replace(/\s+/g, '');
}
