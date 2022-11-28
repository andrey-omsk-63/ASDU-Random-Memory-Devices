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

  const mapState = {
    center: [55.739625, 37.5412],
    zoom: 12,
  };

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

  const getPointData = (index: number) => {
    return {
      hintContent: nameCoordinates[index],
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
    const pointA = [coordinates[0][0], coordinates[0][1]];
    //const pointA = [0, 0];
    const pointB = [coordinates[2][0], coordinates[2][1]];
    //const pointB = [0, 0];

    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [pointA, 0],
        params: {
          //   routingMode: "auto",
          //reverseGeocoding: true
        },
      },
      {
        //wayPointVisible: false,
        wayPointDraggable: true,
        //boundsAutoApply: true,
      },
    );

    if (mapp.current) mapp.current.geoObjects.add(multiRoute);
  };

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
          {/* <YMaps> */}
          <Map
            modules={['multiRouter.MultiRoute', 'templateLayoutFactory']}
            //state={mapState}
            defaultState={mapData}
            //instanceRef={mapp}
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
            <SearchControl options={{ float: 'right' }} />
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
