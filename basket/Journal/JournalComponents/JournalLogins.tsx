import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

import axios from 'axios';

import { styleXt04, styleXTG02, styleXTG021, styleXTG03, styleXTG033 } from './JournalLoginsStyle';
import { styleXTG04, styleXTG044, styleInpKnop, styleBut01, styleSet } from './JournalLoginsStyle';
import { styleResetMin, styleResetMax, styleServis, styleServisKnop } from './JournalLoginsStyle';

export interface LogMessage {
  logData: LogDatum[];
  message: string;
}

export interface LogDatum {
  message: string;
}

export interface DataMess {
  mess: Line[];
}

export interface Line {
  num: number;
  pnum: number;
  type: string;
  time: string;
  info: string;
  haveError: boolean;
}

//let flagSbros = true;

let oldData = '-1';
let formSett = '';

let massPoints: Array<Line> = [];

const JournalLogins = (props: { logName: string }) => {
  const [size, setSize] = React.useState(0);
  let fSize = 10;
  if (size > 950) fSize = 13.3;

  if (oldData !== props.logName) {
    oldData = props.logName;
    //flagSbros = true;
  }

  let resStr: any = [];

  const HeaderLogins = () => {
    return (
      <Box sx={{ borderRadius: 1, backgroundColor: '#C0C0C0' }}>
        <Grid item container xs={12}>
          <Grid item xs={1.5} sx={styleXTG021}>
            <Button sx={styleBut01} variant="contained" onClick={() => setValue(1)}>
              <b>Тип</b>
            </Button>
          </Grid>
          <Grid item xs={1} sx={styleXTG02}>
            <Button sx={styleBut01} variant="contained" onClick={() => setValue(2)}>
              <b>Время</b>
            </Button>
          </Grid>
          <Grid item xs={9.5} sx={styleXTG021}>
            <b>Сообщение</b>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const StrokaLogins = () => {
    resStr = [];

    for (let i = 0; i < massPoints.length; i++) {
      resStr.push(
        <Grid key={Math.random()} item container xs={12}>
          <Grid
            key={Math.random()}
            item
            xs={1.5}
            sx={massPoints[i].haveError ? styleXTG044 : styleXTG04}>
            <b>{massPoints[i].type}</b>
          </Grid>
          <Grid
            key={Math.random()}
            item
            xs={1}
            sx={massPoints[i].haveError ? styleXTG033 : styleXTG03}>
            <b>{massPoints[i].time}</b>
          </Grid>
          <Grid
            key={Math.random()}
            item
            xs={9.5}
            sx={massPoints[i].haveError ? styleXTG044 : styleXTG04}>
            <b>{massPoints[i].info}</b>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const TabsLogins = (valueSort: number) => {
    switch (valueSort) {
      case 1:
        // сортировка по type
        massPoints.sort((a, b) => a.num - b.num);
        break;
      case 2:
        // сортировка по time
        massPoints.sort((a, b) => a.pnum - b.pnum);
        break;
      case 3:
        // поиск в сообщениях
        let masrab: Array<Line> = [];
        for (let i = 0; i < massPoints.length; i++) {
          let str = massPoints[i].info.toUpperCase();
          if (str.indexOf(formSett.toUpperCase()) !== -1) {
            masrab.push(massPoints[i]);
          }
        }
        massPoints = [];
        massPoints = masrab;
        break;
      case 4:
        // сброс
        MakeMassPoints();
        setValue(2);
        formSett = '';
        fSize = 10;
        if (window.innerWidth > 950) fSize = 13.3;
        break;
    }
  };

  const MakeMassPoints = () => {
    //console.log('MakeMassPoint:', isRead);
    let oldTime = '';
    massPoints = [];
    for (let i = 0; i < points.length; i++) {
      maskPoints = [
        {
          num: 0,
          pnum: i,
          type: '',
          time: '',
          info: '',
          haveError: false,
        },
      ];
      switch (points[i].message.slice(0, 1)) {
        case 'I':
          maskPoints[0].type = 'Информация';
          maskPoints[0].haveError = false;
          maskPoints[0].num = 0;
          break;
        case 'D':
          maskPoints[0].type = 'Отладка';
          maskPoints[0].haveError = false;
          maskPoints[0].num = 1;
          break;
        case 'E':
          maskPoints[0].type = 'Ошибка';
          maskPoints[0].haveError = true;
          maskPoints[0].num = 2;
          break;
        default:
          maskPoints[0].type = 'Разное';
          maskPoints[0].haveError = true;
          maskPoints[0].num = 3;
      }
      if (maskPoints[0].num !== 3) {
        maskPoints[0].time = points[i].message.slice(20, 28);
        oldTime = maskPoints[0].time;
        maskPoints[0].info = points[i].message.slice(29);
      } else {
        maskPoints[0].time = oldTime;
        maskPoints[0].info = points[i].message;
      }
      massPoints.push(maskPoints[0]);
      setIsRead(false);
    }
  };

  const WindSearsh = () => {
    return (
      <Box sx={styleServis}>
        <Button sx={styleServisKnop} variant="contained" onClick={handleOpenSet}>
          <b>Поиск</b>
        </Button>
        <Modal open={openSet} disableEnforceFocus onClose={handleCloseSet}>
          <Box sx={styleSet}>
            <Box
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '40ch' } }}
              noValidate
              autoComplete="off">
              <InpForm />
            </Box>
            <Button sx={styleInpKnop} variant="contained" onClick={setFind}>
              <b>Найти</b>
            </Button>
          </Box>
        </Modal>
      </Box>
    );
  };

  const [points, setPoints] = React.useState<Array<LogDatum>>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isRead, setIsRead] = React.useState(false);
  const [value, setValue] = React.useState(2);
  let maskPoints: Array<Line> = [
    {
      num: 0,
      pnum: 0,
      type: '',
      time: '',
      info: '',
      haveError: false,
    },
  ];

  const ipAdress: string = 'http://localhost:3000/otlmess.json';
  //const ipAdress: string = window.location.href + '/info?fileName=' + props.logName;

  React.useEffect(() => {
    axios.get(ipAdress).then(({ data }) => {
      console.log('data:', data);
      setPoints(data.logData);
      setIsRead(true);
    });
    setIsOpen(true);
    setValue(2);
  }, [ipAdress, props.logName]);

  const [openSet, setOpenSet] = React.useState(false);
  const handleOpenSet = () => setOpenSet(true);

  const handleCloseSet = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSet(false);
  };

  const setFind = () => {
    setOpenSet(false);
    setValue(3);
  };

  const InpForm = () => {
    const [valuen, setValuen] = React.useState(formSett);

    const handleChange = (event: any) => {
      setValuen(event.target.value);
      formSett = event.target.value;
    };

    const handleKey = (event: any) => {
      if (event.key === 'Enter') event.preventDefault();
    };

    return (
      <TextField
        size="small"
        onKeyPress={handleKey} //отключение Enter
        inputProps={{ style: { fontSize: 14 } }} // font size of input text
        InputLabelProps={{ style: { fontSize: 14 } }} // font size of input label
        value={valuen}
        onChange={handleChange}
        variant="outlined"
      />
    );
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

  //if (isOpen && isRead) MakeMassPoints();

  if (isOpen) {
    if (isRead) MakeMassPoints();
    TabsLogins(value);
    StrokaLogins();
  }

  return (
    <Box sx={{ fontSize: fSize, marginTop: -2.4, marginLeft: -3.0, marginRight: -1.5 }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ marginRight: -1.5 }}>
            <Grid container>
              <Grid item xs={12} sx={styleXt04}>
                <Box>
                  <Button
                    sx={fSize === 10 ? styleResetMin : styleResetMax}
                    variant="contained"
                    onClick={() => setValue(4)}>
                    <b>Сброс настроек</b>
                  </Button>
                </Box>
                <WindSearsh />
                <HeaderLogins />
                <Box sx={{ overflowX: 'auto', height: '81.2vh' }}>
                  <Grid container item>
                    {resStr}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalLogins;
