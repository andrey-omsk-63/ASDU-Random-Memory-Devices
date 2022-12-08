//=== GsSetPhase ===================================
export const SendSocketCreateRoute = (
  debug: boolean,
  ws: WebSocket,
  maskRoutes: any
) => {
  console.log("CreateRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketUpdateRoute = (
  debug: boolean,
  ws: WebSocket,
  maskRoutes: any
) => {
  console.log("UpdateRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "updateRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteRoute = (
  debug: boolean,
  ws: WebSocket,
  maskRoutes: any
) => {
  console.log("DeleteRoute:", maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteRoute",
            region: maskRoutes.region,
            description: maskRoutes.description,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//=== GsToDoMode ===================================
export const SendSocketRoute = (
  debug: boolean,
  ws: WebSocket,
  devicesProps: Array<number>,
  turnOnProps: boolean
) => {
  console.log("Route:", turnOnProps, devicesProps);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "route",
            devices: devicesProps,
            turnOn: turnOnProps,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDispatch = (
  debug: boolean,
  ws: WebSocket,
  idevice: number,
  cmdd: number,
  faza: number
) => {
  //console.log('Dispatch:', idevice, cmdd, faza);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "dispatch",
            id: idevice,
            cmd: cmdd,
            param: faza,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//=== App ==========================================
export const SendSocketGetBindings = (debug: boolean, ws: WebSocket) => {
  console.log("GetBindings");
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "getBindings",
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketGetAddObjects = (debug: boolean, ws: WebSocket) => {
  console.log("GetAddObjects");
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "getAddObjects",
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketGetPhases = (
  debugging: boolean,
  ws: WebSocket,
  region: string,
  area: string,
  id: number
) => {
  //console.log("GetPhases:", region, area, id);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "getPhases",
            pos: { region, area, id },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//=== RgsCreateObject ==============================
export const SendSocketСreateAddObj = (
  debugging: boolean,
  ws: WebSocket,
  dat: any
) => {
  console.log("createAddObj:", dat);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createAddObj",
            data: dat,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteAddObj = (
  debugging: boolean,
  ws: WebSocket,
  dat: any
) => {
  console.log("deleteAddObj:", dat);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteAddObj",
            data: dat,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//=== RgsAppointVertex ==============================
export const SendSocketСreateBindings = (
  debugging: boolean,
  ws: WebSocket,
  dat: any
) => {
  console.log("createBindings:", dat);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createBindings",
            data: dat,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketUpdateBindings = (
  debugging: boolean,
  ws: WebSocket,
  dat: any
) => {
  console.log("updateBindings:", dat);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "updateBindings",
            data: dat,
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//==================================================