import { Avatar, Box, Grid, IconButton, Stack, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import BskyClient from "../utils/BskyClient";
import { deleteWhitespace } from "../utils/Utils";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import CustomedCircularProgress from "./CustomedCircularProgress";
import { AppBskyFeedPost, ComAtprotoRepoUploadBlob } from "@atproto/api";

// icons
import SendIcon from "@mui/icons-material/Send";
import { MyProfileContext } from "../contexts/MyProfileProvider";

const useStyles = makeStyles({
    main: {
        width: "100%",
        height: "100%",
    },
    feedContainer: {
        maxWidth: 600,
        // width: 600,
        backgroundColor: "black",
        // overflow: 'visible',
        color: "white",
        margin: "auto",
        marginBottom: 4,
    },
    feedLeftArea: {
        minWidth: 70,
        backgroundColor: "green",
        maxWidth: 55,
    },
    feedRightArea: {
        backgroundColor: "gray",
        margin: 6,
        overflow: "visible",
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
});

interface Props {
    // myProfile: ProfileResponse;
    refreshTimelineFeeds: () => void;
}
/**
 * Feedをポストする機能を持ったコンポーネント
 */
export const PostFeed = ({ refreshTimelineFeeds }: Props) => {
    const { myProfile } = useContext(MyProfileContext);
    const [feedText, setFeedText] = useState("");
    const client = BskyClient.getInstance();
    const classes = useStyles();

    useEffect(() => {}, []);

    const onFeedTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeedText(event.target.value);
    };

    const onClickPost = () => {
        /**
         * 画像があったら先にアップロードしてから
         */
        let feed = {} as AppBskyFeedPost.Record;
        feed.text = feedText;
        feed.createdAt = new Date().toISOString();

        // オブジェクトに必須項目の値がセットされてるか位しか多分見てない
        let validateResult = AppBskyFeedPost.validateRecord(feed);
        // 空白とか取り除いて文字が残ってるか
        let isFeedTextNOTEmpty =
            deleteWhitespace(feed.text).length > 0 ? true : false;

        // 一旦何にも入ってない状態でポストボタンを押しても何も起こらないようにする
        // 今後UIとかでバリデーション結果を教えてもいいかもしれない
        // Twitterはボタン押させない、bskyはボタン押した後UIで教える
        if (!isFeedTextNOTEmpty) return;

        client
            .postFeed(feed)
            .then((feed) => {
                console.info(feed);
                // ポスト送信が成功した場合はテキストや画像のステートを捨てる
                setFeedText("");
            })
            .catch((e) => {
                console.info(e);
            })
            .finally(() => {
                refreshTimelineFeeds(); // ポストしたらタイムラインを更新、先頭を最新データに
            });
    };

    return (
        <Box className={classes.feedContainer}>
            <Stack direction={"row"}>
                <Box className={classes.feedLeftArea}>
                    <Avatar
                        className={classes.avatar}
                        src={myProfile.data?.avatar}
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
                    {/* 上、textarea, 下、Postボタンなどボタン類 */}
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={27}
                            variant="filled"
                            inputProps={{ style: { fontSize: 23 } }}
                            onChange={onFeedTextChanged}
                            value={feedText}
                        />
                    </Grid>
                    <Grid item xs={4} style={{ display: "inline-flex" }}>
                        {/* ボタン類 */}
                        <CustomedCircularProgress
                            textCount={feedText.length}
                            maxCount={300}
                        />
                        <IconButton
                            onClick={onClickPost}
                            color="primary"
                            disabled={false}
                        >
                            <SendIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
};

export default PostFeed;
