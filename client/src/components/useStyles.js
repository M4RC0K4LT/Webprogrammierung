import { green } from '@material-ui/core/colors';

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(15),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
    }
});


export default useStyles;