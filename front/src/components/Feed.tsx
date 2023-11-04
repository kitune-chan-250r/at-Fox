import { Fragment, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { addFeedViewer, checkSessionData, deleteFeedViewer } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Grid, IconButton, Stack } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { XRPCResponse } from '@atproto/xrpc';
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
// import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post/get";
import { BskyAgent, AtpSessionEvent, AtpSessionData, AppBskyActorDefs } from '@atproto/api';
import BskyClient from "../utils/BskyClient";

// icons
import StarIcon from '@mui/icons-material/Star';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FeedEmbedContent from "./FeedEmbedContent";

const useStyles = makeStyles({
    feedContainer: {
        maxWidth: 600,
        // width: 600,
        backgroundColor: 'black',
        // overflow: 'visible',
        color: 'white',
        margin: 'auto',
        marginBottom: 4,
        // border: '1px',
    },
    feedLeftArea: {
        // width: '100%',
        minWidth: 70,
        // height: '100%',
        backgroundColor: 'green',
        // wisth: 55,
        maxWidth:55,
        // display: 'flex',
        // justifyContent: 'center',
    },
    feedRightArea: {
        backgroundColor: 'gray',
        margin: 6,
        // overflow: 'visible',
        height: '100%',
    },
    feedContent: {
    
    },
    avatar: {
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        minWidth:35,
        maxWidth:55,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        padding: 4,
    },
    screenName: {
        // fontSize: 9,
        // color: 'gray'
    },
    utilArea: {
        margin: 5,
        width: '100%',
        // justifyContent: 'center',
    },
    iconText: {
        color: 'white',
    }
});

interface Props {
    index: number;
    feed: FeedViewPost;
    updateIndexFeed: (index: number, feed: FeedViewPost) => void;
}

export const Feed = ({index, feed, updateIndexFeed}: Props) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [liked, setLiked] = useState(false);
    const [reposted, setReposted] = useState(false);
    const client = BskyClient.getInstance();
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        feed.post.viewer?.like ? setLiked(true) : setLiked(false);
        feed.post.viewer?.repost ? setReposted(true) : setReposted(false);
        // console.info('updated');
        // console.info(feed);
    }, [feed.post.viewer?.like, feed.post.viewer?.repost]);



    // feedの中にrecordを内包するみたいな仕組みにした方がいいかも？
    // 一定時間ごとに指定した範囲のfeedをgetpostsで取得して内容を更新していく
    // 連打でfeed.post.viewer?.likeがundefinedになる理由は実行されるまで内容が作られていないから
    // sendrepost,sendlike の戻り値uriはdelete~の引数になる
   
    const loginData = cookies.sessionData as SessionData;

    // 
    const handleClickFeedLike = async() => {
        var tempFeed = feed;

        if (feed.post.viewer?.like) { // すでにlikeしている場合(ホントはviewer.likeのat://did:plc の中身を自分のdidを見比べたほうがいい？)
            console.info('send un like');
            client.deleteFeedLike(feed.post.viewer?.like as string)
                .then((e) => {
                    tempFeed = deleteFeedViewer(feed, 'like');
                    updateIndexFeed(index, tempFeed);
                    setLiked(false);
                })
                .catch((error) => {
                    console.error(error);
                });
            // updateFeed();
        } else { // likeしていない場合
            console.info('send like');
            client.sendFeedLike(feed.post.uri, feed.post.cid)
                .then((e) => {
                    tempFeed = addFeedViewer(feed, 'like', e.uri);
                    updateIndexFeed(index, tempFeed);
                    setLiked(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        } 
    }

    const handleClickFeedRepost = async() => {
        var tempFeed = feed;

        if (feed.post.viewer?.repost) {
            client.deleteFeedRepost(feed.post.viewer?.repost as string)
                .then(() => {
                    tempFeed = deleteFeedViewer(feed, 'repost');
                    updateIndexFeed(index, tempFeed);
                    setReposted(false);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            client.sendFeedRepost(feed.post.uri, feed.post.cid)
                .then((e) => {
                    tempFeed = addFeedViewer(feed, 'repost', e.uri);
                    updateIndexFeed(index, tempFeed);
                    setReposted(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    // const handleup = () => {
    //     updateIndexFeed(index, feed);
    // }

    // const record = props.feed.post.record as Record; "at://did:plc:p2b7kmnd37qcekcz5i6a6uls/app.bsky.feed.like/3jvri7vbli62f"
    const buttonsMemo = useMemo(() => {
        return (
            <Grid container alignItems='center' justifyContent='center'>
                <Grid item xs={3}>
                    <div>
                        <Stack className={classes.utilArea} direction={'row'} spacing={1} >
                            <ChatBubbleIcon htmlColor="white"/>
                            <a className={classes.iconText}>{feed.post?.replyCount}</a>
                        </Stack>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div onClick={handleClickFeedRepost}>
                        <Stack className={classes.utilArea} direction={'row'} spacing={1}>
                            { reposted ? <RepeatIcon htmlColor="green" /> : <RepeatIcon /> }
                            <a className={classes.iconText}>
                                {/* { isReposted && !feed.post.viewer?.repost ? (feed.post?.repostCount as number) + 1 : feed.post?.repostCount} */}
                                {feed.post?.repostCount}
                            </a>
                        </Stack>
                    </div>
                </Grid>
                <Grid item xs={3}> 
                    <div onClick={handleClickFeedLike}>
                        <Stack className={classes.utilArea} direction={'row'} spacing={1}>
                            { liked ? <StarIcon htmlColor="yellow" /> : <StarIcon />}
                            <a className={classes.iconText}>
                                {feed.post?.likeCount}
                            </a>
                        </Stack>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div>
                        <MoreHorizIcon />
                    </div>
                </Grid>
            </Grid>
        )
    }, [feed, feed.post.viewer?.like, feed.post.viewer?.repost, feed.post?.repostCount, feed.post?.likeCount, liked, reposted]);


    const feedMemo = useMemo(() => {
        return (
            <Box key={index} className={classes.feedContainer}>
                <Stack direction={'row'} key={index}>
                    <Box className={classes.feedLeftArea}>
                        <Avatar
                            className={classes.avatar}
                            // src={props.feed.post?.author.avatar}
                            src={feed.post?.author.avatar}
                            sx={{ width: 52, height: 52 }}
                        >
                            N
                        </Avatar>
                    </Box>
                    <Grid className={classes.feedRightArea} container direction={'column'}>
                        {/* この領域に誰がrepostしたか とりまdisplyaNameだけ表示だけどアイコンか何か表示したい*/}
                        { feed?.reason?.$type ===  'app.bsky.feed.defs#reasonRepost' &&
                            <a>reposted by {(feed.reason.by as AppBskyActorDefs.ProfileViewBasic).displayName}</a>
                        }
                        <Grid style={{ width: '100%' }} item xs={1}>
                            {/* ユーザー名、handle、右端に経過時間、 */}
                            <Box className={classes.userName}>
                                {feed.post?.author.displayName}
                                <a className={classes.screenName}>
                                    @{feed.post?.author.handle}
                                </a>{' ' + index}
                            </Box>
                        </Grid>
                        <Grid item xs={10} style={{maxWidth: '100%', overflowWrap: 'break-word'}}>
                            {
                                (feed.post?.record as Record)?.text !== undefined ?
                                (feed.post?.record as Record).text.split('\n').map(
                                    // (e, index)=> <div key={index}>{e}<br/></div>
                                    (e, index)=> <div key={index}>{e}<br/></div>
                                )
                                    : ''
                            }
                            {/* <FeedEmbedContent content={feed.post.embed}/> */}
                        </Grid>
                        <FeedEmbedContent content={feed.post.embed}/>
                        {/* <Grid item xs={1}> */}
                            {/* RT数とか ふぁぼは絶対に☆アイコン */}
                        {buttonsMemo}
                    </Grid>
                    {/* </Grid> */}
                </Stack>
            </Box>
        )
    }, [feed, feed.post.viewer?.like, feed.post.viewer?.repost, liked, reposted]);

    return(
        <Fragment>
           {feedMemo} 
        </Fragment>
    )
}

export default Feed;