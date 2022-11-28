import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
} from "react-yandex-maps";

import MapRouteInfo from "./MapRouteInfo";

import { styleSetPoint, styleModalEnd, styleSetInf } from "./MainMapStyle";
import { styleApp01, styleModalEndMapGl, styleModalMenu } from "./MainMapStyle";
import { styleSet, styleInpKnop, styleSetAdress } from "./MainMapStyle";
import { styleBoxForm } from "./MainMapStyle";

import { Tflight } from "./../interfaceMAP.d";

export interface Pointer {
  ID: number;
  nameCoordinates: string;
  region: string;
  area: string;
  subarea: number;
}

let coordinates: Array<Array<number>> = [[]]; // массив координат
let nameCoordinates: Array<string> = []; // массив адресов
let dateCoordinates: Pointer[] = [];

let newCoordinates: Array<number> = []; // массив флагов новых координат
let chNewCoord = 1;

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = false;
let flagRoute = false;

let activeRoute: any;

let pointCenter: any = 0;
let pointCenterOld: any = 0;
let pointA: any = 0;
let pointAa: any = 0;
let pointB: any = 0;
let pointBb: any = 0;
let indexPoint: number = -1;
let pointAaIndex: number = -1;
let pointBbIndex: number = -1;
let soobError = "";

const MainMap = (props: { Y: number; X: number }) => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  //========================================================
  // инициализация
  if (!flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let masskPoint = {
        ID: 0,
        nameCoordinates: "",
        region: "",
        area: "",
        subarea: 0,
      };
      let mass = [0, 0];

      masskPoint.ID = dateMap[i].ID;
      masskPoint.nameCoordinates = dateMap[i].description;
      masskPoint.region = dateMap[i].region.num;
      masskPoint.area = dateMap[i].area.num;
      masskPoint.subarea = dateMap[i].subarea;
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;

      dateCoordinates.push(masskPoint);
      coordinates.push(mass);
      nameCoordinates.push(dateMap[i].description);
      newCoordinates.push(0);
    }
    //console.log('dateCoordinates:', dateCoordinates[75].nameCoordinates);
    coordinates.splice(0, 1);
    pointCenter = [props.Y, props.X];
    pointCenterOld = pointCenter;
    flagOpen = true;
  }
  //========================================================
  const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
    let coord0 = (aY - bY) / 2 + bY;
    if (aY < bY) coord0 = (bY - aY) / 2 + aY;
    let coord1 = (aX - bX) / 2 + bX;
    if (aX < bX) coord1 = (bX - aX) / 2 + aX;
    return [coord0, coord1];
  };

  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSetEr(false);
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
          <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
            {soobError}
          </Typography>
        </Box>
      </Modal>
    );
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 1: // создание/пересоздание маршрута
        if (pointAa === 0) {
          soobError = "Не задана начальная точка связи";
          setOpenSetEr(true);
          break;
        }
        if (pointBb === 0) {
          soobError = "Не задана конечная точка связи";
          setOpenSetEr(true);
          break;
        }
        pointA = pointAa;
        pointB = pointBb;
        flagRoute = true;
        //pointCenter = CenterCoord(pointA[0], pointA[1], pointB[0], pointB[1]);
        setSize(window.innerWidth + Math.random());
        break;
      case 12: // реверс маршрута
        let pa = pointA;
        pointA = pointB;
        pointB = pa;
        pa = pointAa;
        pointAa = pointBb;
        pointBb = pa;
        pa = pointAaIndex;
        pointAaIndex = pointBbIndex;
        pointBbIndex = pa;
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
    zoom,
    //autoFitToViewport: true,
    behaviors: ["default", "scrollZoom"],
    controls: [],
    yandexMapDisablePoiInteractivity: true,
  };

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const addRoute = (ymaps: any) => {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [pointAA, pointBB],
        },
        {
          routeActiveStrokeWidth: 8,
          //routeActiveStrokeStyle: "solid",
          routeActiveStrokeColor: "#002233",
          //strokeColor: "#1A9165",
          //strokeWidth: 3,
          //wayPointDraggable: true,
          //boundsAutoApply: true,
        }
      );

      let a1 = [55.66905717633201, 37.310525542995144];
      let a2 = 0;
      //let a2 = [55.66063590561984, 37.99270557405532];
      let aa2 = [55.66063590561984, 37.99270557405532];
      //let b1 = [55.66905717633201, 37.310525542995144];
      let b2 = 0;
      //let b2 = [55.905786101735075, 37.7174511711464];
      let bb2 = [55.905786101735075, 37.7174511711464];
      //let c1 = [55.66905717633201, 37.310525542995144];
      let c2 = 0;
      //let c2 = [55.5107277, 36.5991193];
      let cc2 = [55.5107277, 36.5991193];
      let cc3 = [55.6624641118057, 37.957228707381375];
      let cc4 = [55.619666267737934, 36.872059408819844];
      let cc5 = [55.498869044500154, 36.01740602058121];
      let cc6 = [55.65925403097865, 37.97630076469362];
      let cc7 = [55.98728647405042, 37.86819230289014];
      let cc8 = [55.92043329906329, 37.82242711889462];

      const multiRoute1 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, aa2],
      });
      const multiRoute2 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, bb2],
      });
      const multiRoute3 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc2],
      });
      const multiRoute4 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc3],
      });
      const multiRoute5 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc4],
      });
      const multiRoute6 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc5],
      });
      const multiRoute7 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc6],
      });
      const multiRoute8 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc7],
      });
      const multiRoute9 = new ymaps.multiRouter.MultiRoute({
        referencePoints: [a1, cc8],
      });

      // let Rout01 = new ymaps.Polyline(
      //   // Указываем координаты вершин ломаной.
      //   [a1, a2],
      //   // Содержимое балуна
      //   { balloonContent: "Ломаная линия" },
      //   {
      //     // Отключаем кнопку закрытия балуна
      //     balloonCloseButton: false,
      //     // Цвет линии
      //     strokeColor: "#1A9165",
      //     // Ширина линии
      //     strokeWidth: 3,
      //     // Коэффициент прозрачности.
      //     //strokeOpacity: 1,
      //   }
      // );
      // let Rout02 = new ymaps.Polyline(
      //   [b1, b2],
      //   { balloonContent: "Ломаная линия" },
      //   {
      //     balloonCloseButton: false,
      //     strokeColor: "#1A9165",
      //     strokeWidth: 3,
      //   }
      // );
      // let Rout03 = new ymaps.Polyline(
      //   [c1, c2],
      //   { balloonContent: "Ломаная линия" },
      //   {
      //     balloonCloseButton: false,
      //     strokeColor: "#1A9165",
      //     strokeWidth: 3,
      //   }
      // );

      // Добавляем линию на карту.
      // mapp.current.geoObjects.add(Rout01);
      // mapp.current.geoObjects.add(Rout02);
      // mapp.current.geoObjects.add(Rout03);

      
      mapp.current.geoObjects.add(multiRoute);
      mapp.current.geoObjects.add(multiRoute1);
      mapp.current.geoObjects.add(multiRoute2);
      mapp.current.geoObjects.add(multiRoute3);
      mapp.current.geoObjects.add(multiRoute4);
      mapp.current.geoObjects.add(multiRoute5);
      mapp.current.geoObjects.add(multiRoute6);
      mapp.current.geoObjects.add(multiRoute7);
      mapp.current.geoObjects.add(multiRoute8);
      mapp.current.geoObjects.add(multiRoute9);

      multiRoute.model.events.add("requestsuccess", function () {
        activeRoute = multiRoute.getActiveRoute();
      });
    };

    const getPointData = (index: number) => {
      let textBalloon = "";
      if (index === pointAaIndex) textBalloon = "НАЧАЛО";
      if (index === pointBbIndex) textBalloon = "КОНЕЦ";

      return {
        hintContent: nameCoordinates[index],
        //balloonContent: PressBalloon(index),
        iconCaption: textBalloon,
      };
    };

    const getPointOptions = (index: number) => {
      let colorBalloon = "islands#violetIcon";
      if (newCoordinates[index] > 0) colorBalloon = "islands#darkOrangeIcon";
      if (index === pointAaIndex) colorBalloon = "islands#redCircleDotIcon";
      if (index === pointBbIndex)
        colorBalloon = "islands#darkBlueCircleDotIcon";
      return {
        preset: colorBalloon,
      };
    };

    const OnPlacemarkClickPoint = (index: number) => {
      if (pointAa === 0) {
        pointAaIndex = index;
        pointAa = [coordinates[index][0], coordinates[index][1]];
        pointCenter = pointCenterOld;
        setSize(window.innerWidth + Math.random());
      } else {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            soobError = "Начальная и конечная точки совподают";
            setOpenSetEr(true);
          } else {
            pointBbIndex = index;
            pointBb = [coordinates[index][0], coordinates[index][1]];
            //pointCenter = CenterCoord(pointAa[0], pointAa[1], pointBb[0], pointBb[1]);
            pointCenter = pointCenterOld;
            setSize(window.innerWidth + Math.random());
          }
        } else {
          indexPoint = index;
          setOpenSet(true);
        }
      }
    };

    const [openSet, setOpenSet] = React.useState(false);
    const handleCloseSet = (event: any, reason: string) => {
      if (reason !== "backdropClick") setOpenSet(false);
    };

    const handleCloseSetBut = () => {
      setOpenSet(false);
    };

    const [openSetAdress, setOpenSetAdress] = React.useState(false);

    const InputAdress = () => {
      const [valuen, setValuen] = React.useState(nameCoordinates[indexPoint]);

      const handleKey = (event: any) => {
        if (event.key === "Enter") event.preventDefault();
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
                  <Box
                    component="form"
                    sx={styleBoxForm}
                    noValidate
                    autoComplete="off"
                  >
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
                  <Button
                    sx={styleInpKnop}
                    variant="contained"
                    onClick={handleCloseSetAdr}
                  >
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
            if (pointBbIndex === indexPoint) {
              soobError = "Начальная и конечная точки совподают";
              setOpenSetEr(true);
            } else {
              pointAaIndex = indexPoint;
              pointAa = [
                coordinates[indexPoint][0],
                coordinates[indexPoint][1],
              ];
              pointCenter = pointCenterOld;
            }
            break;
          case 2: // Конечная точка
            if (pointAaIndex === indexPoint) {
              soobError = "Начальная и конечная точки совподают";
              setOpenSetEr(true);
            } else {
              pointBbIndex = indexPoint;
              pointBb = [
                coordinates[indexPoint][0],
                coordinates[indexPoint][1],
              ];
              pointCenter = pointCenterOld;
            }
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
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Button
                sx={styleModalMenu}
                variant="contained"
                onClick={() => handleClose(3)}
              >
                <b>Удаление точки</b>
              </Button>
              <Button
                sx={styleModalMenu}
                variant="contained"
                onClick={() => setOpenSetAdress(true)}
              >
                <b>Редактирование адреса</b>
              </Button>
            </Box>

            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#5B1080" }}
            >
              Перестроение связи:
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <Button
                sx={styleModalMenu}
                variant="contained"
                onClick={() => handleClose(1)}
              >
                <b>Начальная точка</b>
              </Button>
              <Button
                sx={styleModalMenu}
                variant="contained"
                onClick={() => handleClose(2)}
              >
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
      nameCoordinates.push("Новая точка " + String(nomer));
      coordinates.push(coords);
      newCoordinates.push(1);
      //pointCenter = coords;
      chNewCoord++;
      setSize(window.innerWidth + Math.random());
    };

    return (
      <YMaps
        query={{
          apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
          lang: "ru_RU",
        }}
      >
        <Map
          modules={["multiRouter.MultiRoute", "Polyline"]}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              // нажата правая кнопка мыши
              mapp.current.events.add("contextmenu", function (e: any) {
                //console.log("mapp.current.hint", mapp.current.hint);
                let coords = e.get("coords");
                NewPoint(coords);
              });
              // нажата левая/правая кнопка мыши
              mapp.current.events.add("mousedown", function (e: any) {
                // 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
                let coords = e.get("coords");
                let typeClick = e.get("domEvent").originalEvent.button;
                //console.log("CLICK:", typeClick, coords);
                if (typeClick === 0) {
                  pointCenterOld = pointCenter;
                  pointCenter = coords;
                }
              });
              // нажато колёсико мыши
              mapp.current.events.add(["boundschange"], function () {
                //console.log("ZOOM:", mapp.current.getZoom());
                setZoom(mapp.current.getZoom());
              });
            }
          }}
          onLoad={addRoute}
          width={"99.8%"}
          height={"97%"}
        >
          {coordinates.map((coordinate, idx) => (
            <Placemark
              key={idx}
              geometry={coordinate}
              properties={getPointData(idx)}
              options={getPointOptions(idx)}
              modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
              onClick={() => OnPlacemarkClickPoint(idx)}
            />
          ))}
          <FullscreenControl />
          <GeolocationControl options={{ float: "left" }} />
          <RulerControl options={{ float: "right" }} />
          <SearchControl
            options={{
              float: "left",
              provider: "yandex#search",
              size: "large",
            }}
          />
          <TrafficControl options={{ float: "right" }} />
          <TypeSelector options={{ float: "right" }} />
          <ZoomControl options={{ float: "right" }} />
          {/* служебные компоненты */}
          <ModalPressBalloon />
          <PointDataError />
          {openSetInf && (
            <MapRouteInfo
              activeRoute={activeRoute}
              name1={nameCoordinates[pointAaIndex]}
              name2={nameCoordinates[pointBbIndex]}
              setOpen={setOpenSetInf}
            />
          )}
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
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  let soobButtonRoute = "Создать связь";
  if (flagRoute) soobButtonRoute = "Перестроить связь";

  return (
    <Grid container sx={{ border: 0, height: "99.5vh" }}>
      <Button
        sx={styleApp01}
        variant="contained"
        onClick={() => PressMenuButton(1)}
      >
        <b>{soobButtonRoute}</b>
      </Button>
      {!flagRoute && (
        <Button
          sx={styleApp01}
          variant="contained"
          onClick={() => PressMenuButton(77)}
        >
          <b>Отмена назначений</b>
        </Button>
      )}
      {flagRoute && (
        <>
          <Button
            sx={styleApp01}
            variant="contained"
            onClick={() => PressMenuButton(21)}
          >
            <b>Сохранить связь</b>
          </Button>
          <Button
            sx={styleApp01}
            variant="contained"
            onClick={() => PressMenuButton(77)}
          >
            <b>Отменить связь</b>
          </Button>
          <Button
            sx={styleApp01}
            variant="contained"
            onClick={() => PressMenuButton(12)}
          >
            <b>Реверс связи</b>
          </Button>
          <Button
            sx={styleApp01}
            variant="contained"
            onClick={() => PressMenuButton(69)}
          >
            <b>Информ о связи</b>
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
//
// instanceRef={(ref: any) => {
//   ref &&
// ref.events.add('balloonopen', () => {
//   PressBalloonBody(idx);
// });
// ref.events.add('mouseleave', function (e: any) {
//   console.log('P mouseleave:', chNewCoord);
//   chNewCoord++;
// });
// ref.events.add("mouseenter:", function (e: any) {
//   console.log("Placemark mouseenter:", chNewCoord);
//   chNewCoord++;
// });
// }}
