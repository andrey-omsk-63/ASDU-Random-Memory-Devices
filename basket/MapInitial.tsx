import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";
import { coordinatesCreate } from "./../../redux/actions";

import {
  DecodingCoord,
  CenterCoord,
  MasskPoint,
} from "./../MapServiceFunctions";

const MapInitial = (props: { func: any }) => {
  console.log('222222')
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //===========================================================
  let pointCenter: any = 0;

  for (let i = 0; i < massroute.points.length; i++) {
    massroute.vertexes.push(massroute.points[i]);
  }
  for (let i = 0; i < massroute.vertexes.length; i++) {
    let masskPoint = MasskPoint();
    masskPoint.ID = massroute.vertexes[i].id;
    masskPoint.coordinates = DecodingCoord(massroute.vertexes[i].dgis);
    masskPoint.nameCoordinates = massroute.vertexes[i].name;
    masskPoint.region = massroute.vertexes[i].region;
    masskPoint.area = massroute.vertexes[i].area;
    masskPoint.newCoordinates = 0;
    massdk.push(masskPoint);
    coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
  }
  dispatch(massdkCreate(massdk));
  dispatch(massrouteCreate(massroute));
  dispatch(coordinatesCreate(coordinates));
  pointCenter = CenterCoord(
    map.dateMap.boxPoint.point0.Y,
    map.dateMap.boxPoint.point0.X,
    map.dateMap.boxPoint.point1.Y,
    map.dateMap.boxPoint.point1.X
  );

  console.log('1pointCenter',pointCenter)

  return <>{props.func(pointCenter)}</>;
};

export default MapInitial;
