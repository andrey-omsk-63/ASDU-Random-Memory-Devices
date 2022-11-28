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
  RouteButton,
  RulerControl,
  SearchControl,
  TrafficControl,
  TypeSelector,
  ZoomControl,
  //Clusterer,
} from 'react-yandex-maps';

import { Tflight, DateMAP } from './../../interfaceMAP.d';

const mapData = {
  center: [55.751574, 37.573856],
  zoom: 8.5,
  controls: [],
};

// let coordinates: Array<Array<number>> = [
//   [55.684758, 37.738521],
//   [55.749, 37.524],
// ];

// let nameCoordinates: Array<string> = [
//   'Точка А',
//   'Точка В',
// ];

let coordinates: Array<Array<number>> = [[]];
let nameCoordinates: Array<string> = [];

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = true;
let onRoute = false;

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
  }

  const pointA: Array<number> = [coordinates[0][0], coordinates[0][1]];
  //let pointA = [0, 0];
  const pointB: Array<number> = [coordinates[2][0], coordinates[2][1]];
  //let pointB = [0, 0];

  const PressBalloon = (index: number) => {
    //console.log('!!!', index)

    return 'Это балун ' + (index + 1);
  };

  const PressBalloonBody = (index: number) => {
    console.log('Кликнули по точке ', index + 1, onRoute);

    // if (!onRoute) {
    //   if (pointA[0] === 0) {
    //     pointA[0] = coordinates[index][0];
    //     pointA[1] = coordinates[index][1];
    //     console.log("A", pointA, "B", pointB)
    //   } else {

    //     pointB[0] = coordinates[index][0];
    //     pointB[1] = coordinates[index][1];
    //     console.log("a", pointA, "b", pointB)
    //     onRoute = true;
    //   }
    // }
  };

  const getPointData = (index: number) => {
    //console.log('!!!',index)
    return {
      hintContent: nameCoordinates[index],
      balloonContent: PressBalloon(index),
    };
  };

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
      //iconLayout: 'default#image',
      //iconImageHref: 'images/myIcon.gif',
      // iconImageSize: [30, 42],
      // iconImageOffset: [-3, -42],
    };
  };

  const addRoute = (ymaps: any) => {
    console.log('3333', pointA);
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [pointA, pointB],
        params: {
          //   routingMode: "auto",
          //reverseGeocoding: true
        },
      },
      {
        //wayPointVisible: false,
        //wayPointDraggable: true,
        boundsAutoApply: false,
      },
    );
    if (mapp.current) mapp.current.geoObjects.add(multiRoute);
  };

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
          <Map
            modules={[
              'multiRouter.MultiRoute',
              'templateLayoutFactory',
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
            width={'99.5%'}
            height={'100%'}>
            {coordinates.map((coordinate, idx) => (
              <Placemark
                key={idx}
                geometry={coordinate}
                properties={getPointData(idx)}
                options={getPointOptions()}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                instanceRef={(ref: any) => {
                  ref &&
                    ref.events.add('balloonopen', () => {
                      PressBalloonBody(idx);
                    });
                }}
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
