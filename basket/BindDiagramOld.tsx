import * as React from 'react';
//import ReactDOM from "react-dom";

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
} from 'react-yandex-maps';

// const mapState = {
//   center: [48.704272, 65.60203],
//   zoom: 4
// };

// const COLORS = ["#F0F075", "#FB6C3F", "#3D4C76", "#49C0B5"];

const mapData = {
  center: [55.751574, 37.573856],
  zoom: 8,
};

const coordinates = [
  [55.684758, 37.738521],
  [57.684758, 39.738521],
];

const BindDiagram = () => {
  //const mapRef = React.createRef(null);

  // () => {
  const [zoom, setZoom] = React.useState(10);
  const mapState = React.useMemo(() => ({ center: [55.75, 37.57], zoom }), [zoom]);

  //отслеживание изменения размера экрана
  // const [size, setSize] = React.useState(0);
  // React.useLayoutEffect(() => {
  //   function updateSize() {
  //     setSize(window.innerWidth);
  //   }
  //   window.addEventListener('resize', updateSize);
  //   updateSize();
  //   return () => window.removeEventListener('resize', updateSize);
  // }, []);

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <YMaps>
          <Map
            defaultState={mapData}
            // defaultState={{
            //   center: [55.75, 37.57],
            //   zoom: 10,
            //   //controls: ['zoomControl', 'fullscreenControl'],
            //   controls: [],
            // }}
            width={'99.5%'}
            height={'100%'}>
            {/* <Placemark
              defaultGeometry={[55.75, 37.57]}
              properties={{
                balloonContentBody: 'This is balloon loaded by the Yandex.Maps API module system',
              }}
            /> */}
            {coordinates.map((coordinate) => (
              <Placemark geometry={coordinate} />
            ))}
            <FullscreenControl />
            <GeolocationControl options={{ float: 'left' }} />
            <ListBox data={{ content: 'Выберите город' }}>
              <ListBoxItem data={{ content: 'Москва' }} />
              <ListBoxItem data={{ content: 'Омск' }} />
              <ListBoxItem data={{ content: 'Иркутск' }} />
            </ListBox>
            <RouteButton options={{ float: 'right' }} />
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

// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
// import Button from '@mui/material/Button';

//   console.log('BindDiagram - props:', props);

//   const [open, setOpen] = React.useState(false);
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const handleToggle = () => {
//     setOpen(!open);
//   };

//   return (
//     <div>
//       <Button onClick={handleToggle}>Show backdrop</Button>
//       <Backdrop
//         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={open}
//         onClick={handleClose}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     </div>
//   );
