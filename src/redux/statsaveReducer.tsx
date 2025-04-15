import { STATSAVE_CREATE } from "./types";
import { dateStat } from "./../App";

const intialState = {
  datestat: dateStat,
};

export const statsaveReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case STATSAVE_CREATE:
      return {
        ...state,
        datestat: action.data,
      };

    default:
      return state;
  }
};
