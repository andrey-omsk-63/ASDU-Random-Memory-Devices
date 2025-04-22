import { debug, WS } from "./../App";

//=== GsToDoMode ===================================
export const SendSocketRoute = (
  devicesProps: Array<number>,
  turnOnProps: boolean
) => {
  //console.log('Route:', turnOnProps, devicesProps);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
  idevice: number,
  cmdd: number,
  faza: number
) => {
  console.log('Dispatch:', idevice, cmdd, faza);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
export const SendSocketGetBindings = () => {
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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

export const SendSocketGetAddObjects = () => {
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
//=== MainMapRgs ====-----==========================
export const SendSocketGetSvg = (region: string, area: string, id: number) => {
  //console.log("getSvg:", id);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "getSvg",
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

export const SendSocketGetPhases = (
  region: string,
  area: string,
  id: number
) => {
  //console.log("getPhases:", id);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
export const SendSocketСreateAddObj = (dat: any) => {
  console.log("createAddObj:", dat);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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

export const SendSocketDeleteAddObj = (dat: any) => {
  console.log("deleteAddObj:", dat);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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

export const SendSocketUpdateBindings = (dat: any) => {
  console.log("updateBindings:", dat);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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

export const SendSocketDeleteBindings = (dat: any) => {
  console.log("deleteBindings:", dat);
  const handleSendOpen = () => {
    if (!debug) {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "deleteBindings",
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
