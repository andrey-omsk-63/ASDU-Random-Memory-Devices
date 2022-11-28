//=== GsSetPhase ===================================
export const SendSocketCreateRoute = (debug: boolean, ws: WebSocket, maskRoutes: any) => {
  console.log('CreateRoute:', maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'createRoute',
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
          }),
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

export const SendSocketUpdateRoute = (debug: boolean, ws: WebSocket, maskRoutes: any) => {
  console.log('UpdateRoute:', maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'updateRoute',
            region: maskRoutes.region,
            description: maskRoutes.description,
            listTL: maskRoutes.listTL,
          }),
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

export const SendSocketDeleteRoute = (debug: boolean, ws: WebSocket, maskRoutes: any) => {
  console.log('DeleteRoute:', maskRoutes);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'deleteRoute',
            region: maskRoutes.region,
            description: maskRoutes.description,
          }),
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
  turnOnProps: boolean,
) => {
  console.log('Route:', turnOnProps, devicesProps);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'route',
            devices: devicesProps,
            turnOn: turnOnProps,
          }),
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
  faza: number,
) => {
  //console.log('Dispatch:', idevice, cmdd, faza);
  const handleSendOpen = () => {
    if (!debug) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'dispatch',
            id: idevice,
            cmd: cmdd,
            param: faza,
          }),
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
//=== SendSocket ===================================
export const SendSocketGetPhases = (
  debugging: boolean,
  ws: WebSocket,
  region: string,
  area: string,
  id: number,
) => {
  //console.log("GetPhases:", region, area, id);
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'getPhases',
            pos: { region, area, id },
          }),
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

