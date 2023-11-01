/**
 * 
 * 主なページ構成
 *  /login                  : ログイン画面
 *  /home                   : タイムライン等
 *  /profile/{displayname}  : 個人ユーザー画面
 * 
 * 最優先事項
 * 
 * ログイン画面からのログイン実装(簡易的でいい)
 * timelineとfeedのコンポーネントを作成
 *
 * メモ
 * バックエンドを用意しているが夜狐のようなスタンプ機能を提供するため
 * 持たせるとりあえず以下のよてい
 *  スタンプ一覧の取得
 *  スタンプID指定でスタンプ画像の提供
 * 
 * 主な課題
 * 現状、通信料が多い。agentの状態の持ち方を工夫する必要あり
 * 
 */

import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BskyAgent, AtpSessionEvent, AtpSessionData } from '@atproto/api';
import { Box, Button, Card, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { useCookies } from "react-cookie";
import { makeStyles } from '@mui/styles';
import { animated, useSpring } from "react-spring";
import Particle from "../components/Particle";
import Particles from "react-particles-js";

// icons
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { checkSessionData } from "../utils/Utils";


const useStyles = makeStyles({
    left: {
        height: '100vh',
        // backgroundColor: '#060809',
    },
    mid: {
        height: '100vh',
        // backgroundColor: '#060809',
    },
    right: {
        height: '100vh',
        // backgroundColor: '#060809',
        // backdropFilter: 'blur(30px)',
    },
    loginPaper: {
        width: '100%',
        height: '100vh',
        // backgroundColor: '#313338',
        backgroundColor: 'rgba(117, 117, 117, 0.3)',

        maxWidth: 350,
        maxHeight: 500,

        paddingLeft: 15,
        paddingRight: 15,

        position: 'relative',
        zIndex: 2,
        color: 'white',
        backdropFilter: 'blur(10px)',
    },
    loginPaperContent: {
        height: '100%',
    },
    bar: {
        width: 10,
        height: '2%',
        position: 'absolute',
        // top: 0,
        left: 0,
        // borderTopLeftRadius: '15px',
        // borderTopRightRadius: '15px',
        // borderBottomRightRadius: '15px',
        // marginTop: 5,
        // marginBottom: 15,
    },
    backgroundFilter: {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        
        // backdropFilter: 'blur(1px)',
        zIndex: 1
    },
    accountTextField: {
        fontSize: '100px',
    },
    textFieldIcon: {
        marginLeft: 15,
    },

});


export const Login = () => {
    const [service, setService] = useState("https://bsky.social"); // とりあえずデフォルトはbsky
    const [handle, setHandle] = useState("");
    const [pass, setPass] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies();
    const [isMove, setMove] = useState(false);
    const [isShowPassword, setShowPassword] = useState(false);
    const [loginHelperText, setLoginHelperText] = useState("");
    const [authErrorText, setAuthErrorText] = useState("");
    const navigate = useNavigate();
    const classes = useStyles();


    // アニメーション設定
    const bar1 = useSpring({
        // backgroundColor: 'red',
        backgroundColor: 'rgba(198, 255, 0, 1)',
        width: isMove ? '50%' : '0%',
        delay: 400,
    });
    const bar2 = useSpring({
        backgroundColor: 'rgba(66, 66, 66, 1)',
        width: isMove ? '69%' : '0%',
        delay: 450,
    });
    const bar3 = useSpring({
        backgroundColor: 'rgba(0, 229, 255, 1)',
        width: isMove ? '81%' : '0%',
        delay: 500,
    });
    const bar4 = useSpring({
        backgroundColor: 'rgba(245, 0, 87, 1)',
        width: isMove ? '90%' : '0%',
        delay: 550,
    });
    const bar5 = useSpring({
        backgroundColor: 'rgba(118, 255, 3, 1)',
        width: isMove ? '100%' : '0%',
        delay: 600,
    });

    useEffect(() => {
        var isLogin = checkSessionData(cookies?.sessionData);
        if (isLogin) {
            navigate('/home');
        }
        setMove(true);
    }, []);

    const login = async() => {
        // cookieを見てセッション情報が存在していれば/homeに移動
        const agent = new BskyAgent({
            service: service,
            persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
            //   store the session-data for reuse 
            //   console.info(evt);
            //   console.info(sess);
            }
          });
        setAuthErrorText('');
        await agent.login({
            identifier: handle,
            password: pass
        }).then((e) => {
            console.info(e.data);
            if (e.success) {
                // sessionStorage.setItem('sessionData', JSON.stringify(e.data));
                // ログイン成功時はcookieにデータを送信する
                setCookie(
                    'sessionData', 
                    JSON.stringify(e.data),
                );
                setCookie(
                    'service', 
                    service,
                );
                navigate("/home");
            }
        }).catch((e) => {
            console.error(e);
            setAuthErrorText(e.message);
        });
    }
   
    return(
        <Fragment>
            {/* <div className={classes.backgroundFilter}></div> */}
            <Grid 
                container 
                style={{ 
                    backgroundColor: 'black',
                }}
            >
                
                <Grid id='left' className={classes.left} item lg={3} xs={0}>
                </Grid>
                <Grid id='mid' className={classes.mid} container item lg={6} xs={12} alignItems='center' justifyContent='center'>
                    <Particle />
                    <Box className={classes.loginPaper}>   
                        <Grid className={classes.loginPaperContent} container direction='column' alignItems='center' justifyContent='center' >
                            <Typography fontFamily={`"Libre Barcode 39 Extended Text"`} fontSize={70} >
                                AT Fox
                            </Typography>
                            <Grid  item xs={1}>
                                <animated.div className={classes.bar} style={bar5} />
                                <animated.div className={classes.bar} style={bar4} />
                                <animated.div className={classes.bar} style={bar3} />
                                <animated.div className={classes.bar} style={bar2} />
                                <animated.div className={classes.bar} style={bar1} />
                                
                            </Grid>
                            <Grid container item xs={7} alignItems='center' justifyContent='center'>
                                {   authErrorText !== '' ?
                                    <FormHelperText error>{ authErrorText }</FormHelperText>
                                    :
                                    ''
                                }
                                
                                <TextField 
                                    id="serviceInput"
                                    fullWidth 
                                    variant="standard" 
                                    margin="dense"
                                    placeholder="Service"
                                    // helperText={ log
                                    //     <FormHelperText error required >{loginHelperText}</FormHelperText>
                                    // }
                                    value={service} 
                                    sx={{ 
                                        input: { 
                                            color: 'white', 
                                            fontSize: '20px', 
                                            fontWeight: '100', 
                                            fontFamily: 'Roboto Mono',
                                        },
                                        backgroundColor: 'rgba(33, 33, 33, 0.5)' ,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PublicIcon 
                                                    className={classes.textFieldIcon} 
                                                    htmlColor="white" 
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(event) => setService(event.target.value)}
                                />
                                <TextField 
                                    id="handleInput"
                                    fullWidth 
                                    variant="standard" 
                                    // margin="dense"
                                    placeholder="Handle or email"
                                    size="medium"
                                    value={handle} 
                                    sx={{ 
                                        input: { 
                                            color: 'white', 
                                            fontSize: '20px', 
                                            fontWeight: '100', 
                                            fontFamily: 'Roboto Mono',
                                        }, 
                                        backgroundColor: 'rgba(33, 33, 33, 0.5)' ,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AlternateEmailIcon
                                                    className={classes.textFieldIcon}
                                                    htmlColor="white" 
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(event) => setHandle(event.target.value)} 
                                />
                                <TextField 
                                    id="passInput"
                                    fullWidth 
                                    variant="standard" 
                                    // margin="normal"
                                    placeholder="Password"
                                    value={pass} 
                                    sx={{ 
                                        input: { 
                                            color: 'white', 
                                            fontSize: '20px', 
                                            fontWeight: '100', 
                                            fontFamily: 'Roboto Mono',
                                        },
                                        backgroundColor: 'rgba(33, 33, 33, 0.5)' ,
                                    }}
                                    type={isShowPassword ? 'text' : 'password'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VpnKeyIcon
                                                    className={classes.textFieldIcon}
                                                    htmlColor="white" 
                                                />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!isShowPassword)}
                                                    // onMouseDown={handleMouseDownPassword}
                                                >
                                                    {isShowPassword ? <VisibilityIcon htmlColor="white"/> : <VisibilityOffIcon  />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(event) => setPass(event.target.value)} 
                                />
                                <Button 
                                    onClick={login} 
                                    variant="contained" 
                                    fullWidth 
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                        </Box> 
                    {/* </Paper> */}
                    {/* </Card> */}
                </Grid>
                <Grid id='right' className={classes.right} item lg={3} xs={0}>

                </Grid>
            </Grid>
        </Fragment>
    )
}

export default Login;