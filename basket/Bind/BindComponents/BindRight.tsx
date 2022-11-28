import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Modal from '@mui/material/Modal';

const BindRight = () => {
  let crossForm = 'Crossform';
  let fSize = 12.9;
  let openKnob = 'Откр.файл';
  let saveKnob = 'Сохр.файл';
  if (window.innerWidth > 720) openKnob = 'Открыть файл';
  if (window.innerWidth > 780) saveKnob = 'Сохранить файл';
  if (window.innerWidth > 1140) crossForm = 'Привязка Crossform';
  if (window.innerWidth > 985) fSize = 17.5;

  const styleBox = {
    border: 1,
    borderRadius: 1,
    backgroundColor: 'white',
    borderColor: 'primary.main',
  };

  const styleButt = {
    fontSize: 18,
    maxHeight: '21px',
    minHeight: '21px',
    marginTop: -2.0,
    backgroundColor: 'white',
    color: '#5B1080',
    textTransform: 'unset !important',
  };

  const styleButtBing = {
    fontSize: fSize,
    maxHeight: '33px',
    minHeight: '33px',
    marginBottom: 1.5,
    backgroundColor: 'white',
    color: 'black',
    textTransform: 'unset !important',
  };

  const styleButtBingModal = {
    fontSize: 23,
    maxHeight: '27px',
    minHeight: '27px',
    marginBottom: 3,
    backgroundColor: 'white',
    color: 'black',
    textTransform: 'unset !important',
  };

  const styleSet = {
    position: 'absolute',
    marginTop: '6vh',
    marginLeft: '6vh',
    width: 512,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
  };

  const ModalEnd = () => {
    const styleModalEnd = {
      position: 'absolute',
      top: '-3%',
      left: '91.5%',
      fontSize: 24,
      color: 'black',
    };

    return (
      <Button sx={styleModalEnd} onClick={handleCloseSetBut}>
        <b>&#10006;</b>
      </Button>
    );
  };

  const ModalTop = () => {
    return (
      <Modal open={openSet} onClose={handleCloseSet}>
        <Box sx={styleSet}>
          <ModalEnd />
          <Grid container sx={{ fontSize: 21, marginTop: 1 }}>
            <Grid item xs={8}>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Открыть файл</b>
              </Button>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Сохранить файл</b>
              </Button>
              <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Файл привязки</Box>
              <Box sx={{ marginLeft: 1, marginBottom: 2 }}>{'<Не загружен>'}</Box>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Записать ДК</b>
              </Button>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Прочитать ДК</b>
              </Button>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Сравнить ДК</b>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  };

  const ModalBattom = () => {
    return (
      <Modal open={openSet} onClose={handleCloseSet}>
        <Box sx={styleSet}>
          <ModalEnd />
          <Grid container sx={{ fontSize: 21 }}>
            <Grid item xs={7}>
              <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Система:</Box>
              <Box sx={{ marginLeft: 1, marginBottom: 2 }}>19:45:44 20.03.2022</Box>
              <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Контроллер:</Box>
              <Box sx={{ marginLeft: 1, marginBottom: 2 }}>19:45:44 20.03.2022</Box>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Прочитать</b>
              </Button>
              <Button sx={styleButtBingModal} variant="contained">
                <b>Установить</b>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    );
  };

  const TopTab = () => {
    return (
      <Grid container sx={styleBox}>
        <Grid item xs={12} sx={{ height: '45vh' }}>
          <Button sx={styleButt} variant="contained" onClick={() => handleOpenModal('21')}>
            <b>{crossForm}</b>
          </Button>
          <Grid container sx={{ fontSize: fSize, marginTop: 1 }}>
            <Grid item xs={11.3}>
              <Grid container>
                <Grid item xs={12}>
                  <Button sx={styleButtBing} variant="contained">
                    <b>{openKnob}</b>
                  </Button>
                </Grid>
              </Grid>
              <Button sx={styleButtBing} variant="contained">
                <b>{saveKnob}</b>
              </Button>
              <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Файл привязки</Box>
              <Box sx={{ marginLeft: 1, marginBottom: 2 }}>{'<Не загружен>'}</Box>
              <Button sx={styleButtBing} variant="contained">
                <b>Записать ДК</b>
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  <Button sx={styleButtBing} variant="contained">
                    <b>Прочитать ДК</b>
                  </Button>
                </Grid>
              </Grid>
              <Button sx={styleButtBing} variant="contained">
                <b>Сравнить ДК</b>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const BattomTab = () => {
    return (
      <Box sx={{ marginTop: 0.5 }}>
        <Grid container sx={styleBox}>
          <Grid item xs={12} sx={{ height: '36vh' }}>
            <Button sx={styleButt} variant="contained" onClick={() => handleOpenModal('22')}>
              <b>Время</b>
            </Button>
            <Grid container sx={{ fontSize: fSize, marginTop: 1 }}>
              <Grid item xs={10}>
                <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Система:</Box>
                <Box sx={{ marginLeft: 1, marginBottom: 2 }}>19:45:44 20.03.2022</Box>
                <Box sx={{ marginLeft: 1, marginBottom: 0.5 }}>Контроллер:</Box>
                <Box sx={{ marginLeft: 1, marginBottom: 2 }}>19:45:44 20.03.2022</Box>
                <Grid container>
                  <Grid item xs={12}>
                    <Button sx={styleButtBing} variant="contained">
                      <b>Прочитать</b>
                    </Button>
                  </Grid>
                </Grid>
                <Button sx={styleButtBing} variant="contained">
                  <b>Установить</b>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
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

  const handleOpenModal = (nom: string) => {
    setOpenSet(true);
    setValue(nom);
  };

  return (
    <Grid item xs>
      <Stack direction="column">
        <TabContext value={value}>
          <TopTab />
          <BattomTab />
          <TabPanel value="21">
            <ModalTop />
          </TabPanel>
          <TabPanel value="22">
            <ModalBattom />
          </TabPanel>
        </TabContext>
      </Stack>
    </Grid>
  );
};

export default BindRight;
