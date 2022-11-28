import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { YMaps, Map, Placemark, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import MapRouteInfo from "./MapComponents/MapRouteInfo";
import MapInputAdress from "./MapComponents/MapInputAdress";
import MapPointDataError from "./MapComponents/MapPointDataError";
import MapRouteBind from "./MapComponents/MapRouteBind";
import MapCreatePointVertex from "./MapComponents/MapCreatePointVertex";

import { RecordMassRoute, SocketDeleteWay } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord } from "./MapServiceFunctions";
import { getMultiRouteOptions, DoublRoute } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoord } from "./MapServiceFunctions";
import { getMassPolyRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteInOptions } from "./MapServiceFunctions";
import { getPointData, getPointOptions } from "./MapServiceFunctions";
import { SendSocketCreatePoint } from "./MapServiceFunctions";
import { SendSocketCreateVertex } from "./MapServiceFunctions";
import { SendSocketDeletePoint } from "./MapServiceFunctions";
import { SendSocketDeleteVertex } from "./MapServiceFunctions";
import { SendSocketCreateWay } from "./MapServiceFunctions";
import { SendSocketCreateWayFromPoint } from "./MapServiceFunctions";
import { SendSocketCreateWayToPoint } from "./MapServiceFunctions";

import { styleSetPoint, styleTypography, searchControl } from "./MainMapStyle";
import { styleApp01, styleModalEndMapGl, styleModalMenu } from "./MainMapStyle";

import { Pointer } from "./../App";

let coordinates: Array<Array<number>> = []; // массив координат
let coordStart: any = []; // рабочий массив коллекции входящих связей
let coordStop: any = []; // рабочий массив коллекции входящих связей
let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
let massRoute: any = []; // рабочий массив сети связей

let debugging = false;
let flagOpen = false;
let flagBind = false;
let activeRoute: any;
let newPointCoord: any = 0;
let soobError = "";
//let openSet = false;

let zoom = 10;
let homeRegion = 0;
let pointCenter: any = 0;
let indexPoint: number = -1;

let pointAa: any = 0;
let pointAaIndex: number = -1;
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};

let pointBb: any = 0;
let pointBbIndex: number = -1;
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};

const MainMap = (props: { ws: WebSocket; region: any }) => {
  const WS = props.ws;
  if (WS.url === "wss://localhost:3000/W") debugging = true;
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //===========================================================
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [flagDemo, setFlagDemo] = React.useState(false);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [flagRoute, setFlagRoute] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  // const setOpenSet = (mode: boolean) => {
  //   openSet = mode;
  // }
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(massroute).length) {
    if (props.region) homeRegion = props.region;
    if (!props.region && massroute.vertexes.length)
      homeRegion = massroute.vertexes[0].region;
    for (let i = 0; i < massroute.points.length; i++) {
      massroute.vertexes.push(massroute.points[i]);
    }
    for (let i = 0; i < massroute.vertexes.length; i++) {
      let masskPoint: Pointer = {
        ID: -1,
        coordinates: [],
        nameCoordinates: "",
        region: 0,
        area: 0,
        newCoordinates: 0,
      };
      masskPoint.ID = massroute.vertexes[i].id;
      masskPoint.coordinates = DecodingCoord(massroute.vertexes[i].dgis);
      masskPoint.nameCoordinates = massroute.vertexes[i].name;
      masskPoint.region = massroute.vertexes[i].region;
      masskPoint.area = massroute.vertexes[i].area;
      masskPoint.newCoordinates = 0;
      massdk.push(masskPoint);
      coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
    }
    pointCenter = CenterCoord(
      map.dateMap.boxPoint.point0.Y,
      map.dateMap.boxPoint.point0.X,
      map.dateMap.boxPoint.point1.Y,
      map.dateMap.boxPoint.point1.X
    );
    flagOpen = true;
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
  }
  //========================================================
  const DelCollectionRoutes = () => {
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
  };

  const ZeroRoute = (mode: boolean) => {
    pointAa = 0;
    pointBb = 0;
    pointAaIndex = -1;
    pointBbIndex = -1;
    DelCollectionRoutes();
    flagBind = false;
    setFlagRoute(false);
    setFlagPusk(mode);
  };

  const ChangeCross = () => {
    let cross: any = {
      Region: "",
      Area: "",
      ID: 0,
      Cod: "",
    };
    cross.Region = fromCross.pointAaRegin;
    cross.Area = fromCross.pointAaArea;
    cross.ID = fromCross.pointAaID;
    cross.Cod = fromCross.pointAcod;
    fromCross.pointAaRegin = toCross.pointBbRegin;
    fromCross.pointAaArea = toCross.pointBbArea;
    fromCross.pointAaID = toCross.pointBbID;
    fromCross.pointAcod = toCross.pointBcod;
    toCross.pointBbRegin = cross.Region;
    toCross.pointBbArea = cross.Area;
    toCross.pointBbID = cross.ID;
    toCross.pointBcod = cross.Cod;
  };

  const SoobOpenSetEr = (soob: string) => {
    soobError = soob;
    setOpenSetEr(true);
  };

  const MakeRecordMassRoute = (mode: boolean) => {
    let aRou = activeRoute;

    fromCross.pointAcod = CodingCoord(pointAa);
    toCross.pointBcod = CodingCoord(pointBb);
    if (DoublRoute(massroute.ways, pointAa, pointBb)) {
      SoobOpenSetEr("Дубликатная связь");
    } else {
      massroute.ways.push(RecordMassRoute(fromCross, toCross, activeRoute));
      if (massroute.vertexes[pointAaIndex].area === 0) {
        SendSocketCreateWayFromPoint(debugging, WS, fromCross, toCross, aRou);
      } else {
        if (massroute.vertexes[pointBbIndex].area === 0) {
          SendSocketCreateWayToPoint(debugging, WS, fromCross, toCross, aRou);
        } else {
          SendSocketCreateWay(debugging, WS, fromCross, toCross, activeRoute);
        }
      }
    }
    ZeroRoute(mode);
  };

  const MakeСollectionRoute = () => {
    for (let i = 0; i < massroute.ways.length; i++) {
      if (massroute.ways[i].starts === CodingCoord(pointAa)) {
        coordStop.push(DecodingCoord(massroute.ways[i].stops)); // исходящие связи
        coordStart.push(pointAa);
      }
      if (massroute.ways[i].stops === CodingCoord(pointAa)) {
        coordStartIn.push(DecodingCoord(massroute.ways[i].starts)); // входящие связи
        coordStopIn.push(pointAa);
      }
    }
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        massRoute = massroute.ways;
        setFlagDemo(true);
        break;
      case 6: // режим отмены Demo сети связей
        massRoute = [];
        setFlagDemo(false);
        break;
      case 12: // реверс связи
        let pa = pointAa;
        pointAa = pointBb;
        pointBb = pa;
        pa = pointAaIndex;
        pointAaIndex = pointBbIndex;
        pointBbIndex = pa;
        ChangeCross();
        DelCollectionRoutes();
        MakeСollectionRoute();
        setTrigger(!trigger);
        break;
      case 21: // сохранение связи
        MakeRecordMassRoute(false);
        break;
      case 33: // привязка направлений
        flagBind = true;
        setOpenSetBind(true);
        break;
      case 69: // инфа о связе
        if (activeRoute) setOpenSetInf(true);
        break;
      case 77: // удаление связи
        ZeroRoute(false);
    }
  };

  let mapState: any = {
    center: pointCenter,
    zoom,
    yandexMapDisablePoiInteractivity: true,
  };
  //========================================================
  const MapGl = () => {
    const mapp = React.useRef<any>(null);
    const [openSet, setOpenSet] = React.useState(false);
    const [openSetCreate, setOpenSetCreate] = React.useState(false);
    const [openSetAdress, setOpenSetAdress] = React.useState(false);
 
    const addRoute = (ymaps: any) => {
      if (ymaps) {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(pointAa, pointBb),
          getMultiRouteOptions()
        );
        let massPolyRoute: any = []; // cеть связей
        for (let i = 0; i < massRoute.length; i++) {
          massPolyRoute[i] = new ymaps.Polyline(
            [
              DecodingCoord(massRoute[i].starts),
              DecodingCoord(massRoute[i].stops),
            ],
            { balloonContent: "Ломаная линия" },
            getMassPolyRouteOptions()
          );
          mapp.current.geoObjects.add(massPolyRoute[i]);
        }

        let massMultiRoute: any = []; // исходящие связи
        for (let i = 0; i < coordStart.length; i++) {
          massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
            getReferencePoints(coordStart[i], coordStop[i]),
            getMassMultiRouteOptions()
          );
          mapp.current.geoObjects.add(massMultiRoute[i]);
        }
        let massMultiRouteIn: any = []; // входящие связи
        for (let i = 0; i < coordStartIn.length; i++) {
          massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
            getReferencePoints(coordStartIn[i], coordStopIn[i]),
            getMassMultiRouteInOptions()
          );
          mapp.current.geoObjects.add(massMultiRouteIn[i]);
        }
        mapp.current.geoObjects.add(multiRoute); // основная связь
        multiRoute.model.events.add("requestsuccess", function () {
          activeRoute = multiRoute.getActiveRoute();
        });
      }
    };

    // const AddRoute = (ymaps: any) => {
    //   React.useMemo(() => {
    //     addRoute(ymaps);
    //   }, [ymaps]);
    // };

    const OnPlacemarkClickPoint = (index: number) => {
      if (pointAa === 0) {
        pointAaIndex = index; // начальная точка
        pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
        fromCross.pointAaRegin = massdk[index].region.toString();
        fromCross.pointAaArea = massdk[index].area.toString();
        fromCross.pointAaID = massdk[index].ID;
        MakeСollectionRoute();
        setFlagPusk(true);
      } else {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            SoobOpenSetEr("Начальная и конечная точки совпадают");
          } else {
            pointBbIndex = index; // конечная точка
            if (
              massroute.vertexes[pointAaIndex].area === 0 &&
              massroute.vertexes[pointBbIndex].area === 0
            ) {
              pointBbIndex = 0; // конечная точка
              SoobOpenSetEr("Связь между двумя точками создовать нельзя");
            } else {
              pointBb = [
                massdk[index].coordinates[0],
                massdk[index].coordinates[1],
              ];
              toCross.pointBbRegin = massdk[index].region.toString();
              toCross.pointBbArea = massdk[index].area.toString();
              toCross.pointBbID = massdk[index].ID;
              if (DoublRoute(massroute.ways, pointAa, pointBb)) {
                SoobOpenSetEr("Дубликатная связь");
                ZeroRoute(false);
              } else {
                setFlagRoute(true);
              }
            }
          }
        } else {
          indexPoint = index;
          setOpenSet(true); // в меню работы с точками
        }
      }
    };

    const ModalPressBalloon = () => {
      const [openSetErBall, setOpenSetErBall] = React.useState(false);
      let pointRoute: any = 0;
      let soobDel = "Удаление точки";
      if (indexPoint >= 0 && indexPoint < massdk.length) {
        if (massdk[indexPoint].area) soobDel = "Удаление перекрёстка";
        pointRoute = [
          massdk[indexPoint].coordinates[0],
          massdk[indexPoint].coordinates[1],
        ];
      }

      const handleClose = (param: number) => {
        switch (param) {
          case 1: // Начальная точка
            if (pointBbIndex === indexPoint) {
              soobError = "Начальная и конечная точки совпадают";
              setOpenSetErBall(true);
            } else {
              pointAaIndex = indexPoint;
              pointAa = pointRoute;
              fromCross.pointAaRegin = massdk[pointAaIndex].region.toString();
              fromCross.pointAaArea = massdk[pointAaIndex].area.toString();
              fromCross.pointAaID = massdk[pointAaIndex].ID;
              DelCollectionRoutes();
              MakeСollectionRoute();
              setOpenSet(false);
              setTrigger(!trigger);
            }
            break;
          case 2: // Конечная точка
            if (pointAaIndex === indexPoint) {
              soobError = "Начальная и конечная точки совпадают";
              setOpenSetErBall(true);
            } else {
              if (
                massroute.vertexes[pointAaIndex].area === 0 &&
                massroute.vertexes[indexPoint].area === 0
              ) {
                SoobOpenSetEr("Связь между двумя точками создовать нельзя");
              } else {
                pointBbIndex = indexPoint;
                pointBb = pointRoute;
                toCross.pointBbRegin = massdk[pointBbIndex].region.toString();
                toCross.pointBbArea = massdk[pointBbIndex].area.toString();
                toCross.pointBbID = massdk[pointBbIndex].ID;
                if (DoublRoute(massroute.ways, pointAa, pointBb)) {
                  SoobOpenSetEr("Дубликатная связь");
                }
                setOpenSet(false);
                setTrigger(!trigger);
              }
            }
            break;
          case 3: // Удаление точки
            if (pointAaIndex === indexPoint || pointBbIndex === indexPoint) {
              soobError = "Начальную и конечную точки связи удалять нельзя";
              setOpenSetErBall(true);
            } else {
              let massRouteRab: any = []; // удаление из массива сети связей
              let coordPoint = massroute.vertexes[indexPoint].dgis;
              let idPoint = massroute.vertexes[indexPoint].id;
              let regionV = massroute.vertexes[indexPoint].region.toString();
              let areaV = massroute.vertexes[indexPoint].area.toString();
              for (let i = 0; i < massroute.ways.length; i++) {
                if (
                  coordPoint !== massroute.ways[i].starts &&
                  coordPoint !== massroute.ways[i].stops
                ) {
                  massRouteRab.push(massroute.ways[i]);
                } else {
                  SocketDeleteWay(debugging, WS, massroute.ways[i]);
                }
              }
              massroute.ways.splice(0, massroute.ways.length); // massroute = [];
              massroute.ways = massRouteRab;
              if (flagDemo) massRoute = massroute.ways;
              DelCollectionRoutes(); // удаление колекции связей
              massdk.splice(indexPoint, 1); // удаление самой точки
              massroute.vertexes.splice(indexPoint, 1);
              dispatch(massdkCreate(massdk));
              dispatch(massrouteCreate(massroute));
              let oldPointAa = coordinates[pointAaIndex];
              let oldPointBb = coordinates[pointBbIndex];
              coordinates.splice(indexPoint, 1);
              for (let i = 0; i < coordinates.length; i++) {
                if (coordinates[i] === oldPointAa) pointAaIndex = i;
                if (coordinates[i] === oldPointBb) pointBbIndex = i;
              }
              if (areaV === "0") {
                SendSocketDeletePoint(debugging, WS, idPoint);
              } else {
                SendSocketDeleteVertex(debugging, WS, regionV, areaV, idPoint);
              }
              setOpenSet(false);
            }
            break;
          case 4: // Редактирование адреса
            setOpenSetAdress(true);
        }
      };

      const StrokaPressBalloon = (soob: string, mode: number) => {
        return (
          <Button sx={styleModalMenu} onClick={() => handleClose(mode)}>
            <b>{soob}</b>
          </Button>
        );
      };

      return (
        <Modal open={openSet} onClose={() => setOpenSet(false)} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              {StrokaPressBalloon(soobDel, 3)}
              {StrokaPressBalloon("Редактирование адреса", 4)}
            </Box>
            <Typography variant="h6" sx={styleTypography}>
              Перестроение связи:
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              {StrokaPressBalloon("Начальная точка", 1)}
              {StrokaPressBalloon("Конечная точка", 2)}
            </Box>
            {openSetAdress && (
              <MapInputAdress iPoint={indexPoint} setOpen={setOpenSetAdress} />
            )}
            {openSetErBall && (
              <MapPointDataError
                sErr={soobError}
                setOpen={setOpenSetErBall}
                debug={debugging}
                ws={WS}
                fromCross={fromCross}
                toCross={toCross}
                activeRoute={activeRoute}
              />
            )}
          </Box>
        </Modal>
      );
    };

    const MakeNewPoint = (coords: any) => {
      let coor: string = CodingCoord(coords);
      let areaV = massroute.vertexes[massroute.vertexes.length - 1].area;
      let idV = massroute.vertexes[massroute.vertexes.length - 1].id;
      let adress = massroute.vertexes[massroute.vertexes.length - 1].name;
      coordinates.push(coords);
      if (areaV) {
        SendSocketCreateVertex(debugging, WS, homeRegion, areaV, idV);
      } else {
        SendSocketCreatePoint(debugging, WS, coor, adress);
      }
      setOpenSetCreate(false);
    };

    const PlacemarkDo = () => {
      let pAaI = pointAaIndex;
      let pBbI = pointBbIndex;

      const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
        const MemoPlacemarkDo = React.useMemo(
          () => (
            <Placemark
              key={props.idx}
              geometry={props.coordinate}
              properties={getPointData(props.idx, pAaI, pBbI, massdk)}
              options={getPointOptions(
                props.idx,
                pAaI,
                pBbI,
                massdk,
                massroute
              )}
              modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
              onClick={() => OnPlacemarkClickPoint(props.idx)}
            />
          ),
          [props.coordinate, props.idx]
        );

        return MemoPlacemarkDo;
      };

      return (
        <>
          {flagOpen &&
            coordinates.map((coordinate, idx) => (
              <DoPlacemarkDo key={idx} coordinate={coordinate} idx={idx} />
            ))}
        </>
      );
    };

    const InstanceRefDo = (ref: React.Ref<any>) => {
      if (ref) {
        mapp.current = ref;
        mapp.current.events.add("contextmenu", function (e: any) {
          // нажата правая кнопка мыши (создание новой точки)
          if (mapp.current.hint) {
            newPointCoord = e.get("coords");
            setOpenSetCreate(true);
          }
        });
        mapp.current.events.add("mousedown", function (e: any) {
          // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
          pointCenter = mapp.current.getCenter();
        });
        mapp.current.events.add(["boundschange"], function () {
          pointCenter = mapp.current.getCenter();
          zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        });
      }
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
          instanceRef={(ref) => InstanceRefDo(ref)}
          onLoad={(ref) => addRoute(ref)}
          width={"99.8%"}
          height={"97%"}
        >
          {/* сервисы Яндекса */}
          <FullscreenControl />
          <GeolocationControl options={{ float: "left" }} />
          <RulerControl options={{ float: "right" }} />
          <SearchControl options={searchControl} />
          <TrafficControl options={{ float: "right" }} />
          <TypeSelector options={{ float: "right" }} />
          <ZoomControl options={{ float: "right" }} />
          {/* служебные компоненты */}
          <PlacemarkDo />
          <ModalPressBalloon />
          {openSetEr && (
            <MapPointDataError
              sErr={soobError}
              setOpen={setOpenSetEr}
              debug={debugging}
              ws={WS}
              fromCross={fromCross}
              toCross={toCross}
              activeRoute={activeRoute}
            />
          )}
          {openSetInf && (
            <MapRouteInfo
              activeRoute={activeRoute}
              name1={massdk[pointAaIndex].nameCoordinates}
              name2={massdk[pointBbIndex].nameCoordinates}
              setOpen={setOpenSetInf}
            />
          )}
          {openSetBind && <MapRouteBind setOpen={setOpenSetBind} />}
          {openSetCreate && (
            <MapCreatePointVertex
              setOpen={setOpenSetCreate}
              region={homeRegion}
              coord={newPointCoord}
              createPoint={MakeNewPoint}
            />
          )}
        </Map>
      </YMaps>
    );
  };

  const StrokaMenuGlob = (soob: string, mode: number) => {
    return (
      <Button sx={styleApp01} onClick={() => PressMenuButton(mode)}>
        <b>{soob}</b>
      </Button>
    );
  };
  console.log("Massroute:", massroute);
  console.log("Massdk:", massdk);

  return (
    <Grid container sx={{ height: "99.5vh" }}>
      {flagPusk && !flagBind && <>{StrokaMenuGlob("Отмена назначений", 77)}</>}
      {flagPusk && flagRoute && !flagBind && (
        <>
          {StrokaMenuGlob("Привязка направлен", 33)}
          {StrokaMenuGlob("Реверс связи", 12)}
          {StrokaMenuGlob("Информ о связи", 69)}
        </>
      )}
      {flagPusk && flagRoute && flagBind && (
        <>
          {StrokaMenuGlob("Сохранить связь", 21)}
          {StrokaMenuGlob("Отменить связь", 77)}
          {StrokaMenuGlob("Информ о связи", 69)}
        </>
      )}
      {!flagDemo && <>{StrokaMenuGlob("Demo сети", 3)}</>}
      {flagDemo && <>{StrokaMenuGlob("Конец Demo", 6)}</>}
      {Object.keys(massroute).length && <MapGl />}
    </Grid>
  );
};

export default MainMap;
