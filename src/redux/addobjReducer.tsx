import { ADDOBJ_CREATE } from "./types";

import { dateAddObjectsGl } from "../App";

const intialState = {
  addobj: dateAddObjectsGl,
};

export const addobjReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case ADDOBJ_CREATE:
      return {
        ...state,
        addobj: action.data,
      };

    default:
      return state;
  }
};
