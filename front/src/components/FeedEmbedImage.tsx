import { Fragment } from "react";
import {
    AppBskyEmbedImages
} from '@atproto/api';
import { makeStyles } from '@mui/styles';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";


const useStyles = makeStyles({
    image: {
        height: '100%',
        width: '100%',
        borderRadius: '10px'
    }
});

interface Props {
    view: AppBskyEmbedImages.View;
}
/**
 * Feedに埋め込まれた動画、画像、OGPを表示するコンポーネント
 * 画像１枚の場合、複数枚の場合
 * 動画の場合、複数の動画の場合(現状ありえる？)
 * それぞれ別の振る舞いをするようにする
 */
export const FeedEmbedImage = ({ view }: Props) => {
    const classes = useStyles();

    return (
        <ImageList
            style={{
                height: '100%',
                width: '100%',
            }}
            cols={2}
            variant="quilted"
        >
            {view.images.map((image, index) => (
                // 画像の数が奇数の場合、１番目は大きく (colsとrowsを求める部分は関数化してもよさそう...)
                <ImageListItem 
                    key={image.thumb} 
                    cols={view.images.length === 1 ? 2 : 1} // 画像が１枚の場合はデカく
                    rows={ view.images.length % 2 !== 0 && index === 0 ? 2 : 1 } // 画像が奇数の場合は１枚目をデカく
                > 
                    <img className={classes.image} src={image.thumb} />
                </ImageListItem>
            ))}
        </ImageList>
    )
}

export default FeedEmbedImage;