import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { useTheme } from '@material-ui/core/styles';
import useStyles from "./useStyles";
import { withStyles } from '@material-ui/core/styles';
import { Link  } from 'react-router-dom'
import { Divider, ListItemIcon, Typography } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import logo from "./bearing.png";

function ResponsiveDrawer(props) {
  const { container, classes, content } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
        <img src={logo} alt="Logo" className={classes.logo} />
        <div className={classes.companylogo}>Georg Müller<br></br>Kugellager GmbH</div>
        <Divider></Divider>
        <List>
            <ListItem button key={1} component={Link} to={"/orders"} >
            <ListItemIcon style={{ color: "#fff" }}><BuildIcon></BuildIcon></ListItemIcon>
            <ListItemText primary={"Aufträge"} />
            </ListItem>
        </List>
        <List >   
            <ListItem button key={2} component={Link} to={"/customers"}>
            <ListItemIcon style={{ color: "#fff" }}><PeopleIcon></PeopleIcon></ListItemIcon>
            <ListItemText primary={"Kunden"} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={3} component={Link} to={"/profile"}>
            <ListItemIcon style={{ color: "#fff" }}><PersonIcon></PersonIcon></ListItemIcon>
            <ListItemText primary={"Profil"} />
            </ListItem>
        </List>
    </div>
  );

  return (
    <div className={classes.root}>  
        <CssBaseline />
            <Hidden mdUp implementation="css">
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="subtitle2" className={classes.title}>Kugellager GmbH</Typography>
                    <IconButton
                        component={Link}
                        edge="end"
                        to={"/profile"}
                        
                        className={classes.menuButton}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    </Toolbar>
                </AppBar>
            </Hidden>
            <nav className={classes.drawer}>
                <Hidden mdUp implementation="css">
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen}
                    onClick={handleDrawerToggle}
                    onClose={handleDrawerToggle}
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                    keepMounted: true,
                    }}
                >
                    {drawer}
                </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                <Drawer
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                    
                >
                    {drawer}
                </Drawer>
                </Hidden>
            </nav>
        <main className={classes.content}>
            <div className={classes.toolbar} />
            {content}
        </main>
        
    </div>
  );
}

export default withStyles(useStyles) (ResponsiveDrawer);
