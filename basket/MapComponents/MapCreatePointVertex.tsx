import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import MapCreatePoint from "./MapCreatePoint";
import MapCreateVertex from "./MapCreateVertex";

import { styleModalEnd, styleModalMenu } from "./../MainMapStyle";

const MapCreatePointVertex = (props: {
  setOpen: any;
  region: number;
  coord: any;
  createPoint: any;
}) => {
  const styleSet = {
    position: "absolute",
    marginTop: "24vh",
    marginLeft: "27vh",
    width: 340,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const [openSet, setOpenSet] = React.useState(true);
  const [openSetPoint, setOpenSetPoint] = React.useState(false);
  const [openSetVert, setOpenSetVert] = React.useState(false);

  const handleCloseSet = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSet(false);
  };

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleClose = (mode: number) => {
    if (mode === 1) {
      setOpenSetPoint(true);
    } else {
      setOpenSetVert(true);
    }
    setOpenSet(false);
  };

  return (
    <>
      <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
        <>
          <Box sx={styleSet}>
            <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">Что создаём?</Typography>
              <br />
              <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
                Точку
              </Button>
              &nbsp;
              <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
                Перекрёсток
              </Button>
            </Box>
          </Box>
        </>
      </Modal>
      {openSetPoint && (
        <MapCreatePoint
          setOpen={props.setOpen}
          region={props.region}
          coord={props.coord}
          createPoint={props.createPoint}
        />
      )}
      {openSetVert && (
        <MapCreateVertex
          setOpen={props.setOpen}
          region={props.region}
          coord={props.coord}
          createPoint={props.createPoint}
        />
      )}
    </>
  );
};

export default MapCreatePointVertex;
