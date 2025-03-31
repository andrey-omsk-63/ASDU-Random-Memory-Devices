import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { AiTwotoneRightCircle } from "react-icons/ai";

import { OutputVertexImg, CircleObj } from "../RgsServiceFunctions";

import { styleStrokaBoxlImg, styleStrokaTablImg } from "./GsComponentsStyle";
import { styleStrokaTabl04, styleStrokaTabl05 } from "./GsComponentsStyle";
import { styleStrokaTabl06 } from "./GsComponentsStyle";

//import { host } from "./RgsToDoMode";

const GsFieldOfMiracles = (props: {
  idx: number;
  func: Function;
  ClVert: Function;
  ClBox: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map.dateMap;
  });
  let massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const debug = datestat.debug;
  const DEMO = datestat.demo;
  const IDX = props.idx;
  let massf = massfaz[IDX];
  //========================================================
  const intervalFazaDop = datestat.intervalFazaDop; // Увеличениение длительности фазы ДУ (сек)
  const [hintCounter, setHintCounter] = React.useState(false);
  const [hintVertex, setHintVertex] = React.useState(false);

  let intervalfaza = datestat.counterId[props.idx]; // Задаваемая длительность фазы ДУ (сек)

  let runREC = JSON.parse(JSON.stringify(massf.runRec));
  let bull = runREC === 2 || runREC === 4 ? " •" : " ";
  let hostt =
    window.location.origin.slice(0, 22) === "https://localhost:3000"
      ? "https://localhost:3000/"
      : "./";
  let host = hostt + "18.svg"; // передаётся в GsFieldOfMiraclesо export
  if (DEMO && debug) {
    host = hostt + "1.svg";
    if (bull === " •" && runREC === 2) host = hostt + "2.svg";
    if (bull !== " •" && runREC === 5) host = hostt + "2.svg";
  }
  if (!debug && massf.id <= 10000) {
    let num = map.tflight[massf.idx].tlsost.num.toString();
    if (DEMO) {
      num = "1";
      if (bull === " •" && runREC === 2) num = "2";
      if (bull !== " •" && runREC === 5) num = "2";
    }
    host = window.location.origin + "/free/img/trafficLights/" + num + ".svg";
  }
  let hinter =
    massf.id <= 10000
      ? map.tflight[massfaz[IDX].idx].tlsost.description
      : "Точка входа/выхода";
  let finish = runREC !== 1 && runREC !== 5 && runREC > 0 ? true : false;

  return (
    <>
      <Grid item xs={1.8} sx={styleStrokaTabl06}>
        {finish && massfaz[IDX].id <= 10000 && intervalfaza > 0 && (
          <Grid
            container
            sx={{ cursor: "pointer" }}
            onClick={() => props.func(IDX)}
            onMouseEnter={() => setHintCounter(true)}
            onMouseLeave={() => setHintCounter(false)}
          >
            <Grid item xs={7} sx={{ textAlign: "right" }}>
              {intervalFazaDop > 0 && (
                <>
                  <Box sx={{ fontSize: 21 }}>
                    <AiTwotoneRightCircle />
                  </Box>
                  {hintCounter && (
                    <Box sx={styleStrokaTabl05}>
                      Увеличить на {intervalFazaDop}сек
                    </Box>
                  )}
                </>
              )}
            </Grid>
            <Grid item xs sx={{ padding: "4px 0 0 0", textAlign: "center" }}>
              {intervalfaza}
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={1.0} sx={{ marginTop: 0.5, cursor: "pointer" }}>
        <Grid
          container
          onMouseEnter={() => setHintVertex(true)}
          onMouseLeave={() => setHintVertex(false)}
        >
          {!finish && massf.id <= 10000 && (
            <Box sx={styleStrokaBoxlImg} onClick={() => props.ClBox(IDX)}>
              {OutputVertexImg(host)}
            </Box>
          )}
          {massf.id > 10000 && <>{CircleObj()}</>}
          {finish && massf.id <= 10000 && massf.fazaSist > 0 && (
            <Button sx={styleStrokaTablImg} onClick={() => props.ClVert(IDX)}>
              {OutputVertexImg(host)}
            </Button>
          )}

          {finish && massf.id <= 10000 && massf.fazaSist < 0 && (
            <Box sx={styleStrokaBoxlImg} onClick={() => props.ClBox(IDX)}>
              {OutputVertexImg(host)}
            </Box>
          )}
          {hintVertex && <Box sx={styleStrokaTabl04}>{hinter}</Box>}
        </Grid>
      </Grid>
    </>
  );
};

export default GsFieldOfMiracles;
