import React, {Component, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {capitalize, Icon, SvgIcon} from "@material-ui/core";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";
import {SvgIconTypeMap} from "@material-ui/core/SvgIcon/SvgIcon";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

function snakeToTitle(src: string): string {
    return capitalize(src.replace("_", " "));
}

interface DrawerListItemProps {
    gen: () => JSX.Element;
    onDrawerItemClick: (event: React.KeyboardEvent | React.MouseEvent) => void
}

interface SwipeableLeftTemporaryNavDrawerProps {
    open: boolean;
    toggleDrawer: (open: boolean) => void;
    routes: Map<string, DrawerListItemProps>;
}

export const SwipeableLeftTemporaryNavDrawer: React.FC<SwipeableLeftTemporaryNavDrawerProps> = ({ open, toggleDrawer, routes }) => {
    const classes = useStyles();

    // FIXME: Drawer dismissal on click outside (not working)
    return (
        <ClickAwayListener onClickAway={(event) => toggleDrawer(false)}>
            <SwipeableDrawer
                anchor={'left'}
                open={open}
                onClose={(props: any, context?: any) => toggleDrawer(false)}
                onOpen={(props: any, context?: any) => toggleDrawer(true)}
            >
                <div
                    className={classes.list}
                    role="presentation"
                    onClick={(props: any, context?: any) => toggleDrawer(false)}
                    onKeyDown={(props: any, context?: any) => toggleDrawer(false)}
                >
                    <List>
                        {Array.from(routes).map((pair: [string, DrawerListItemProps]) => (
                            <ListItem button key={pair[0]} onClick={pair[1].onDrawerItemClick}>
                                <ListItemIcon>{pair[1].gen()}</ListItemIcon>
                                <ListItemText primary={snakeToTitle(pair[0])} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </SwipeableDrawer>
        </ClickAwayListener>
    );
}