import { Fragment, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { SessionData } from "../types/SessionData";
import { checkSessionData, deleteFeedLike, deleteFeedRepost, getFeed, sendFeedLike, sendFeedRepost } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Grid, IconButton, Stack } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { XRPCResponse } from '@atproto/xrpc';
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
// import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post/get";
import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';

// icons
import StarIcon from '@mui/icons-material/Star';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
        overflow: 'visible',
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
    const [isLiked, setLiked] = useState(false);
    const [isReposted, setReposted] = useState(false);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        feed.post.viewer?.like ? setLiked(true) : setLiked(false);
        feed.post.viewer?.repost ? setReposted(true) : setReposted(false);
    }, []);



    // feedの中にrecordを内包するみたいな仕組みにした方がいいかも？
   
    const loginData = cookies.sessionData as SessionData;

    // 
    const handleClickFeedLike = async() => {
        setLiked(!isLiked);

        if (isLiked) { // すでにlikeしている場合(ホントはviewer.likeのat://did:plc の中身を自分のdidを見比べたほうがいい？)
            console.info('send un like');
            await deleteFeedLike(cookies?.service, cookies?.sessionData, feed.post.viewer?.like as string);
            // updateFeed();
        } else { // likeしていない場合
            console.info('send like');
            await sendFeedLike(cookies?.service, cookies?.sessionData, feed.post.uri, feed.post.cid);
        } 

        updateIndexFeed(index, feed);
    }

    const handleClickFeedRepost = async() => {
        setReposted(!isReposted);
        if (isReposted) {
            await deleteFeedRepost(cookies?.service, cookies?.sessionData, feed.post.viewer?.repost as string);
        } else {
            await sendFeedRepost(cookies?.service, cookies?.sessionData, feed.post.uri, feed.post.cid);
        }

        updateIndexFeed(index, feed);
    }

    // const handleup = () => {
    //     updateIndexFeed(index, feed);
    // }

    // const record = props.feed.post.record as Record; "at://did:plc:p2b7kmnd37qcekcz5i6a6uls/app.bsky.feed.like/3jvri7vbli62f"

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
                        {/* この領域に誰がrepostしたか */}
                        <Grid style={{ width: '100%' }} item xs={1}>
                            {/* ユーザー名、handle、右端に経過時間、 */}
                            <Box className={classes.userName}>
                                {feed.post?.author.displayName}
                                <a className={classes.screenName}>
                                    @{feed.post?.author.handle}
                                </a>{' ' + index}
                            </Box>
                        </Grid>
                        <Grid item xs={10}>
                            {
                                (feed.post?.record as Record)?.text !== undefined ?
                                (feed.post?.record as Record).text.split('\n').map(
                                    // (e, index)=> <div key={index}>{e}<br/></div>
                                    (e, index)=> <div key={index}>{e}<br/></div>
                                )
                                    : ''
                            }
                        </Grid>
                        {/* <Grid item xs={1}> */}
                            {/* RT数とか ふぁぼは絶対に☆アイコン */}
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
                                            { isReposted ? <RepeatIcon htmlColor="green" /> : <RepeatIcon /> }
                                            <a className={classes.iconText}>
                                                { isReposted && !feed.post.viewer?.repost ? (feed.post?.repostCount as number) + 1 : feed.post?.repostCount}
                                            </a>
                                        </Stack>
                                    </div>
                                </Grid>
                                <Grid item xs={3}> 
                                    <div onClick={handleClickFeedLike}>
                                        <Stack className={classes.utilArea} direction={'row'} spacing={1}>
                                            { isLiked ? <StarIcon htmlColor="yellow" /> : <StarIcon />}
                                            <a className={classes.iconText}>
                                                { isLiked && !feed.post.viewer?.like ? (feed.post?.likeCount as number) + 1 : feed.post?.likeCount}
                                            </a>
                                        </Stack>
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                
                                    {/* <Stack  className={classes.utilArea} direction={'row'} spacing={1}> */}
                                        <div>
                                            <MoreHorizIcon />
                                        </div>
                                    {/* </Stack> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    {/* </Grid> */}
                </Stack>
            </Box>
        )
    }, [feed, isLiked, isReposted]);

    return(
        <Fragment>
           {feedMemo} 
        </Fragment>
    )
}

export default Feed;