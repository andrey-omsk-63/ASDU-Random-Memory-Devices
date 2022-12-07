export interface Welcome21 {
    type: string;
    data: Data;
}

export interface DateBindings {
    tfLinks: TfLink[];
}

export interface TfLink {
    id:     string;
    tflink: Tflink;
}

export interface Tflink {
    west:  Add1;
    north: Add1;
    east:  Add1;
    south: Add1;
    add1:  Add1;
    add2:  Add1;
}

export interface Add1 {
    id:             string;
    wayPointsArray: WayPointsArray[];
}

export interface WayPointsArray {
    id:    string;
    phase: string;
}