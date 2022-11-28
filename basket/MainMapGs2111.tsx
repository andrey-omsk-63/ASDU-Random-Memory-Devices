import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapCreate, massmodeCreate } from '../redux/actions';

import Grid from '@mui/material/Grid';

import { YMaps, Map, Placemark, FullscreenControl } from 'react-yandex-maps';
import { GeolocationControl, YMapsApi } from 'react-yandex-maps';
import { RulerControl, SearchControl } from 'react-yandex-maps';
import { TrafficControl, TypeSelector, ZoomControl } from 'react-yandex-maps';

import GsSelectMD from './GsComponents/GsSelectMD';
import GsSetPhase from './GsComponents/GsSetPhase';
import GsToDoMode from './GsComponents/GsToDoMode';
import GsErrorMessage from './GsComponents/GsErrorMessage';

import { getMultiRouteOptions, StrokaHelp } from './MapServiceFunctions';
import { getReferencePoints, CenterCoord } from './MapServiceFunctions';
import { getPointData, getPointOptions1 } from './MapServiceFunctions';
import { getPointOptions2, ErrorHaveVertex } from './MapServiceFunctions';
import { StrokaMenuGlob } from './MapServiceFunctions';

import { SendSocketUpdateRoute } from './MapSocketFunctions';

import { searchControl } from './MainMapStyle';

let flagOpen = false;

const zoomStart = 10;
let zoom = zoomStart;
let pointCenter: any = 0;
let pointCenterEt: any = 0;

let massMem: Array<number> = [];
let massCoord: any = [];
let newMode = -1;
let soobErr = '';
let helper = true;

let xsMap = 11.99;
let xsTab = 0.01;
let widthMap = '99.9%';

let modeToDo = 0;
let newCenter: any = [];

const MainMapGs = (props: {trigger: boolean}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  //console.log("map", map);
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log("massdk", massdk);
  // let massfaz = useSelector((state: any) => {
  //   const { massfazReducer } = state;
  //   return massfazReducer.massfaz;
  // });
  // console.log("MainMAPmassfaz", massfaz);
  let massmode = useSelector((state: any) => {
    const { massmodeReducer } = state;
    return massmodeReducer.massmode;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const ws = datestat.ws;
  const dispatch = useDispatch();
  //===========================================================
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [selectMD, setSelectMD] = React.useState(false);
  const [setPhase, setSetPhase] = React.useState(false);
  const [toDoMode, setToDoMode] = React.useState(false);
  const [flagCenter, setFlagCenter] = React.useState(false);
  const [openSoobErr, setOpenSoobErr] = React.useState(false);

  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const ReceiveIdxGs = (mode: number) => {
    let massErrRec = [];
    massMem = [];
    massCoord = [];
    for (let i = 0; i < map.routes[mode].listTL.length; i++) {
      let idx = -1;
      for (let j = 0; j < map.tflight.length; j++) {
        if (
          map.routes[mode].listTL[i].pos.region === map.tflight[j].region.num &&
          map.routes[mode].listTL[i].pos.area === map.tflight[j].area.num &&
          map.routes[mode].listTL[i].pos.id === map.tflight[j].ID
        ) {
          idx = j;
          break;
        }
      }
      if (idx < 0) {
        ErrorHaveVertex(map.routes[mode].listTL[i].pos);
        console.log('CoorError', map.routes[mode].listTL[i].point);
        massErrRec.push(i);
      } else {
        massMem.push(idx);
        massCoord.push(coordinates[idx]);
      }
    }
    if (massErrRec.length) {
      let massRabMap = []; // редактируем у себя map
      for (let i = 0; i < map.routes[mode].listTL.length; i++) {
        if (!massErrRec.includes(i)) {
          massRabMap.push(map.routes[mode].listTL[i]);
        }
      }
      map.routes[mode].listTL = massRabMap;
      SendSocketUpdateRoute(debug, ws, map.routes[mode]);
      dispatch(mapCreate(map));
    }
    newMode = mode;
    ymaps && addRoute(ymaps, true); // перерисовка связей
    setFlagPusk(!flagPusk);
  };

  const addRoute = (ymaps: any, bound: boolean) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    if (massCoord.length > 1) {
      let multiRoute: any = [];
      if (massCoord.length === 2) {
        multiRoute = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(massCoord[0], massCoord[1]),
          getMultiRouteOptions(),
        );
      } else {
        let between = [];
        for (let i = 1; i < massCoord.length - 1; i++) {
          between.push(i);
        }
        multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: massCoord,
            params: { viaIndexes: between },
          },
          { boundsAutoApply: bound, wayPointVisible: false },
        );
      }
      mapp.current.geoObjects.add(multiRoute);
    }
  };

  const StatusQuo = () => {
    massMem = [];
    massCoord = [];
    newMode = -1;
    zoom = zoomStart - 0.01;
    ymaps && addRoute(ymaps, false); // перерисовка связей
    NewPointCenter(pointCenterEt);
  };

  const MakeNewMassMem = (mass: any) => {
    if (mass.length) {
      massMem = [];
      let masRab = [];
      for (let i = 0; i < mass.length; i++) {
        massMem.push(mass[i].idx);
        masRab.push(massdk[mass[i].idx].coordinates);
      }
      massCoord = [];
      massCoord = masRab;
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setFlagPusk(!flagPusk);
    } else {
      StatusQuo();
    }
  };

  const OnPlacemarkClickPoint = (index: number) => {
    let nomInMass = massMem.indexOf(index);
    let masscoord: any = [];
    if (newMode < 0) {
      // создание нового режима
      if (nomInMass < 0) {
        massMem.push(index);
        masscoord[0] = map.tflight[index].points.Y;
        masscoord[1] = map.tflight[index].points.X;
        massCoord.push(masscoord);
      } else {
        massMem.splice(nomInMass, 1);
        massCoord.splice(nomInMass, 1);
      }
      ymaps && addRoute(ymaps, false); // перерисовка связей
      setFlagPusk(!flagPusk);
    } else {
      // работа с существующем режимом
      if (nomInMass >= 0 && nomInMass + 1 < massMem.length) {
        masscoord[0] = map.tflight[massMem[nomInMass + 1]].points.Y;
        masscoord[1] = map.tflight[massMem[nomInMass + 1]].points.X;
        NewPointCenter(masscoord);
      }
    }
  };

  const PlacemarkDo = () => {
    let pAaI = -1;
    let pBbI = -1;
    if (massMem.length >= 1) {
      pAaI = massMem[0];
      pBbI = massMem[massMem.length - 1];
    }

    const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
      let aaa = massMem.indexOf(props.idx);
      const MemoPlacemarkDo = React.useMemo(
        () => (
          <Placemark
            key={props.idx}
            geometry={props.coordinate}
            properties={getPointData(props.idx, pAaI, pBbI, massdk)}
            options={
              (massMem.length === aaa + 1 && massMem.length) || (!aaa && massMem.length > 1)
                ? getPointOptions2(props.idx, massMem)
                : getPointOptions1(debug, props.idx, map)
            }
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            onClick={() => OnPlacemarkClickPoint(props.idx)}
          />
        ),
        [props.coordinate, props.idx, aaa],
      );
      return MemoPlacemarkDo;
    };

    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <DoPlacemarkDo key={idx} coordinate={coordinate} idx={idx} />
          ))}
      </>
    );
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      // mapp.current.events.add("contextmenu", function (e: any) {
      //   if (mapp.current.hint) {
      //     newPointCoord = e.get("coords"); // нажата правая кнопка мыши (созд-е новой точки)
      //     setOpenSetCreate(true);
      //   }
      // });
      mapp.current.events.add('mousedown', function (e: any) {
        pointCenter = mapp.current.getCenter(); // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
      });
      mapp.current.events.add(['boundschange'], function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
      });
      if (flagCenter) {
        pointCenter = newCenter;
        setFlagCenter(false);
      }
    }
  };

  const NewPointCenter = (coord: any) => {
    newCenter = coord;
    setFlagCenter(true);
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(map.tflight).length) {
    pointCenter = CenterCoord(
      map.boxPoint.point0.Y,
      map.boxPoint.point0.X,
      map.boxPoint.point1.Y,
      map.boxPoint.point1.X,
    );
    pointCenterEt = pointCenter;
    flagOpen = true;
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 41: // удалить режим
        massmode[newMode].delRec = true;
        dispatch(massmodeCreate(massmode));
        StatusQuo();
        ymaps && addRoute(ymaps, false); // перерисовка связей
        setFlagPusk(!flagPusk);
        break;
      case 42: // выбор режима ЗУ
        if (massMem.length) {
          StatusQuo();
          ymaps && addRoute(ymaps, false); // перерисовка связей
          setFlagPusk(!flagPusk);
        }
        helper = false;
        setSelectMD(true);
        break;
      case 43: // переход к созданию нового режима
        helper = true;
        StatusQuo();
        break;
      case 44: // назначить фазы
        setSetPhase(true);
        break;
      case 45: // выполнить режим
        if (massmode[newMode].delRec) {
          soobErr = 'Данный режим помечен к удалению';
          setOpenSoobErr(true);
        } else {
          xsMap = 7.8;
          xsTab = 4.2;
          widthMap = '99.8%';
          modeToDo = 1;
          setToDoMode(true);
          setFlagPusk(!flagPusk);
        }
    }
  };

  const OldSizeWind = (size: number) => {
    xsMap = size;
    xsTab = 0.01;
    widthMap = '99.9%';
    modeToDo = 0;
    setToDoMode(false);
    setFlagPusk(!flagPusk);
  };

  const ModeToDo = (mod: number) => {
    modeToDo = mod;
    if (!modeToDo) StatusQuo();
    setFlagPusk(!flagPusk);
  };

  const SetHelper = (mod: boolean) => {
    helper = mod;
    setFlagPusk(!flagPusk);
  };

  const MenuGl = (mod: number) => {
    let soobHelp = 'Выберите перекрёстки для создания нового маршрута';
    let soobInfo = 'Подготовка к выпонению режима';
    if (modeToDo === 2) soobInfo = 'Происходит выполнение режима';

    return (
      <>
        {modeToDo > 0 && <>{StrokaHelp(soobInfo)}</>}
        {modeToDo === 0 && (
          <>
            {StrokaMenuGlob('Существующие режимы ЗУ', PressButton, 42)}
            {massMem.length < 2 && helper && <>{StrokaHelp(soobHelp)}</>}
            {massMem.length > 1 && (
              <>
                {newMode < 0 && <>{StrokaMenuGlob('Обработка режима', PressButton, 44)}</>}
                {newMode >= 0 && (
                  <>
                    {StrokaMenuGlob('Создать режим', PressButton, 43)}
                    {StrokaMenuGlob('Редактировать фазы', PressButton, 44)}
                    {StrokaMenuGlob('Выполнить режим', PressButton, 45)}
                    {StrokaMenuGlob('Удалить режим', PressButton, 41)}
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <Grid container sx={{ border: 0, height: '99.9vh' }}>
      <Grid item xs sx={{ border: 0 }}>
        {MenuGl(modeToDo)}
        <Grid container sx={{ border: 0, height: '96.9vh' }}>
          <Grid item xs={xsMap} sx={{ border: 0 }}>
            {Object.keys(map.tflight).length && (
              <YMaps
                query={{
                  apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1',
                  lang: 'ru_RU',
                }}>
                <Map
                  modules={['multiRouter.MultiRoute', 'Polyline']}
                  state={mapState}
                  instanceRef={(ref) => InstanceRefDo(ref)}
                  onLoad={(ref) => {
                    ref && setYmaps(ref);
                  }}
                  width={widthMap}
                  height={'99.9%'}>
                  {/* сервисы Яндекса */}
                  <FullscreenControl />
                  <GeolocationControl options={{ float: 'left' }} />
                  <RulerControl options={{ float: 'right' }} />
                  <SearchControl options={searchControl} />
                  <TrafficControl options={{ float: 'right' }} />
                  <TypeSelector options={{ float: 'right' }} />
                  <ZoomControl options={{ float: 'right' }} />
                  {/* служебные компоненты */}
                  <PlacemarkDo />
                  {selectMD && (
                    <GsSelectMD
                      setOpen={setSelectMD}
                      receive={ReceiveIdxGs}
                      funcHelper={SetHelper}
                    />
                  )}
                  {setPhase && (
                    <GsSetPhase
                      setOpen={setSetPhase}
                      newMode={newMode}
                      massMem={massMem}
                      func={MakeNewMassMem}
                    />
                  )}
                  {openSoobErr && <GsErrorMessage setOpen={setOpenSoobErr} sErr={soobErr} />}
                </Map>
              </YMaps>
            )}
          </Grid>
          <Grid item xs={xsTab} sx={{ height: '97.0vh' }}>
            {toDoMode && (
              <GsToDoMode
                newMode={newMode}
                massMem={massMem}
                funcMode={ModeToDo}
                funcSize={OldSizeWind}
                funcCenter={NewPointCenter}
                funcHelper={SetHelper}
                trigger={props.trigger}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainMapGs;
