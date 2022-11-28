import { COORDINATES_CREATE } from './types';
import { Coordinates } from './../App';

const intialState = {
  coordinates: Coordinates,
};

export const coordinatesReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case COORDINATES_CREATE:
      return {
        ...state,
        coordinates: action.data,
      };

    default:
      return state;
  }
};
