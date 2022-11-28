import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  GeolocationControl,
  ListBox,
  ListBoxItem,
  //RouteButton,
  RulerControl,
  SearchControl,
  TrafficControl,
  TypeSelector,
  ZoomControl,
  YMapsApi,
  //Clusterer,
} from 'react-yandex-maps';

import { Tflight, DateMAP } from './../../interfaceMAP.d';

const mapData = {
  center: [55.751574, 37.573856],
  zoom: 8.5,
  controls: [],
};

let coordinates: Array<Array<number>> = [[]];
let nameCoordinates: Array<string> = [];

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = true;
let onRoute = false;

//let pointA: any = [coordinates[0][0], coordinates[0][1]];
let pointa: any = [];
let pointA: any = 0;
//const pointB: any = [coordinates[2][0], coordinates[2][1]];
let pointb: any = [];
let pointB: any = 0;
let ch = 0;

const BindDiagram = () => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  //console.log('dateMap_Diagram:', dateMap);
  //========================================================

  const mapp = React.useRef<any>(null);
  //const mapRef = React.useRef<any>(null);
  const [zoom, setZoom] = React.useState<number>(18);

  if (flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      coordinates.push(mass);
      nameCoordinates.push(dateMap[i].description);
    }
    coordinates.splice(0, 1);
    flagOpen = false;
    pointa = [coordinates[4][0], coordinates[4][1]];
    pointb = [coordinates[3][0], coordinates[3][1]];
    pointA = [coordinates[0][0], coordinates[0][1]];
    pointB = [coordinates[2][0], coordinates[2][1]];
  }

  const PressBalloon = (index: number) => {
    //console.log('!!!', index)
    return 'Это балун ' + (index + 1);
  };

  const PressBalloonBody = (index: number) => {
    console.log('Кликнули по точке ', index + 1, onRoute);
    let mass = [0, 0];
    // const multiRoute = new ymaps.multiRouter.MultiRoute(
    //   {
    //     referencePoints: [pointA, pointB],

    //   },
    //   {

    //     boundsAutoApply: true,
    //   },
    // );

    if (!onRoute) {
      pointA = pointa;
      pointB = pointb;
      //   mass[0] = coordinates[index][0];
      //   mass[1] = coordinates[index][1];
      //   if (pointA === 0) {
      //     pointA = mass;
      //     console.log('A', pointA, 'B', pointB);
      //   } else {
      //     if (pointB === 0) {
      //       pointB = mass;
      //       console.log('a', pointA, 'b', pointB);
      //       onRoute = true;
      //     }
      //   }
      console.log('A', pointA, 'B', pointB);
      onRoute = true;
      //mapp.current.geoObjects.add(multiRoute);
      setSize(window.innerWidth + Math.random());
    }
  };

  const getPointData = (index: number) => {
    //console.log('!!!',index)
    return {
      hintContent: nameCoordinates[index],
      //balloonContent: PressBalloon(index),
    };
  };

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
    };
  };

  const addRoute = (ymaps: any) => {
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [pointA, pointB],
        // referencePoints: [
        //   'Москва, метро Смоленская',
        //   'Москва, метро Арбатская',
        //   [55.734876, 37.59308], // улица Льва Толстого.
        // ],
        // params: {
        //   //   routingMode: "auto",
        //   //reverseGeocoding: true
        // },
      },
      {
        //wayPointVisible: false,
        wayPointDraggable: true,
        boundsAutoApply: true,
      },
    );

    console.log('mapp.current', mapp.current);
    // multiRoute.editor.start({
    //   addWayPoints: true,
    // });
    // if (mapp.current)
    mapp.current.geoObjects.add(multiRoute);

    if (onRoute) {
      multiRoute.model.setReferencePoints(['метро Смоленская', 'метро Текстильщики']);
    }
  };

  const OnPlacemarkClick = (index: number) => {
    console.log('OnPlacemarkClick', index + 1);
    if (!onRoute) {
      pointA = pointa;
      pointB = pointb;
      console.log('A', pointA, 'B', pointB);
      onRoute = true;
      //mapp.current.geoObjects.add(multiRoute);
    }
    setSize(window.innerWidth + Math.random());
  };

  //отслеживание изменения размера экрана
  const [size, setSize] = React.useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  ch++;
  console.log('AA', ch, pointA, 'BB', pointB);
  //const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
          <Map
            modules={[
              'multiRouter.MultiRoute',
              // 'templateLayoutFactory',
              // 'geoObject.addon.balloon',
              // 'geoObject.addon.hint',
            ]}
            defaultState={mapData}
            instanceRef={(ref) => {
              if (ref) {
                mapp.current = ref;
                mapp.current.events.add(['boundschange'], () => setZoom(mapp.current.getZoom()));
              }
            }}
            onLoad={addRoute}
            // onLoad={(ref) => {
            //   if (ref) {
            //     setYmaps(ref);
            //     addRoute(ymaps, ref);
            //   }
            // }}
            width={'99.5%'}
            height={'100%'}>
            {coordinates.map((coordinate, idx) => (
              <Placemark
                key={idx}
                geometry={coordinate}
                properties={getPointData(idx)}
                options={getPointOptions()}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                onClick={() => OnPlacemarkClick(idx)}
                // instanceRef={(ref: any) => {
                //   ref &&
                //     ref.events.add('balloonopen', () => {
                //       //ref.events.add( () => {
                //       PressBalloonBody(idx);
                //     });
                // }}
              />
            ))}
            <FullscreenControl />
            <GeolocationControl options={{ float: 'left' }} />
            <ListBox data={{ content: 'Выберите город' }}>
              <ListBoxItem data={{ content: 'Москва' }} />
              <ListBoxItem data={{ content: 'Омск' }} />
            </ListBox>
            {/* <RouteButton options={{ float: 'right' }} /> */}
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
          </Map>
        </YMaps>
      </Grid>
    </Box>
  );
};

export default BindDiagram;

{
  /* <script type="text/javascript">
  ymaps.ready(function () {
    let myMap = new ymaps.Map('map', {
    center: [55.751574, 37.573856],
    zoom: 9,
    controls: []
    });

  // Создание экземпляра маршрута.
  let multiRoute = new ymaps.multiRouter.MultiRoute({
    // Точки маршрута.
    // Обязательное поле. 
    referencePoints: [
  'Москва, метро Смоленская',
  'Москва, метро Арбатская',
  [55.734876, 37.59308], // улица Льва Толстого.
  ]
    }, {
    // Автоматически устанавливать границы карты так,
    // чтобы маршрут был виден целиком.
    boundsAutoApply: true
});

  // Добавление маршрута на карту.
  myMap.geoObjects.add(multiRoute);
});
</script> */
}
