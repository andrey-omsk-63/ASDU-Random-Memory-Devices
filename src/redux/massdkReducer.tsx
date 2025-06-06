import { MASSDK_CREATE } from "./types";
import { massDk } from "./../App";

const intialState = {
  massdk: massDk,
};

export const massdkReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case MASSDK_CREATE:
      return {
        ...state,
        massdk: action.data,
      };

    default:
      return state;
  }
};
