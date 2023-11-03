import { Fragment } from "react";
import {
    AppBskyEmbedExternal,
    AppBskyEmbedImages,
    AppBskyEmbedRecord
} from '@atproto/api';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, Grid, Stack } from "@mui/material";
import FeedEmbedContent from "./FeedEmbedContent";
import { Record } from "@atproto/api/dist/client/types/app/bsky/feed/post";

const useStyles = makeStyles({
    feedContainer: {
        width: '100%',
        height: '100%',
        marginLeft: 10,
        marginTop: 10,
    },
    avatar: {
        // marginLeft: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        // padding: 4,
        paddingLeft: 4
    },
});

interface Props {
    view: AppBskyEmbedRecord.View;
}
/**
 * Feedに埋め込まれたFeed(引用RT)を表示するコンポーネント
 */
export const EmbedFeed = ({ view }: Props) => {
    const classes = useStyles();
    const record = view.record as AppBskyEmbedRecord.ViewRecord;

    console.info(record.embeds);

    return (
        <Fragment>
            <Box className={classes.feedContainer} style={{maxWidth: '95%'}}>
                <Stack direction={'row'}>
                    <Avatar
                        className={classes.avatar}
                        src={record.author.avatar}
                        sx={{ width: 22, height: 22 }}
                    >
                        N
                    </Avatar>
                    <Box className={classes.userName}>
                        {record.author.displayName}
                        <a>
                            @{record?.author.handle}
                        </a>
                    </Box>
                </Stack>
                <Grid item xs={12}>
                    {
                        (record.value as Record)?.text !== undefined ?
                        (record.value as Record).text.split('\n').map(
                            // (e, index)=> <div key={index}>{e}<br/></div>
                            (e, index)=> <div key={index}>{e}<br/></div>
                        )
                            : ''
                    }
                </Grid>
                {
                    record.embeds?.map(e => <FeedEmbedContent content={e} />)
                }
            </Box>
        </Fragment>
    )
}

export default EmbedFeed;