import { Box, Grid } from '@mui/material';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

interface Props {
    textCount: number;
    maxCount: number;
}

/**
 * 円形のプログレスをカスタマイズしたコンポーネント
 */
export const CustomedCircularProgress = ({ textCount, maxCount }: Props) => {

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress 
                className='background-circle'
                variant='determinate'
                value={100}
                sx={{
                    color: (theme) =>
                    (textCount < maxCount ? theme.palette.grey[600] : theme.palette.error.main),
                    
                }}
            />
            <CircularProgress
                className='top-circle'
                variant='determinate' 
                style={{ position: 'absolute' }}
                value={ Math.round((textCount / maxCount) * 100) }
                sx={{
                    color: (theme) => 
                    textCount < maxCount ? theme.palette.primary.main : theme.palette.error.main,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
            />
            <Grid item style={{ position: 'absolute' }}>
                {maxCount - textCount}
            </Grid>
        </Box>
    )
}

export default CustomedCircularProgress;

