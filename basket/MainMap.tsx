import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  GeolocationControl,
  RulerControl,
  SearchControl,
  TrafficControl,
  TypeSelector,
  ZoomControl,
} from 'react-yandex-maps';

import { styleApp01, styleModalEnd, styleSetInf } from './MainMapStyle';
import { styleSetPoint, styleModalEndMapGl, styleModalMenu } from './MainMapStyle';
import { styleSet, styleInpKnop, styleSetAdress } from './MainMapStyle';
import { styleBoxForm } from './MainMapStyle';

import { Tflight } from './../interfaceMAP.d';

let coordinates: Array<Array<number>> = [[]]; // массив координат
let nameCoordinates: Array<string> = []; // массив адресов
let newCoordinates: Array<number> = []; // массив флагов новых координат
let chNewCoord = 1;

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = false;
let flagRoute = false;

let activeRoute: any;

let pointCenter: any = 0;
let pointA: any = 0;
let pointAa: any = 0;
let pointB: any = 0;
let pointBb: any = 0;
let indexPoint: number = -1;
let pointAaIndex: number = -1;
let pointBbIndex: number = -1;
let soobError = '';

// let dlRoute1 = '';
// let tmRoute1 = '';

const MainMap = () => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  //console.log('dateMap_Diagram:', dateMap);
  //========================================================

  //const mapp = React.useRef<any>(null);

  if (!flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      // if (i === 0) pointaa = mass;
      if (i === 0) pointCenter = mass;
      //if (i === 1) pointbb = mass;
      coordinates.push(mass);
      nameCoordinates.push(dateMap[i].description);
      newCoordinates.push(0);
    }
    coordinates.splice(0, 1);
    flagOpen = true;
  }

  const [openSetEr, setOpenSetEr] = React.useState(false);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSetEr(false);
  };

  const handleCloseSetEndEr = () => {
    setOpenSetEr(false);
  };

  const PointDataError = () => {
    return (
      <Modal open={openSetEr} onClose={handleCloseSetEr} hideBackdrop>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndEr}>
            <b>&#10006;</b>
          </Button>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>
            {soobError}
          </Typography>
        </Box>
      </Modal>
    );
  };

  const [openSetInf, setOpenSetInf] = React.useState(false);
  const handleCloseSetInf = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSetEr(false);
  };

  const handleCloseSetEndInf = () => {
    setOpenSetInf(false);
  };

  const RouteInfo = () => {
    let dlRoute1 = 0;
    let tmRoute1 = '';
    if (activeRoute) {
      dlRoute1 = Math.round(activeRoute.properties.get('distance').value);
      let tm = activeRoute.properties.get('duration').text;
      tmRoute1 = tm.substring(0, tm.length - 1);
    }
    return (
      <Modal open={openSetInf} onClose={handleCloseSetInf} hideBackdrop>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
            <b>&#10006;</b>
          </Button>
          <Box>
            <b>Начальная точка связи:</b>
            <br />
            {nameCoordinates[pointAaIndex]}
            <br />
            <b>Конечная точка связи:</b>
            <br />
            {nameCoordinates[pointBbIndex]}
            <br />
            <b>Длина связи: </b>
            {dlRoute1} м<br />
            <b>Время прохождения: </b>
            {tmRoute1}
            <br />
          </Box>
          {activeRoute && activeRoute.properties.get('blocked') && (
            <Box>Имеются участки с перекрытыми дорогами</Box>
          )}
        </Box>
      </Modal>
      // </>
    );
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 1: // создание/пересоздание маршрута
        if (pointAa === 0) {
          soobError = 'Не задана начальная точка связи';
          setOpenSetEr(true);
          break;
        }
        if (pointBb === 0) {
          soobError = 'Не задана конечная точка связи';
          setOpenSetEr(true);
          break;
        }
        pointA = pointAa;
        pointB = pointBb;

        flagRoute = true;
        setSize(window.innerWidth + Math.random());
        break;
      case 12: // реверс маршрута
        let pa = pointA;
        let pb = pointB;
        pointA = pb;
        pointB = pa;
        setSize(window.innerWidth + Math.random());
        break;
      case 69: // инфа о маршруте
        if (activeRoute) setOpenSetInf(true);
        break;
      case 77: // удаление маршрута
        pointA = 0;
        pointB = 0;
        pointAa = 0;
        pointBb = 0;
        pointAaIndex = -1;
        pointBbIndex = -1;
        flagRoute = false;
        setSize(window.innerWidth + Math.random());
    }
  };

  const [zoom, setZoom] = React.useState<number>(9.5);

  const mapState = {
    center: pointCenter,
    //zoom: 9.5,
    zoom,
    //autoFitToViewport: true,
    controls: [],
  };

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    //const [zoom, setZoom] = React.useState<number>(18);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const addRoute = (ymaps: any) => {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [pointAA, pointBB],
        },
        {
          //wayPointDraggable: true,
          //boundsAutoApply: true,
        },
      );

      multiRoute.model.events.add('requestsuccess', function () {
        activeRoute = multiRoute.getActiveRoute();
      });
      mapp.current.geoObjects.add(multiRoute);
    };

    // const PressBalloon = (index: number) => {
    //   return 'Это балун ' + (index + 1);
    // };

    const getPointData = (index: number) => {
      return {
        hintContent: nameCoordinates[index],
        //balloonContent: PressBalloon(index),
        //iconCaption: '',
      };
    };

    const getPointOptions = (index: number) => {
      let colorBalloon = 'islands#violetIcon';
      if (newCoordinates[index] > 0) colorBalloon = 'islands#darkOrangeIcon';
      if (index === pointAaIndex) colorBalloon = 'islands#redCircleDotIcon';
      if (index === pointBbIndex) colorBalloon = 'islands#darkBlueCircleDotIcon';
      return {
        preset: colorBalloon,
      };
    };

    // const PressBalloonBody = (index: number) => {
    //   console.log('Кликнули по точке ', index + 1);
    // };

    // const OnPlacemarkClick = (e: any, index: number) => {
    //   console.log('click:', e, index)
    //   if (index >= 0) {
    //     indexPoint = index;
    //     setOpenSet(true);
    //   }
    // };

    const OnPlacemarkClickPoint = (index: number) => {
      console.log('click:', index);
      if (pointAa) {
        pointAaIndex = index;
        pointAa = [coordinates[indexPoint][0], coordinates[indexPoint][1]];
      }
    };

    const [openSet, setOpenSet] = React.useState(false);
    const handleCloseSet = (event: any, reason: string) => {
      if (reason !== 'backdropClick') setOpenSet(false);
    };

    const handleCloseSetBut = () => {
      setOpenSet(false);
    };

    const [openSetAdress, setOpenSetAdress] = React.useState(false);

    const InputAdress = () => {
      //const [openSetAdress, setOpenSetAdress] = React.useState(false);
      const [valuen, setValuen] = React.useState(nameCoordinates[indexPoint]);

      const handleKey = (event: any) => {
        if (event.key === 'Enter') event.preventDefault();
      };

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValuen(event.target.value);
      };

      const handleCloseSetAdr = () => {
        nameCoordinates[indexPoint] = valuen;
        setOpenSetAdress(false);
      };

      return (
        <Box>
          <Modal open={openSetAdress} onClose={handleCloseSetAdr} hideBackdrop>
            <Grid item container sx={styleSetAdress}>
              <Grid item xs={9.5} sx={{ border: 0 }}>
                <Box sx={styleSet}>
                  <Box component="form" sx={styleBoxForm} noValidate autoComplete="off">
                    <TextField
                      size="small"
                      onKeyPress={handleKey} //отключение Enter
                      inputProps={{ style: { fontSize: 13.3 } }}
                      value={valuen}
                      onChange={handleChange}
                      variant="standard"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs sx={{ border: 0 }}>
                <Box>
                  <Button sx={styleInpKnop} variant="contained" onClick={handleCloseSetAdr}>
                    Ввод
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Modal>
        </Box>
      );
    };

    const ModalPressBalloon = () => {
      const handleClose = (param: number) => {
        switch (param) {
          case 1: // Начальная точка
            pointAaIndex = indexPoint;
            pointAa = [coordinates[indexPoint][0], coordinates[indexPoint][1]];
            break;
          case 2: // Конечная точка
            pointBbIndex = indexPoint;
            pointBb = [coordinates[indexPoint][0], coordinates[indexPoint][1]];
            break;
          case 3: // Удаление точки
            coordinates.splice(indexPoint, 1);
            nameCoordinates.splice(indexPoint, 1);
            newCoordinates.splice(indexPoint, 1);
        }
        setOpenSet(false);
      };

      return (
        <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEndMapGl} onClick={handleCloseSetBut}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Button sx={styleModalMenu} variant="contained" onClick={() => handleClose(3)}>
                <b>Удаление точки</b>
              </Button>
              <Button
                sx={styleModalMenu}
                variant="contained"
                onClick={() => setOpenSetAdress(true)}>
                <b>Редактирование адреса</b>
              </Button>
            </Box>

            <Typography variant="h6" sx={{ textAlign: 'center', color: '#5B1080' }}>
              Создание новой связи:
            </Typography>
            <br />
            <Box sx={{ textAlign: 'center' }}>
              <Button sx={styleModalMenu} variant="contained" onClick={() => handleClose(1)}>
                <b>Начальная точка</b>
              </Button>
              <Button sx={styleModalMenu} variant="contained" onClick={() => handleClose(2)}>
                <b>Конечная точка</b>
              </Button>
            </Box>
            {openSetAdress && <InputAdress />}
          </Box>
        </Modal>
      );
    };

    const NewPoint = (coords: any) => {
      let nomer = chNewCoord;
      nameCoordinates.push('Новая точка ' + String(nomer));
      coordinates.push(coords);
      newCoordinates.push(1);
      pointCenter = coords;
      chNewCoord++;
      setSize(window.innerWidth + Math.random());
    };

    const OnClickKnopMouse = (typeClick: number, coords: any, e: any) => {
      console.log('CLICK:', typeClick, coords);
      switch (typeClick) {
        case 0: // левая кнопка
          pointCenter = coords;
          break;
        case 2:
          console.log('Правая');
        //OnPlacemarkClick(e, 1)
        // let nomer = chNewCoord;
        // coordinates.push(coords);
        // newCoordinates.push(1);
        // pointCenter = coords;
        // chNewCoord++;
        // setSize(window.innerWidth + Math.random());
        //NewPoint(coords);
      }
    };

    return (
      <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
        <Map
          modules={[
            'multiRouter.MultiRoute',
            //'geocode', 'geoObject.addon.balloon', 'geoObject.addon.hint'
          ]}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              // нажата правая кнопка мыши
              mapp.current.events.add('contextmenu', function (e: any) {
                console.log('mapp.current.hint');
                let coords = e.get('coords');
                //OnPlacemarkClick(e, 1)
                NewPoint(coords);
              });
              // нажата левая кнопка мыши
              mapp.current.events.add('mousedown', function (e: any) {
                console.log('mousedown:');
                // 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
                let coords = e.get('coords');
                if (e.get('domEvent').originalEvent.button === 0) pointCenter = coords;
                OnClickKnopMouse(e.get('domEvent').originalEvent.button, coords, e);
              });

              mapp.current.events.add(['boundschange'], function () {
                console.log('boundschange');
                setZoom(mapp.current.getZoom());
              });
            }

            mapp.current.add('mouseleave', function (e: any) {
              console.log('mouseleave:', chNewCoord);
              chNewCoord++;
            });
            // ref.events.add('Placemark mouseenter:', function (e: any) {
            //   console.log('Placemark mouseenter:', chNewCoord);
            //   chNewCoord++;
            // });
          }}
          onLoad={addRoute}
          //onClick={(e: any) => OnPlacemarkClick(e, -1)}
          width={'99.8%'}
          height={'97%'}>
          {coordinates.map((coordinate, idx) => (
            <Placemark
              key={idx}
              geometry={coordinate}
              properties={getPointData(idx)}
              options={getPointOptions(idx)}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              onClick={() => OnPlacemarkClickPoint(idx)}
              // instanceRef={(ref: any) => {
              //   ref &&
              //     ref.events.add('balloonopen', () => {
              //       PressBalloonBody(idx);
              //     });
              // }}
            />
          ))}
          <FullscreenControl />
          <GeolocationControl options={{ float: 'left' }} />
          <RulerControl options={{ float: 'right' }} />
          <SearchControl
            options={{
              float: 'left',
              provider: 'yandex#search',
              size: 'large',
            }}
          />
          <TrafficControl options={{ float: 'right' }} />
          <TypeSelector options={{ float: 'right' }} />
          <ZoomControl options={{ float: 'right' }} />
          {/* служебные компоненты */}
          <ModalPressBalloon />
          <PointDataError />
          <RouteInfo />
        </Map>
      </YMaps>
    );
  };

  //отслеживание изменения размера экрана - костыль, делает ререндер
  const [size, setSize] = React.useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  let soobButtonRoute = 'Создать связь';
  if (flagRoute) soobButtonRoute = 'Перестроить связь';

  return (
    <Grid container sx={{ border: 0, height: '99.5vh' }}>
      <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(1)}>
        <b>{soobButtonRoute}</b>
      </Button>
      {flagRoute && (
        <>
          <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(12)}>
            <b>Реверс связи</b>
          </Button>
          <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(77)}>
            <b>Удалить связь</b>
          </Button>
          <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(69)}>
            <b>Информ о связе</b>
          </Button>
        </>
      )}
      <MapGl pointa={pointA} pointb={pointB} />
    </Grid>
  );
};

export default MainMap;

//https://yandex.ru/dev/maps/jsbox/2.1/event_properties/

//https://github.com/gribnoysup/react-yandex-maps/issues/255

// вычисление координат середины связи
// let coord0 = ((pointA[0] - pointB[0]) / 2) + pointB[0]
// if (pointA[0] < pointB[0]) coord0 = ((pointB[0] - pointA[0]) / 2) + pointA[0]
// let coord1 = ((pointA[1] - pointB[1]) / 2) + pointB[1]
// if (pointA[1] < pointB[1]) coord1 = ((pointB[1] - pointA[1]) / 2) + pointA[1]
// pointCenter[0] = coord0;
// pointCenter[1] = coord1;

// mapp.current.events.add('click', function (e: any) {
//   if (!mapp.current.balloon.isOpen()) {
//     let coords = e.get('coords');
//     pointCenter = coords;
//     mapp.current.balloon.open(coords, {
//       //contentHeader: 'Событие!',
//       contentBody:
//         '<p>Центр карты после Zoom</p>' +
//         '<p>Координаты точки: <b>' +
//         [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ') +
//         '</b></p>',
//       // contentFooter: '<sup>Повторно нажите левую кнопку</sup>',
//     });
//   } else {
//     mapp.current.balloon.close();
//   }
// });
//
// ref.events.add('mouseleave', function (e: any) {
//   console.log('mouseleave:', chNewCoord);
//   chNewCoord++;
// });
// ref.events.add('Placemark mouseenter:', function (e: any) {
//   console.log('Placemark mouseenter:', chNewCoord);
//   chNewCoord++;
// });
// if (mapp.current.hint) {
//   if (!mapp.current.hint.isOpen()) {
//     let coords = e.get('coords');
//     NewPoint(coords);
// mapp.current.hint.open(
//   e.get('coords'),
//   '<p>Создана новая точка</p>' +
//     '<p>Координаты: <b>' +
//     [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(', ') +
//     '</b></p>' +
//     '<p>Повторно нажите правую кнопку</p>',
// );
//mapp.current.hint.close();
// }
//  else {
//mapp.current.hint.close();
//   if (openHint) {
//     console.log('закрытие hint');

//     setSize(window.innerWidth + Math.random());
//   }
//   setOpenHint(false);
//   }
// }
