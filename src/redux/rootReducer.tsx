import { combineReducers } from "redux";
import { mapReducer } from "./mapReducer";
import { bindingsReducer } from "./bindingsReducer";
import { addobjectsReducer } from "./addobjectsReducer";
import { coordinatesReducer } from "./coordinatesReducer";
import { statsaveReducer } from "./statsaveReducer";

import { massdkReducer } from "./massdkReducer";
import { massfazReducer } from "./massfazReducer";
import { massmodeReducer } from "./massmodeReducer";

export const rootReducer = combineReducers({
  mapReducer,
  bindingsReducer,
  addobjectsReducer,
  statsaveReducer,
  coordinatesReducer,
  //===========================================================
  massdkReducer,
  massfazReducer,
  massmodeReducer,
});
