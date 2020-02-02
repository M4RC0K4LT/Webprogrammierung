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
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import useStyles from "./useStyles";
import { withStyles } from '@material-ui/core/styles';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Divider, ListItemIcon } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function ResponsiveDrawer(props) {
  const { container, classes } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
        <img src="./bearing.png" className={classes.logo} />
        <div className={classes.companylogo}>Georg Müller<br></br>Kugellager GmbH</div>
        <Divider></Divider>
        <List>
            <ListItem button key={1}  onClick={handleDrawerToggle} component={Link} to={"/orders"} >
            <ListItemIcon><BuildIcon></BuildIcon></ListItemIcon>
            <ListItemText primary={"Aufträge"} />
            </ListItem>
        </List>
        <List >   
            <ListItem button key={2} onClick={handleDrawerToggle} component={Link} to={"/customers"}>
            <ListItemIcon><PeopleIcon></PeopleIcon></ListItemIcon>
            <ListItemText primary={"Kunden"} />
            </ListItem>
        </List>
        <List>
            <ListItem button key={3} onClick={handleDrawerToggle} component={Link} to={"/profile"}>
            <ListItemIcon><PersonIcon></PersonIcon></ListItemIcon>
            <ListItemText primary={"Profil"} />
            </ListItem>
        </List>
    </div>
  );

  return (
    <div className={classes.root}>
        <CssBaseline />
        <Hidden smUp implementation="css">
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                >
                    <MenuIcon />
                </IconButton>
                <img src="./bearing.png" className={classes.logo_bar}/>
                <IconButton
                    component={Link}
                    to={"/profile"}
                    className={classes.menuButton}
                >
                    <AccountCircleIcon />
                </IconButton>
                </Toolbar>
            </AppBar>
        </Hidden>
        <nav className={classes.drawer}>
            <Hidden smUp implementation="css">
            <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
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
            <Hidden xsDown implementation="css">
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
    </div>
  );
}

export default withStyles(useStyles) (ResponsiveDrawer);
