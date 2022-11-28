import * as React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const Eguipment = () => {
  const styleBox = {
    border: 1,
    borderRadius: 1,
    backgroundColor: 'white',
    borderColor: 'primary.main',
  };

  const styleButtBox = {
    fontSize: 19,
    maxHeight: '21px',
    minHeight: '21px',
    marginTop: '-0.6vh',
    backgroundColor: 'white',
    color: '#5B1080',
    textTransform: 'unset !important',
  };

  const styleXTG021 = {
    borderBottom: 1,
    borderColor: 'primary.main',
    textAlign: 'center',
    backgroundColor: '#C0C0C0',
    height: '4.5vh',
  };

  const styleXTG03 = {
    borderRight: 1,
    borderBottom: 1,
    borderColor: 'primary.main',
    //padding: 1,
    height: '4.5vh',
  };

  const HeaderTopTabls = () => {
    return (
      <Grid item container xs={12}>
        <Grid item xs={2} sx={styleXTG021}></Grid>
        <Grid item xs={2} sx={styleXTG021}></Grid>
        <Grid item xs={2} sx={styleXTG021}></Grid>
        <Grid item xs={2} sx={styleXTG021}></Grid>
        <Grid item xs={2} sx={styleXTG021}></Grid>
        <Grid item xs={2} sx={styleXTG021}></Grid>
      </Grid>
    );
  };

  const StrokaTopTabls = () => {
    let resStr = [];

    for (let i = 0; i < 12; i++) {
      resStr.push(
        <Grid key={Math.random()} container item xs={12}>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}></Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const BattomTopTabls = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid container sx={{ border: 0, marginTop: '3vh', height: '4.5vh' }}>
            <Grid item xs={1} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.4} sx={{ border: 0 }}>
              <Box>Неиспр:</Box>
            </Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs sx={{ border: 1 }}></Grid>
          </Grid>
          <Grid container sx={{ border: 0, marginTop: '2vh', height: '4.5vh' }}>
            <Grid item xs={1} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.4} sx={{ border: 0 }}>
              <Box>Входы:</Box>
            </Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            <Grid item xs={0.1} sx={{ border: 0 }}></Grid>
            <Grid item xs={1.075} sx={{ border: 1 }}></Grid>
            {/* <Grid item xs sx={{ border: 0 }}></Grid> */}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const TopTabls = () => {
    return (
      <Grid item xs={12} sx={{ border: 0, marginTop: '-2vh', height: '72vh' }}>
        <Grid container sx={styleBox}>
          <Grid item xs={12} sx={{ height: '46.5vh' }}>
            <HeaderTopTabls />
            <Box sx={{ height: '42vh', overflowX: 'auto' }}>{StrokaTopTabls()}</Box>
          </Grid>
        </Grid>
        <Grid container sx={{ border: 0 }}>
          <Grid item xs={12} sx={{ height: '25vh' }}>
            <BattomTopTabls />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Stack direction="column">
      <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
        <Grid container>
          <Button sx={styleButtBox} variant="contained">
            <b>Оборудование</b>
          </Button>
          <TopTabls />
        </Grid>
      </Box>
      <Box sx={{ marginTop: 0.5, marginLeft: -3, marginRight: -3 }}>
        <Grid container sx={styleBox}>
          <Grid item xs sx={{ border: 0, height: '19vh' }}></Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default Eguipment;
