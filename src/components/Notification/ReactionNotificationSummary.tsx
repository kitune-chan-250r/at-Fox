import { Box, Grid, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Fragment, memo, useEffect, useState } from "react";
import {
    AppBskyNotificationListNotifications,
    AppBskyFeedDefs,
} from "@atproto/api";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import StarIcon from "@mui/icons-material/Star";
import RepeatIcon from "@mui/icons-material/Repeat";

const useStyles = makeStyles({
    timelineContainer: {},
});

interface Props {
    reasonSubject: AppBskyFeedDefs.PostView | undefined;
    likeOrRepost: AppBskyNotificationListNotifications.Notification[];
}

export const ReactionNotificationSummary = ({
    reasonSubject,
    likeOrRepost,
}: Props) => {
    const classes = useStyles();

    return (
        <Grid
            container
            style={{ width: "100%" }}
            key={"reaction-notification-" + reasonSubject?.cid}
        >
            {/* この部分をNotificationコンポーネントへ移動させる */}
            <Box style={{ width: "100%" }}>
                {(reasonSubject?.record as Record)?.text}
            </Box>

            <Box style={{ width: "100%" }}>
                {likeOrRepost.filter((e) => e.reason === "repost").length !==
                    0 && (
                    <Stack direction={"row"} spacing={1}>
                        <Grid container alignItems="center">
                            <RepeatIcon color="success" />
                            <AvatarGroup>
                                {likeOrRepost
                                    .filter((e) => e.reason === "repost")
                                    .map((e) => (
                                        <Avatar
                                            src={e.author.avatar}
                                            key={
                                                "notice-repost-avatar-" +
                                                e.author.did
                                            }
                                        />
                                    ))}
                            </AvatarGroup>
                        </Grid>
                    </Stack>
                )}
            </Box>

            <Box style={{ width: "100%" }}>
                {likeOrRepost.filter((e) => e.reason === "like").length !==
                    0 && (
                    <Stack direction={"row"} spacing={1}>
                        <Grid container alignItems="center">
                            <StarIcon color="warning" />
                            <AvatarGroup>
                                {likeOrRepost
                                    .filter((e) => e.reason === "like")
                                    .map((e) => (
                                        <Avatar
                                            src={e.author.avatar}
                                            key={
                                                "notice-like-avatar-" +
                                                e.author.did
                                            }
                                        />
                                    ))}
                            </AvatarGroup>
                        </Grid>
                    </Stack>
                )}
            </Box>
        </Grid>
    );
};

export default ReactionNotificationSummary;
