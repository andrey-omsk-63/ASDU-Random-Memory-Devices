import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Modal from '@mui/material/Modal';

import BindRight from './BindComponents/BindRight';

//import axios from 'axios';

const BindOutputs = () => {
  const [size, setSize] = React.useState(0);
  let styleSetWidth = 650;
  if (size > 770) styleSetWidth = size - 50;
  let fSize = 12;
  if (size > 800) fSize = 14;

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
    marginTop: '-1.8vh',
    //marginTop: -3.5,
    backgroundColor: 'white',
    color: '#5B1080',
    textTransform: 'unset !important',
  };

  const styleXTG01 = {
    borderBottom: 1,
    borderColor: 'primary.main',
    textAlign: 'center',
    backgroundColor: '#C0C0C0',
    paddingTop: 2,
  };

  const styleXTG03 = {
    borderRight: 1,
    borderBottom: 1,
    borderColor: 'primary.main',
    padding: 0.2,
  };

  const styleSet = {
    position: 'absolute',
    marginTop: '1vh',
    marginLeft: '1vh',
    //width: 1000,
    width: styleSetWidth,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    paddingRight: 3,
    paddingTop: 3,
  };

  const HeaderLBindOutputs = () => {
    return (
      <Grid item container xs={12}>
        <Grid item xs={1.5} sx={styleXTG01}>
          <b>№ вых</b>
        </Grid>
        <Grid item xs={2} sx={styleXTG01}>
          <b>Контр. конфликта</b>
        </Grid>
        <Grid item xs={2} sx={styleXTG01}>
          <b>Контр. перегорания</b>
        </Grid>
        <Grid item xs={2} sx={styleXTG01}>
          <b>Мощность</b>
        </Grid>
        <Grid item xs={1.5} sx={styleXTG01}>
          <b>Лампы</b>
        </Grid>
        <Grid item xs={1.5} sx={styleXTG01}>
          <b>Тип нагрузки</b>
        </Grid>
        <Grid item xs sx={styleXTG01}>
          <b>№ СБ Integra</b>
        </Grid>
      </Grid>
    );
  };

  const StrokaBindOutputs = () => {
    let resStr = [];

    for (let i = 0; i < 69; i++) {
      resStr.push(
        <Grid key={Math.random()} container item xs={12}>
          <Grid key={Math.random()} xs={1.5} item sx={styleXTG03}>
            {i + 1}
          </Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}>
            Контр. конфликта
          </Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}>
            Контр. перегорания
          </Grid>
          <Grid key={Math.random()} xs={2} item sx={styleXTG03}>
            Мощность
          </Grid>
          <Grid key={Math.random()} xs={1.5} item sx={styleXTG03}>
            Лампы
          </Grid>
          <Grid key={Math.random()} xs={1.5} item sx={styleXTG03}>
            Тип нагрузки
          </Grid>
          <Grid key={Math.random()} xs item sx={styleXTG03}>
            № СБ Integra
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const OutputNormal = () => {
    return (
      <Box sx={{ border: 0, height: '91vh', marginTop: -2.5, fontSize: fSize }}>
        <HeaderLBindOutputs />
        <Box sx={{ overflowX: 'auto', height: '84vh' }}>{StrokaBindOutputs()}</Box>
      </Box>
    );
  };

  const OutputModal = () => {
    return (
      <Modal open={openSet} onClose={handleCloseSet}>
        <Box sx={styleSet}>
          <ModalEnd />
          <Grid container>
            <Grid item xs sx={{ marginRight: 1, marginTop: -3, fontSize: 18 }}>
              <HeaderLBindOutputs />
              <Box sx={{ overflowX: 'auto', height: '88vh' }}>{StrokaBindOutputs()}</Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  };

  const handleOpenModal = (nom: string) => {
    setOpenSet(true);
    setValue(nom);
  };

  const ModalEnd = () => {
    const styleModalEnd = {
      position: 'absolute',
      top: '0%',
      left: 'auto',
      right: '-2%',
      maxHeight: '21px',
      minHeight: '21px',
      width: '6%',
      fontSize: 21,
      color: 'black',
    };

    return (
      <Button sx={styleModalEnd} onClick={handleCloseSetBut}>
        <b>&#10006;</b>
      </Button>
    );
  };

  const [value, setValue] = React.useState('0');
  const [openSet, setOpenSet] = React.useState(false);

  const handleCloseSet = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSet(false);
  };

  const handleCloseSetBut = () => {
    setOpenSet(false);
  };

  //отслеживание изменения размера экрана
  // const [size, setSize] = React.useState([0, 0]);
  // React.useLayoutEffect(() => {
  //   function updateSize() {
  //     setSize([window.innerWidth, window.innerHeight]);
  //   }
  //   window.addEventListener('resize', updateSize);
  //   updateSize();
  //   return () => window.removeEventListener('resize', updateSize);
  // }, []);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const BindLeft = () => {
    return (
      <Grid item xs={9} sx={styleBox}>
        <TabContext value={value}>
          <Box>
            <Button sx={styleButtBox} variant="contained" onClick={() => handleOpenModal('33')}>
              <b>Назначение выходов</b>
            </Button>
            <OutputNormal />
            <TabPanel value="33">
              <OutputModal />
            </TabPanel>
          </Box>
        </TabContext>
      </Grid>
    );
  };

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <BindLeft />
            <Grid item xs={0.05}></Grid>
            <BindRight />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BindOutputs;
