import { green } from '@material-ui/core/colors';
import { CenterFocusStrong, PlayCircleFilledWhite } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = theme => ({
    
    paper: {
      marginTop: theme.spacing(5),
      display: 'block',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: "hidden"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
        justifyContent: "center"
    },
    success: {
        backgroundColor: green[500],
        justifyContent: "center"
    },
    message: {
        display: 'flex',
    },
    delete: {
        color: theme.palette.error.dark,
        margin: theme.spacing(0, 0, 3),
    },
    mainlist: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    addbutton: {
        margin: 20,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed'
    },
    ListItems: {
        width: '100%',
        textAlign: 'center'
    },
    deleteDialog: {
      color: "black",
    },


    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
      color: "white"
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    logo: {
      display: "block",
      width: "40%",
      marginTop: "30px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    logo_bar: {
      display: "block",
      height: "35px",
      marginLeft: "auto",
      marginRight: "auto",
      color: "white"
    },
    companylogo: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
      marginTop: "5px",
      marginBottom: "30px",
      marginLeft: "auto",
      textAlign: "center"    
    },
    
});


export default useStyles;