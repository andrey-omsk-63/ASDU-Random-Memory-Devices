import * as React from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Modal from '@mui/material/Modal';

//import axios from 'axios';

const Condition = () => {
  const [size, setSize] = React.useState(0);
  let fSize = 10.8;
  if (size > 800) fSize = 12.5;

  const styleButt01 = {
    fontSize: 19,
    maxHeight: '21px',
    minHeight: '21px',
    marginTop: -2,
    backgroundColor: 'white',
    color: '#5B1080',
    textTransform: 'unset !important',
  };

  const styleBox01 = {
    border: 1,
    borderColor: 'primary.main',
    borderRadius: 1,
    backgroundColor: 'white',
  };

  const styleSet = {
    position: 'absolute',
    // top: '12vh',
    // right: '18vh',
    //bottom: 'bottomStyleModal',
    marginTop: '6vh',
    marginLeft: '6vh',
    width: 512,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
  };

  const Col01Grid01 = () => {
    return (
      <>
        <Grid item xs={7.5}>
          <Box>
            <b>&nbsp;Номер устройства:</b>
          </Box>
          <p>
            <b>&nbsp;Версия платы:</b>
          </p>
          <Box>
            <b>&nbsp;Версия ПО:</b>
          </Box>
        </Grid>
        <Grid item xs>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
        </Grid>
      </>
    );
  };

  const Col01Grid02 = () => {
    return (
      <>
        <Grid item xs={7.5}>
          <Box>
            <b>&nbsp;Активный канал:</b>
          </Box>
          <p>
            <b>&nbsp;Состояние ПБС:</b>
          </p>
          <Box>
            <b>&nbsp;GPS:</b>
          </Box>
          <p>
            <b>&nbsp;ПСПД:</b>
          </p>
          <Box>
            <b>&nbsp;Питание:</b>
          </Box>
          <p>
            <b>&nbsp;Память:</b>
          </p>
        </Grid>
        <Grid item xs>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
        </Grid>
      </>
    );
  };

  const Col01Grid04 = () => {
    return (
      <>
        <Grid item xs={7.5}>
          <Box>
            <b>&nbsp;Спутники GPS:</b>
          </Box>
          <p>
            <b>&nbsp;Синхронизация:</b>
          </p>
          <Box>
            <b>&nbsp;Время RTC:</b>
          </Box>
          <p>
            <b>&nbsp;Время GPS:</b>
          </p>
          <Box>
            <b>&nbsp;Время системное:</b>
          </Box>
        </Grid>
        <Grid item xs>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>23:09:27</Box>
        </Grid>
      </>
    );
  };

  const Col02Grid01 = () => {
    return (
      <>
        <Grid item xs={7.5}>
          <Box>
            <b>&nbsp;Тип модема:</b>
          </Box>
          <p>
            <b>&nbsp;Версия ПО модема:</b>
          </p>
          <Box>
            <b>&nbsp;Оператор GSM:</b>
          </Box>
          <p>
            <b>&nbsp;Уровень сигнала:</b>
          </p>
          <Box>
            <b>&nbsp;Попытка связи:</b>
          </Box>
          <p>
            <b>&nbsp;IP адрес сервера:</b>
          </p>
          <Box>
            <b>&nbsp;Стадия соединения:</b>
          </Box>
          <p>
            <b>&nbsp;Состояние:</b>
          </p>
        </Grid>
        <Grid item xs>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
        </Grid>
      </>
    );
  };

  const Col02Grid02 = () => {
    return (
      <>
        <Grid item xs={7.5}>
          <Box>
            <b>&nbsp;IP адрес сервера:</b>
          </Box>
          <p>
            <b>&nbsp;Стадия соединения:</b>
          </p>
          <Box>
            <b>&nbsp;Состояние:</b>
          </Box>
        </Grid>
        <Grid item xs>
          <Box>Нет данных</Box>
          <p>Нет данных</p>
          <Box>Нет данных</Box>
        </Grid>
      </>
    );
  };

  const Col03Grid02 = () => {
    return (
      <>
        <Grid item xs={6.1}>
          <Box>
            <b>&nbsp;IP адрес GPRS:</b>
          </Box>
          <p>
            <b>&nbsp;Порт GPRS:</b>
          </p>
          <Box>
            <b>&nbsp;IP адрес LAN:</b>
          </Box>
          <p>
            <b>&nbsp;Порт LAN:</b>
          </p>
          <Box>
            <b>&nbsp;Канал связи:</b>
          </Box>
          <p>
            <b>&nbsp;Табло отсчёта:</b>
          </p>
        </Grid>
        <Grid item xs>
          <Box>092.255.180.080</Box>
          <p>1094</p>
          <Box>192.168.115.055</Box>
          <p>1094</p>
          <Box>LAN+GPRS</Box>
          <p>Авто</p>
        </Grid>
      </>
    );
  };

  const Col03Grid03 = () => {
    return (
      <>
        <Grid item xs={6.2}>
          <Box>
            <b>&nbsp;IP адрес:</b>
          </Box>
          <p>
            <b>&nbsp;Маска подсети:</b>
          </p>
          <Box>
            <b>&nbsp;Осн.шлюз:</b>
          </Box>
        </Grid>
        <Grid item xs>
          <Box>192.168.115.085</Box>
          <p>255.255.255.000</p>
          <Box>192.168.115.001</Box>
        </Grid>
        <p>
          <b>&nbsp;Получать адреса по DHCP: *</b>
        </p>
      </>
    );
  };

  const handleOpenModal = (nom: string) => {
    setOpenSet(true);
    setValue(nom);
  };

  const ConditionColGrid01 = () => {
    return (
      <Grid item xs={4}>
        <Stack direction="column">
          <Box>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '13.6vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('11')}>
                  <b>Информация</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col01Grid01 />
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginTop: 0.5 }}>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '25.6vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('12')}>
                  <b>Состояние</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col01Grid02 />
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginTop: 0.5 }}>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '21.5vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('14')}>
                  <b>Время</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col01Grid04 />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Grid>
    );
  };

  const ConditionColGrid02 = () => {
    return (
      <Grid item xs={4.15}>
        <Stack direction="column">
          <Box>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '34vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('21')}>
                  <b>GPRS</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col02Grid01 />
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginTop: 0.5 }}>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '13.5vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('22')}>
                  <b>LAN</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col02Grid02 />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Grid>
    );
  };

  const ConditionColGrid03 = () => {
    return (
      <Grid item xs>
        <Stack direction="column">
          <Box>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '43vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('32')}>
                  <b>Настр.УСДК</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col03Grid02 />
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginTop: 0.5 }}>
            <Grid container sx={styleBox01}>
              <Grid item xs sx={{ height: '18.5vh' }}>
                <Button sx={styleButt01} variant="contained" onClick={() => handleOpenModal('33')}>
                  <b>Настр.LAN</b>
                </Button>
                <Grid container sx={{ fontSize: fSize }}>
                  <Col03Grid03 />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Grid>
    );
  };

  const TopTab = () => {
    return (
      <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container sx={{ border: 0, height: '63vh' }}>
              <ConditionColGrid01 />
              <Grid item xs={0.05}></Grid>
              <ConditionColGrid02 />
              <Grid item xs={0.05}></Grid>
              <ConditionColGrid03 />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const BattomTab = () => {
    return (
      <Box sx={{ marginLeft: -3, marginRight: -3 }}>
        <Grid container sx={styleBox01}>
          <Grid item xs sx={{ height: '28.5vh' }}></Grid>
        </Grid>
      </Box>
    );
  };
  const ModalEnd = () => {
    const styleModalEnd = {
      position: 'absolute',
      top: '-3%',
      left: '91%',
      fontSize: 24,
      color: 'black',
    };

    return (
      <Button sx={styleModalEnd} onClick={handleCloseSetBut}>
        <b>&#10006;</b>
      </Button>
    );
  };

  const ModalWindow = (props: { nameComponent: () => JSX.Element }) => {
    const NameComp = props.nameComponent;
    return (
      <Modal open={openSet} onClose={handleCloseSet}>
        <Box sx={styleSet}>
          <ModalEnd />
          <Grid container sx={{ fontSize: 21 }}>
            <NameComp />
          </Grid>
        </Box>
      </Modal>
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

  return (
    <Stack direction="column">
      <TabContext value={value}>
        <TopTab />
        <BattomTab />

        <TabPanel value="11">
          <ModalWindow nameComponent={Col01Grid01} />
        </TabPanel>
        <TabPanel value="12">
          <ModalWindow nameComponent={Col01Grid02} />
        </TabPanel>
        <TabPanel value="14">
          <ModalWindow nameComponent={Col01Grid04} />
        </TabPanel>
        <TabPanel value="21">
          <ModalWindow nameComponent={Col02Grid01} />
        </TabPanel>
        <TabPanel value="22">
          <ModalWindow nameComponent={Col02Grid02} />
        </TabPanel>
        <TabPanel value="32">
          <ModalWindow nameComponent={Col03Grid02} />
        </TabPanel>
        <TabPanel value="33">
          <ModalWindow nameComponent={Col03Grid03} />
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default Condition;
