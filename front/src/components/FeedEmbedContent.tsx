import { Fragment } from "react";
import {
    AppBskyEmbedImages,
    AppBskyEmbedExternal,
    AppBskyEmbedRecord,
    AppBskyEmbedRecordWithMedia
} from '@atproto/api';
import FeedEmbedImage from "./FeedEmbedImage";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    
});

interface Props {
    content: AppBskyEmbedImages.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | { [k: string]: unknown; $type: string; } | undefined;
}
/**
 * Feedに埋め込まれた動画、画像、OGPを表示するコンポーネント
 * 画像１枚の場合、複数枚の場合
 * 動画の場合、複数の動画の場合(現状ありえる？)
 * それぞれ別の振る舞いをするようにする
 */
export const FeedEmbedContent = ({ content }: Props) => {
    const classes = useStyles();

    console.info(content);
    switch (content?.$type) {
        case 'app.bsky.embed.images#view': // 画像
            return (
                <FeedEmbedImage view={content as AppBskyEmbedImages.View} />
            )
            
        case 'app.bsky.embed.record#view': // feed
            return (
                <Fragment>

                </Fragment>
            )

        default: // 当てはまらないコンテンツは一旦無視
            return (
                <Fragment>

                </Fragment>
            )
    }
}

export default FeedEmbedContent;