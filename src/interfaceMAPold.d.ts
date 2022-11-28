export interface IncomingWebSocketMessage {
    type: string
    data: IncomingDataType
}

export type IncomingDataType =
    MapInfoMsg
    | TflightMsg
    | EditCrossUsersMsg
    | RepaintMsg
    | JumpMsg
    | LoginMsg
    | LogoutMsg
    | CheckConnMsg
    | FragmentMsg
    | ChangeFragmentsMsg
    | ErrorMsg

export type OutcomingWebSocketMessage = OutcomingDataType

export type OutcomingDataType =
    SendLoginMsg
    | SendJumpMsg
    | SendLogoutMsg
    | SendCreateFragmentMsg
    | SendDeleteFragmentMsg

//export interface MapInfoMsg {
export interface DateMAP {
    access: Access
    area: Area
    areaInfo: AreaInfo
    areaZone: AreaZone[]
    authorizedFlag: boolean
    boxPoint: BoxPoint
    description: string
    fragments: Fragment[]
    license: string
    region: string
    regionInfo: RegionInfo
    role: string
    tflight: Tflight[]
}

export interface TflightMsg {
    tflight: Tflight[]
}

export interface EditCrossUsersMsg {
    EditCrossUsers: EditCrossUser[]
}

export interface RepaintMsg {
    areaZone: AreaZone[]
    tflight: Tflight[]
}

export interface JumpMsg {
    boxPoint: BoxPoint
}

export interface SendJumpMsg {
    type: string
    region: string
    area: string[]
}

export interface LoginMsg {
    access: Access
    area: Area
    areaZone: AreaZone[]
    authorizedFlag: boolean
    description: string
    fragments: Fragment[]
    login: string
    region: string
    role: string
    status: boolean
    token: string
    message?: string
}

export interface SendLoginMsg {
    type: string
    login: string
    password: string
}

export interface LogoutMsg {
    authorizedFlag: boolean
}

export interface SendLogoutMsg {
    type: string
}

export interface SendChangePasswordMsg {
    newPW: string
    oldPW: string
}

export interface GetLicenseRequest {
    address: string
    license: string
    message: string
    name: string
    numAcc: number
    numDev: number
    phone: string
    timeEnd: string
}

export interface CheckConnMsg {
    statusBD?: boolean
    statusS?: boolean
}

export interface FragmentMsg {
    fragment: Fragment[]
    status: boolean
}

export interface ChangeFragmentsMsg {
    status: boolean
    fragment: Fragment[]
}

export interface SendCreateFragmentMsg {
    type: string
    data: {
        name: string
        bounds: number[][]
    }
}

export interface SendDeleteFragmentMsg {
    type: string
    data: {
        name: string
    }
}

export interface ErrorMsg {
    message: { error: string }
}

export interface AccountState {
    access: Access | undefined
    area: Area | undefined
    authorizedFlag: boolean
    description: string
    fragments: Fragment[]
    license: string
    region: string
    role: string
    login: string
    status: boolean
    message: string | undefined
}

export interface MapContentState {
    areaInfo: AreaInfo
    areaZone: AreaZone[]
    regionInfo: RegionInfo
    boxPoint: BoxPoint
    statusBD: boolean
    statusS: boolean
    multipleCrossSelect: boolean
    circles: Circle[]
    tflight: Tflight[]
}

export interface Circle {
    coords: number[]
    position: Pos
}

export interface Tflight {
    ID: number
    region: Region
    area: Area2
    subarea: number
    idevice: number
    tlsost: Tlsost
    description: string
    phases: number[]
    points: Points
    inputError: boolean
}

export interface Pos {
    region: string
    area: string
    id: number
}

export interface EditCrossUser {
    edit: boolean
    idevice: number
    pos: Pos
    description: string
    login: string
}

export interface Access {
    [index: number]: boolean
}

export interface Area {
    [index: string]: string
}

export interface AreaInfo {
    [index: string]: Area
}

export interface Zone {
    Y: number
    X: number
}

export interface Sub {
    subArea: number
    zone: Zone[]
}

export interface AreaZone {
    region: string
    area: string
    zone: Zone[]
    sub: Sub[]
}

export interface Point {
    Y: number
    X: number
}

export interface BoxPoint {
    point0: Point
    point1: Point
}

export interface Fragment {
    name: string
    bounds: number[][]
}

export interface RegionInfo {
    [index: string]: string
}

export interface Region {
    num: string
    nameRegion: string
}

export interface Area2 {
    num: string
    nameArea: string
}

export interface Tlsost {
    num: number
    description: string
    control: boolean
}

export interface Points {
    Y: number
    X: number
}