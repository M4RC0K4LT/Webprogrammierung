import { green } from '@material-ui/core/colors';

const drawerWidth = 240;

/** Store CSS styles */
const useStyles = theme => ({
    
    /** Form, Messages, Alert Styles */
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: "hidden",
      padding: "0px",
      marginTop: theme.spacing(1),
    },
    avatar: {
      marginBottom: theme.spacing(2),
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
        margin: theme.spacing(0, 0, 1),
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
        position: 'fixed',
        overflow: "hidden"
    },
    ListItems: {
        width: '100%',
        textAlign: 'center',
        padding: "0",
    },
    deleteDialog: {
      color: "black",
    },
    loading: {
      position: 'absolute',
      left: "calc(50% - 50px)",
      top: "calc(50% - 50px)",
    },
    logoutButton: {
      margin: theme.spacing(5),
      backgroundColor: "white"
    },
    searchBar: {
      margin: theme.spacing(1)
    },



    /** Responsive Drawer styles */
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      backgroundColor: "#424242",
    },
    menuButton: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
      color: "white"
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#424242",
      color: "#fff"
    },
    content: {
      flexGrow: 1,
      padding: "5px",
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
      padding: theme.spacing(1),
      marginTop: "5px",
      marginBottom: "30px",
      marginLeft: "auto",
      textAlign: "center"    
    },
    title: {
      flexGrow: 1,
      textAlign: "center"
    }
    
});

/**
 * Store CSS styling elements.
 * @return {theme} CSS styles.
 */
export default useStyles;