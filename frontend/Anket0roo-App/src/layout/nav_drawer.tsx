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

interface SwipeableLeftTemporaryNavDrawerProps {
    open: boolean;
    toggleDrawer: (open: boolean) => void;
    routes: Map<string, () => JSX.Element>;
}

export const SwipeableLeftTemporaryNavDrawer: React.FC<SwipeableLeftTemporaryNavDrawerProps> = ({ open, toggleDrawer, routes }) => {
    const classes = useStyles();

    return (
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
                    {Array.from(routes).map((pair: [string, () => JSX.Element]) => (
                        <ListItem button key={pair[0]}>
                            <ListItemIcon>{pair[1]()}</ListItemIcon>
                            <ListItemText primary={snakeToTitle(pair[0])} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </SwipeableDrawer>
    );
}