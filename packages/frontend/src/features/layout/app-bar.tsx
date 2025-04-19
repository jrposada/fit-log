import {
  EventNote,
  FitnessCenter,
  Home,
  Mail,
  Menu,
} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { t } from 'i18next';
import { FunctionComponent, useState } from 'react';
import SearchInput from './search-input';
import { useNavigate } from '@tanstack/react-router';

const AppBar: FunctionComponent = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  const goToHome = () => {
    navigate({ to: '/' });
  };

  const goToWorkouts = () => {
    console.log('TODO: go to workouts');
  };

  const goToHistory = () => {
    console.log('TODO: go to history');
  };

  const goToSettings = () => {
    console.log('TODO: go to settings');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <MuiAppBar position="static">
          <Toolbar>
            {/* Menu */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggle}
              size="large"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>

            {/* Search */}
            <SearchInput />

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Actions */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <Mail />
                </Badge>
              </IconButton>

              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </MuiAppBar>
      </Box>
      <Drawer open={open} onClose={toggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggle}>
          <List>
            {/* Home */}
            <ListItem disablePadding onClick={goToHome}>
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={t('app_bar.home')} />
              </ListItemButton>
            </ListItem>

            {/* My Workouts */}
            <ListItem disablePadding onClick={goToWorkouts}>
              <ListItemButton>
                <ListItemIcon>
                  <FitnessCenter />
                </ListItemIcon>
                <ListItemText primary={t('app_bar.workouts')} />
              </ListItemButton>
            </ListItem>

            {/* History */}
            <ListItem disablePadding onClick={goToHistory}>
              <ListItemButton>
                <ListItemIcon>
                  <EventNote />
                </ListItemIcon>
                <ListItemText primary={t('app_bar.history')} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <List>
            {/* Settings */}
            <ListItem disablePadding onClick={goToSettings}>
              <ListItemButton>
                <ListItemIcon>
                  <EventNote />
                </ListItemIcon>
                <ListItemText primary={t('app_bar.settings')} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default AppBar;
