import { AppBskyActorDefs } from "@atproto/api";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { Box, Stack, Avatar, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FeedEmbedContent from "../FeedEmbedContent";

const useStyles = makeStyles({
    feedContainer: {
        maxWidth: 600,
        // width: 600,
        backgroundColor: "black",
        // overflow: 'visible',
        color: "white",
        margin: "auto",
        marginBottom: 4,
        // border: '1px',
    },
    feedLeftArea: {
        // width: '100%',
        minWidth: 70,
        // height: '100%',
        backgroundColor: "green",
        // wisth: 55,
        maxWidth: 55,
        // display: 'flex',
        // justifyContent: 'center',
    },
    feedRightArea: {
        backgroundColor: "gray",
        margin: 6,
        // overflow: 'visible',
        height: "100%",
    },
    feedContent: {},
    avatar: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto",
        minWidth: 35,
        maxWidth: 55,
    },
    userName: {
        fontWeight: "bold",
        fontSize: 14,
        padding: 4,
    },
    screenName: {
        // fontSize: 9,
        // color: 'gray'
    },
    utilArea: {
        margin: 5,
        width: "100%",
        // justifyContent: 'center',
    },
    iconText: {
        color: "white",
    },
});

interface Props {
    view: PostView;
}

export const NotificationSummaryFeed = ({ view }: Props) => {
    const classes = useStyles();
    console.info(view);
    return (
        <Box className={classes.feedContainer}>
            <Stack direction={"row"}>
                <Box className={classes.feedLeftArea}>
                    <Avatar
                        className={classes.avatar}
                        // src={props.feed.post?.author.avatar}
                        src={view.author.avatar}
                        sx={{ width: 52, height: 52 }}
                    >
                        N
                    </Avatar>
                </Box>
                <Grid
                    className={classes.feedRightArea}
                    container
                    direction={"column"}
                >
                    {/* この領域に誰がrepostしたか とりまdisplyaNameだけ表示だけどアイコンか何か表示したい*/}
                    {/* {feed?.reason?.$type ===
                        "app.bsky.feed.defs#reasonRepost" && (
                        <a>
                            reposted by{" "}
                            {
                                (
                                    feed.reason
                                        .by as AppBskyActorDefs.ProfileViewBasic
                                ).displayName
                            }
                        </a>
                    )} */}
                    <Grid style={{ width: "100%" }} item xs={1}>
                        {/* ユーザー名、handle、右端に経過時間、 */}
                        <Box className={classes.userName}>
                            {view.author.displayName}
                            <a className={classes.screenName}>
                                @{view.author.handle}
                            </a>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={10}
                        style={{
                            maxWidth: "100%",
                            overflowWrap: "break-word",
                        }}
                    >
                        {(view.record as Record)?.text !== undefined
                            ? (view.record as Record).text.split("\n").map(
                                  // (e, index)=> <div key={index}>{e}<br/></div>
                                  (e, index) => (
                                      <div key={index}>
                                          {e}
                                          <br />
                                      </div>
                                  )
                              )
                            : ""}
                        {/* <FeedEmbedContent content={feed.post.embed}/> */}
                    </Grid>
                    {/* <Grid item xs={1}> */}
                    {/* RT数とか ふぁぼは絶対に☆アイコン */}
                    {/* {buttonsMemo} */}
                </Grid>
                {/* </Grid> */}
            </Stack>
        </Box>
    );
};
