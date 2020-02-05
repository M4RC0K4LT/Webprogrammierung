import React from 'react';
import { Link  } from 'react-router-dom'
import { Divider, ListItemIcon, Typography, AppBar, CssBaseline, Drawer, Hidden, IconButton, List, ListItem, ListItemText, Toolbar, useTheme, withStyles } from '@material-ui/core';
import { Menu as MenuIcon, Build as BuildIcon, People as PeopleIcon, Person as PersonIcon, AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import { useStyles } from "../exports";
import logo from "./bearing.png";

/** Responsible for suitable page-navigation regarding device width */
function ResponsiveDrawer(props) {

  const { container, classes, content } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /** Drawer Content -> Menu Items */
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

        {/** AppBar - Toolbar on page header: Hidden above MaterialUI size "md" */}
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

        {/** Actual Navigation on SideBar (left) */}
        <nav className={classes.drawer}>

            {/** Smartphone-Drawer: hidden above MaterialUI size "md" */}
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

            {/** Desktop-Drawer: hidden below MaterialUI size "sm" */}
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

        {/** Website content next to drawer (passed as props) */}
        <main className={classes.content}>
            <div className={classes.toolbar} />
            {content}
        </main>
        
    </div>
  );
}

/**
 * Responsive Page-Navigation as well as perfectly placed content.
 * @param {props} props - Properties given from mother element: Page-Content Components (Switch)
 * @return {Component} Including PageNavigation and content.
 */
export default withStyles(useStyles) (ResponsiveDrawer);
