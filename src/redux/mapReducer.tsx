import { MAP_CREATE } from "./types";

import { dateMapGl } from "./../App";

const intialState = {
  map: dateMapGl,
};

export const mapReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case MAP_CREATE:
      return {
        ...state,
        map: action.data,
      };

    default:
      return state;
  }
};
