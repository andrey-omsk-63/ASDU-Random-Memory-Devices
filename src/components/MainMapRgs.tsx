import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { coordinatesCreate, statsaveCreate } from "../redux/actions";
import { massfazCreate } from "../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { YMaps, Map, YMapsApi } from "react-yandex-maps";

import GsErrorMessage from "./RgsComponents/RgsErrorMessage";
import GsDoPlacemarkDo from "./RgsComponents/RgsDoPlacemarkDo";
import RgsCreateObject from "./RgsComponents/RgsCreateObject";
import RgsProcessObject from "./RgsComponents/RgsProcessObject";
import RgsAppointVertex from "./RgsComponents/RgsAppointVertex";
import RgsToDoMode from "./RgsComponents/RgsToDoMode";
import GsSetup from "./RgsComponents/GsSetup";
import GsFragments from "./RgsComponents/GsFragments";

import { getMassMultiRouteOptions, Distance } from "./RgsServiceFunctions";
import { getMassMultiRouteOptionsDemo } from "./RgsServiceFunctions";
import { getMultiRouteOptions, SaveZoom } from "./RgsServiceFunctions";
import { getReferencePoints, CenterCoordBegin } from "./RgsServiceFunctions";
import { MakeMassRouteFirst, StrokaHelp } from "./RgsServiceFunctions";
import { StrokaMenuGlob, MakingKey, Duplet } from "./RgsServiceFunctions";
import { MakeSoobErr, MakeMassRoute } from "./RgsServiceFunctions";
import { CheckHaveLink, MakeFazer, DrawCircle } from "./RgsServiceFunctions";
import { YandexServices, TakeAreaId, TakeAreaIdd } from "./RgsServiceFunctions";
import { PutItInAFrame } from "./RgsServiceFunctions";

import { SendSocketGetSvg, SendSocketDispatch } from "./RgsSocketFunctions";
import { SendSocketGetPhases } from "./RgsSocketFunctions";

import { YMapsModul, MyYandexKey, NoClose } from "./MapConst";

import { styleMenuGl, styleServisTable } from "./MainMapStyle";

export let BAN = false;
export let PressESC = false; // был нажат Esc при вводе маршрута
export let zoom = 10;
let zoomOld = 0;
let pointCenter: any = 0;

let flagOpen: boolean, needRend: boolean, inTarget: boolean, inDemo: boolean;
flagOpen = needRend = inTarget = inDemo = false;

let massMem: Array<number> = [];
let massVert: Array<number> = [];
let massCoord: any = []; // массив координат светофоров
let massKlu: Array<string> = []; // массив ключей
let massNomBind: Array<number> = []; // массив номеров светофоров в bindings
let soobErr = "";
let modeToDo = 0;
let newCenter: any = [];
let leftCoord: Array<number> = [0, 0];
let massRoute: any = []; // массив предлагаемых связей
let helper = true;
let funcContex: any = null;
let funcBound: any = null;
let modeHelp = 0;
let mayEsc = false; // можно воспользоваться Esc при построении маршрута
let typeRoute = false; // тип отображаемых связей
let needDrawCircle = false; // нужно перерисовать окружности вокруг светофора
let circls: any = [null, null];

const MainMapRgs = (props: { trigger: boolean }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let bindings = useSelector((state: any) => {
    const { bindingsReducer } = state;
    return bindingsReducer.bindings.dateBindings;
  });
  let addobj = useSelector((state: any) => {
    const { addobjReducer } = state;
    return addobjReducer.addobj.dateAdd;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  typeRoute = datestat.typeRoute; // тип отображаемых связей
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const homeRegion = datestat.region;
  const SL = homeRegion < 10 ? 2 : 3;
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [needSetup, setNeedSetup] = React.useState(false);
  const [fragments, setFragments] = React.useState(false);
  const [createObject, setCreateObject] = React.useState(false);
  const [processObject, setProcessObject] = React.useState(false);
  const [appoint, setAppoint] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [idxObj, setIdxObj] = React.useState(-1);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);
  const [risovka, setRisovka] = React.useState(false);
  const [restartBan, setRestartBan] = React.useState(false);
  const [changeFaz, setChangeFaz] = React.useState(0);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const [demoSost, setDemoSost] = React.useState(-1);
  const mapp = React.useRef<any>(null);

  const addRoute = React.useCallback(
    (ymaps: any) => {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      // отрисовка предлагаемых доступных связей светофора
      let massMultiRoute: any = []; // исходящие связи
      for (let i = 0; i < massRoute.length; i++) {
        if (typeRoute) {
          massMultiRoute[i] = new ymaps.multiRouter.MultiRoute( // маршрутизированные связи
            getReferencePoints(massCoord[massCoord.length - 1], massRoute[i]),
            getMassMultiRouteOptions(i)
          );
        } else {
          massMultiRoute[i] = new ymaps.Polyline( // формальные связи
            [massCoord[massCoord.length - 1], massRoute[i]],
            {},
            getMassMultiRouteOptions(i)
          );
        }
        mapp.current.geoObjects.add(massMultiRoute[i]);
      }
      // отрисовка рабочего маршрута
      if (datestat.massPath) {
        if (datestat.massPath.length > 1) {
          let MassPath = JSON.parse(JSON.stringify(datestat.massPath)); // рабочий маршрут
          let mfl = massfaz.length;
          if (MassPath.length + 1 === mfl)
            MassPath.unshift(massfaz[0].coordinates); // добавить в начало
          let massMultiPath: any = []; // исходящие связи
          let mpl = MassPath.length;
          for (let i = 0; i < MassPath.length - 1; i++) {
            let beginEnd = (!i && mpl === mfl) || i === mpl - 2 ? true : false; // связь начало/конец маршрута
            if (typeRoute) {
              massMultiPath[i] = new ymaps.multiRouter.MultiRoute( // маршрутизированные связи
                getReferencePoints(MassPath[i], MassPath[i + 1]),
                getMultiRouteOptions(beginEnd)
              );
            } else {
              massMultiPath[i] = new ymaps.Polyline( // формальные связи
                [MassPath[i], MassPath[i + 1]],
                {},
                getMultiRouteOptions(beginEnd)
              );
            }
            mapp.current.geoObjects.add(massMultiPath[i]);
          }
        }
      }
      circls = DrawCircle(ymaps, mapp, massMem, massdk, addobj); // нарисовать окружности в начале/конце маршрута
    },
    [datestat.massPath, addobj, massdk, massfaz]
  );

  const SetFragments = (idx: number) => {
    idx >= 0 && ymaps && PutItInAFrame(ymaps, mapp, map.fragments[idx].bounds); // расположить фрагмент в границах экрана
    setFragments(false);
  };

  const DoDemo = (ymaps: any, mode: number) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let massKluGlob: any = [];
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      let massklu = MakeMassRoute(bindings, i, map, addobj)[1];
      for (let j = 0; j < massklu.length; j++)
        massKluGlob.push(
          bindings.tfLinks[i].id + "-" + TakeAreaId(massklu[j])[1]
        );
    }
    for (let i = 0; i < bindings.tfLinks.length; i++) {
      let massCoord: any = [];
      let massRab = MakeMassRoute(bindings, i, map, addobj);
      let massRoute = massRab[0]; // массив предлагаемых связей
      let massKlu = massRab[1];
      let KLUCH = "";
      for (let j = 0; j < map.tflight.length; j++) {
        massCoord = [];
        let rec = map.tflight[j];
        let klu = MakingKey(homeRegion, rec.area.num, rec.ID);
        if (bindings.tfLinks[i].id === klu) {
          massCoord[0] = map.tflight[j].points.Y; // перекрёсток
          massCoord[1] = map.tflight[j].points.X;
          massVert.push(j);
          KLUCH = klu;
          break;
        }
      }
      if (mode) {
        let massMultiRoute: any = []; // исходящие связи
        for (let j = 0; j < massRoute.length; j++) {
          let have = 0;
          let KLU = TakeAreaId(massKlu[j])[1] + "-" + TakeAreaId(KLUCH)[1];
          for (let ii = 0; ii < massKluGlob.length; ii++) {
            let a = TakeAreaIdd(massKluGlob[ii]);
            let kll = a[1] + "-" + a[2];
            if (kll === KLU) have++;
          }
          let coler = !have ? "#ff0000" : "#000000"; // красный/чёрный
          if (typeRoute) {
            massMultiRoute[j] = new ymaps.multiRouter.MultiRoute( // маршрутизированные связи
              getReferencePoints(massCoord, massRoute[j]),
              getMassMultiRouteOptionsDemo(j, coler)
            );
          } else {
            massMultiRoute[j] = new ymaps.Polyline( // формальные связи
              [massCoord, massRoute[j]],
              {},
              getMassMultiRouteOptionsDemo(j, coler)
            );
          }
          mapp.current.geoObjects.add(massMultiRoute[j]);
        }
      }
    }
  };

  const StatusQuo = React.useCallback(() => {
    modeHelp = 0;
    massMem = [];
    massCoord = [];
    massKlu = [];
    massNomBind = []; // массив номеров светофоров в bindings
    massRoute = [];
    mayEsc = datestat.start = datestat.finish = false; // первая точка маршрута/закончить исполнение
    datestat.massPath = null; // точки рабочего маршрута
    dispatch(statsaveCreate(datestat));
    ymaps && addRoute(ymaps); // перерисовка связей
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
  }, [ymaps, addRoute, datestat, dispatch]);

  const SendImgPhases = (index: number) => {
    if (index < massdk.length) {
      if (!massdk[index].readIt) {
        let region = massdk[index].region.toString();
        let area = massdk[index].area.toString();
        SendSocketGetPhases(region, area, massdk[index].ID);
      }
    }
  };

  const ClickPointInTarget = (index: number) => {
    setIdxObj(index);
    if (index >= map.tflight.length) {
      setProcessObject(true);
    } else {
      let area = map.tflight[index].area.num;
      let id = map.tflight[index].ID;
      datestat.area = area;
      datestat.id = id;
      if (!debug) {
        datestat.phSvg = Array(8).fill(null);
        datestat.pictSvg = null;
        datestat.readyPict = datestat.readyFaza = false;
      }
      SendImgPhases(index); // запрос на получение изображений фаз
      if (!massdk[index].readVert) {
        SendSocketGetSvg(homeRegion, area, id); // запрос на получение изображения перекрёстка
      } else {
        datestat.pictSvg = massdk[index].imgVert;
        datestat.readyPict = true;
      }
      datestat.phSvg = massdk[index].phSvg;
      dispatch(statsaveCreate(datestat));
      setAppoint(true);
    }
  };

  const Added = (klu: string, index: number, nom: number) => {
    helper = !helper;
    let masscoord: any = [];
    if (index < map.tflight.length) {
      masscoord[0] = map.tflight[index].points.Y; // перекрёсток
      masscoord[1] = map.tflight[index].points.X;
    } else {
      let idxObj = index - map.tflight.length; // объект
      masscoord = addobj.addObjects[idxObj].dgis;
    }
    massMem.push(index);
    SendImgPhases(index); // запрос на получение изображения фазы
    massCoord.push(masscoord);
    massKlu.push(klu); // массив ключей
    massNomBind.push(nom); // массив номеров светофоров в bindings
    massRoute = [];
    if (massNomBind.length === 1)
      massRoute = MakeMassRouteFirst(klu, bindings, map);
    if (massNomBind.length > 1 && klu.length < 9)
      massRoute = MakeMassRoute(bindings, nom, map, addobj)[0];
    ymaps && addRoute(ymaps); // перерисовка связей
    mayEsc = true;
    if (massMem.length === 3) PressButton(53);
    if (massMem.length !== 3) setFlagPusk(!flagPusk);
  };

  const SoobErr = (soob: string) => {
    soobErr = soob;
    setOpenSoobErr(true);
  };

  const AddVertex = (klu: string, index: number, nom: number) => {
    if (massMem.indexOf(index) >= 0) {
      SoobErr(MakeSoobErr(2, klu.slice(SL), "")); // перекрёсток уже используется
    } else {
      if (!massMem.length) {
        datestat.start = true;
        dispatch(statsaveCreate(datestat));
        Added(klu, index, nom); // первая точка
      } else {
        if (nom < 0) {
          if (massMem.length > 1) {
            datestat.finish = needRend = true;
            dispatch(statsaveCreate(datestat));
            Added(klu, index, nom); // последняя точка - объект
            setFlagPusk(!flagPusk);
          } else SoobErr("Ошибочка вышла!!!");
        } else {
          if (!MakeFazer(massKlu[massMem.length - 1], bindings.tfLinks[nom])) {
            let soob = massKlu[massMem.length - 1].slice(SL);
            SoobErr(MakeSoobErr(1, klu.slice(SL), soob)); // нет связ мкжду перекрёстками
          } else Added(klu, index, nom); // вторая точка и далее
        }
      }
    }
  };

  const ClickPointNotTarget = (index: number) => {
    if (datestat.finish) {
      SoobErr("Маршрут уже полностью сформирован");
    } else {
      let klu = "";
      if (index >= map.tflight.length) {
        let mass = addobj.addObjects[index - map.tflight.length]; // объект
        klu = MakingKey(homeRegion, mass.area, mass.id);
      } else {
        let mass = map.tflight[index]; // перекрёсток
        klu = MakingKey(homeRegion, mass.area.num, mass.ID);
      }
      if (!massMem.length) {
        AddVertex(klu, index, -1); // входящая точка маршрута
      } else {
        let have = -1;
        for (let i = 0; i < bindings.tfLinks.length; i++)
          if (bindings.tfLinks[i].id === klu) have = i;
        if (have < 0 && klu.length < 9) {
          SoobErr(MakeSoobErr(3, klu.slice(SL), "")); // нет массива связности
        } else {
          if (massMem.length > 1) {
            let kluLast = massKlu[massKlu.length - 1];
            if (!CheckHaveLink(klu, kluLast, bindings)) {
              SoobErr(MakeSoobErr(5, klu.slice(SL), kluLast.slice(SL))); // нет связи
            } else AddVertex(klu, index, have);
          } else AddVertex(klu, index, have);
        }
      }
    }
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (inTarget && !inDemo) ClickPointInTarget(index); //реж.назначения
    if (!inTarget && !inDemo) ClickPointNotTarget(index); //реж.управления
  };
  //=== вывод светофоров ===================================
  const PlacemarkDo = () => {
    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <GsDoPlacemarkDo
              key={idx}
              ymaps={ymaps}
              coordinate={coordinate}
              idx={idx}
              massMem={massMem}
              OnPlacemarkClickPoint={OnPlacemarkClickPoint}
              vert={massVert}
            />
          ))}
      </>
    );
  };

  const Pererisovka = () => {
    if (risovka) {
      ymaps && addRoute(ymaps); // перерисовка связей
      setRisovka(false);
    }
  };
  //=== обработка instanceRef ==============================
  const TakeOffVertex = (nomInMass: number) => {
    massfaz[nomInMass].runRec = datestat.demo ? 5 : 1;
    dispatch(massfazCreate(massfaz));
    if (datestat.massPath) {
      if (datestat.massPath.length) {
        let aa = JSON.parse(JSON.stringify(datestat.massPath));
        aa.shift(); // удалить первый элемент
        datestat.massPath = aa;
        dispatch(statsaveCreate(datestat));
      }
    }
    setRisovka(true);
    setChangeFaz(nomInMass);
  };

  const FindNearVertex = (coord: Array<number>) => {
    let minDist = 999999;
    let nomInMass = -1;
    if (massMem.length > 2) {
      for (let i = 0; i < massMem.length; i++) {
        let corFromMap = [massfaz[i].coordinates[0], massfaz[i].coordinates[1]];
        let dister = Distance(coord, corFromMap);
        if (dister < 150 && minDist > dister) {
          minDist = dister;
          nomInMass = i;
        }
      }
      if (nomInMass < 0) {
        // нажата правая кнопка "в поле"
        for (let i = 0; i < massMem.length; i++) {
          if (massfaz[i].runRec === 2) {
            nomInMass = i;
            break;
          }
        }
        if (nomInMass > 0) TakeOffVertex(nomInMass); //++++++++++++  Нажали в поле  ++++++++++++
      } else {
        if (nomInMass > 0) {
          if (massMem.length - 1 === nomInMass) {
            RemoveTail(); // последний светофор в маршруте - удалить
          } else {
            let runrec = massfaz[nomInMass].runRec;
            if (runrec === 2 || runrec === 4) {
              if (
                massfaz[nomInMass - 1].runRec > 1 && // 1 - финиш
                massfaz[nomInMass - 1].runRec !== 5 // финиш Демо
              ) {
                // не первый в списке незакрытых  massfaz[nomInMass - 1] - предыдущий светофор
                soobErr = NoClose; // НЕЛЬЗЯ
                setOpenSoobErr(true);
              } else TakeOffVertex(nomInMass); // первый в списке незакрытых
            } else {
              soobErr = "Этот светофор уже закрыт";
              setOpenSoobErr(true);
            }
          }
        }
      }
    }
  };

  const InputerObject = (coord: Array<number>) => {
    if (coord[0] !== leftCoord[0] || coord[1] !== leftCoord[1]) {
      leftCoord = coord;
      modeToDo = 1;
      setFlagPusk(!flagPusk);
      setCreateObject(true);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex); // нажата правая кнопка мыши
      funcContex = function (e: any) {
        if (mapp.current.hint) {
          if (inTarget && !inDemo) InputerObject(e.get("coords"));
          if (!inTarget && !inDemo) FindNearVertex(e.get("coords"));
        }
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("boundschange", funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        if (massMem.length) {
          if (zoomOld !== zoom) {
            needDrawCircle = true;
            zoomOld = zoom;
            setFlagPusk(!flagPusk);
          }
        }
        SaveZoom(zoom, pointCenter);
      };
      mapp.current.events.add("boundschange", funcBound);
      if (flagCenter) {
        pointCenter = newCenter;
        SaveZoom(zoom, pointCenter);
        setFlagCenter(false);
      }
    }
  };
  //========================================================
  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  const SetHelper = React.useCallback(
    (mode: number) => {
      if (mode) inTarget = !inTarget;
      inDemo = mode ? false : true;
      StatusQuo();
      setFlagPusk(!flagPusk);
    },
    [StatusQuo, flagPusk]
  );

  const ModeToDo = (mod: number) => {
    if (mod < 0) {
      RemoveTail(); // нажали на последний в списке светофор
    } else {
      modeToDo = mod;
      if (!modeToDo) {
        setChangeFaz(0);
        setToDoMode(false); // на всякий случай
      } else {
        if (PressESC && datestat.massPath) {
          datestat.massPath && datestat.massPath.pop(); // удалим из массива последний элемент
          dispatch(statsaveCreate(datestat));
          massKlu.pop(); // удалим из массива последний элемент
          massNomBind.pop(); // удалим из массива последний элемент
          let nom = massNomBind[massNomBind.length - 1];
          massRoute = MakeMassRoute(bindings, nom, map, addobj)[0]; // массив предлагаемых связей
          ymaps && addRoute(ymaps); // перерисовка связей
        }
      }
      PressESC = false; // сброс флага нажатия Esc
    }
  };

  const PressButton = (mode: number) => {
    massVert = [];
    if (restartBan && mode > 50) {
      SoobErr("Завершите режим управления нормальным образом");
    } else {
      const GoTo51 = () => {
        datestat.finish = datestat.demo = false;
        dispatch(statsaveCreate(datestat));
        inTarget = true;
        SetHelper(1);
      };
      switch (mode) {
        case 51: // режим управления
          GoTo51();
          break;
        case 52: // режим назначения
          datestat.finish = datestat.demo = false;
          dispatch(statsaveCreate(datestat));
          setToDoMode((inTarget = false));
          SetHelper(1);
          ymaps && DoDemo(ymaps, 0);
          break;
        case 53: // выполнить режим
          setToDoMode(true);
          setRestartBan((BAN = true));
          setFlagPusk(!flagPusk);
          break;
        case 54: // режим Показать связи
          datestat.finish = datestat.demo = false;
          dispatch(statsaveCreate(datestat));
          SetHelper(0);
          ymaps && DoDemo(ymaps, 1);
          break;
        case 55: // режим Демо
          datestat.finish = false;
          datestat.demo = inTarget = true;
          dispatch(statsaveCreate(datestat));
          SetHelper(1);
          break;
        case 56: // настройки
          setNeedSetup(true);
          GoTo51();
          break;
        case 57: // фрагменты
          soobErr =
            "Нет фрагментов Яндекс-карты для вашего аккаунта, создайте их на главной странице системы";
          if (!map.fragments) {
            setOpenSoobErr(true);
          } else {
            if (!map.fragments.length) {
              setOpenSoobErr(true);
            } else setFragments(true);
          }
          GoTo51();
      }
    }
  };

  const OldSizeWind = (size: number) => {
    console.log("КОНЕЦ!!!");
    modeToDo = 0;
    StatusQuo();
    setToDoMode(false);
    setFlagPusk(!flagPusk);
  };

  const SetRestartBan = (mode: boolean) => setRestartBan((BAN = mode));

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    for (let i = 0; i < addobj.addObjects.length; i++)
      coordinates.push(addobj.addObjects[i].dgis);
    dispatch(coordinatesCreate(coordinates));
    let point0 = window.localStorage.PointCenterDU0;
    let point1 = window.localStorage.PointCenterDU1;
    if (!Number(point0) || !Number(point1)) {
      pointCenter = CenterCoordBegin(map); // начальные координаты центра отоброжаемой карты
    } else pointCenter = [Number(point0), Number(point1)];
    zoom = Number(window.localStorage.ZoomDU); // начальный zoom Yandex-карты ДУ
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  const CommentGl = () => {
    let leng = massMem.length;
    return (
      <Box sx={styleMenuGl}>
        {StrokaMenuGlob(PressButton)}
        {modeToDo === 1 && !!modeHelp && (
          <>{StrokaHelp("Введите реквизиты доп.объекта (<Esc> - сброс)", 0)}</>
        )}
        {modeToDo === 3 && datestat.finish && (
          <>{StrokaHelp("Происходит выполнение режима", 0)}</>
        )}
        {(modeToDo === 0 || modeHelp === 0) && (
          <>
            {!inTarget && !inDemo && (
              <>
                {leng === 0 && (
                  <>{StrokaHelp("Начала работы - выбор точки вхождения", 0)}</>
                )}
                {leng > 0 && helper && <>{Duplet(datestat.finish, leng)}</>}
                {leng > 0 && !helper && <>{Duplet(datestat.finish, leng)}</>}
              </>
            )}
            {inTarget && !inDemo && modeToDo !== 1 && (
              <>{StrokaHelp("Выберите перекрёсток или объект", 0)}</>
            )}
          </>
        )}
      </Box>
    );
  };

  const ChangeDemoSost = (mode: number) => setDemoSost(mode + demoSost); // костыль

  //=== обработка Esc ======================================
  const RemoveTail = React.useCallback(() => {
    massMem.pop(); // удалим из массива последний элемент
    massCoord.pop(); // удалим из массива последний элемент
    PressESC = true;
    setFlagPusk(!flagPusk);
  }, [flagPusk]);

  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27 && mayEsc && !datestat.finish) {
        if (massMem.length < 4) {
          inTarget = true;
          SetHelper(1);
        } else RemoveTail();
      }
    },
    [SetHelper, datestat.finish, RemoveTail]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //=== Закрытие или перезапуск вкладки ====================
  function removePlayerFromGame() {
    throw new Error("Функция не реализована");
  }

  const Closing = () => {
    for (let i = 0; i < massfaz.length; i++)
      if (massfaz[i].runRec === 2)
        !DEMO && SendSocketDispatch(massfaz[i].idevice, 9, 9);
  };

  const handleTabClosing = () => {
    Closing();
    removePlayerFromGame();
  };

  const alertUser = (event: any) => Closing();

  React.useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleTabClosing);
    };
  });
  //========================================================
  if (needRend) {
    needRend = false;
    setFlagPusk(!flagPusk);
  }

  if (massMem.length && needDrawCircle) {
    needDrawCircle = false;
    circls[0] && mapp.current.geoObjects.remove(circls[0]); // стереть первую окружность
    circls[1] && mapp.current.geoObjects.remove(circls[1]); // стереть вторую окружность
    circls = DrawCircle(ymaps, mapp, massMem, massdk, addobj); // нарисовать окружности в начале/конце маршрута
  }

  return (
    <Grid container sx={{ height: "99.9vh" }}>
      <Grid item xs={12}>
        {CommentGl()}
        <Grid container sx={{ height: "96.9vh" }}>
          {Object.keys(map.tflight).length && flagOpen && (
            <YMaps query={{ apikey: MyYandexKey, lang: "ru_RU" }}>
              <Map
                modules={YMapsModul}
                state={mapState}
                instanceRef={(ref) => InstanceRefDo(ref)}
                onLoad={(ref) => {
                  ref && setYmaps(ref);
                }}
                width={"99.9%"}
                height={"99.9%"}
              >
                {YandexServices()}
                {Pererisovka()}
                <PlacemarkDo />
                {createObject && (
                  <RgsCreateObject
                    setOpen={setCreateObject}
                    coord={leftCoord}
                    funcMode={ModeToDo}
                  />
                )}
                {processObject && (
                  <RgsProcessObject setOpen={setProcessObject} idx={idxObj} />
                )}
                {appoint && datestat.readyPict && (
                  <RgsAppointVertex setOpen={setAppoint} idx={idxObj} />
                )}
                {fragments && <GsFragments close={SetFragments} />}
                {openSoobErr && (
                  <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />
                )}
              </Map>
            </YMaps>
          )}
        </Grid>
        {toDoMode && (
          <Box sx={styleServisTable}>
            <RgsToDoMode
              massMem={massMem}
              massCoord={massCoord}
              funcMode={ModeToDo}
              funcSize={OldSizeWind}
              funcCenter={NewPointCenter}
              funcHelper={SetHelper}
              trigger={props.trigger}
              changeFaz={changeFaz}
              ban={SetRestartBan}
              changeDemo={ChangeDemoSost}
              pererisovka={setRisovka}
            />
          </Box>
        )}
      </Grid>
      {needSetup && <GsSetup close={setNeedSetup} />}
    </Grid>
  );
};

export default MainMapRgs;
