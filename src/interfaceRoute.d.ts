export interface DateRoute {
    type: string;
    data: Data;
}

export interface Data {
    points:   any[];
    vertexes: Vertex[];
    ways:     Way[];
}

export interface Vertex {
    region: number;
    area:   number;
    id:     number;
    dgis:   string;
    scale:  number;
    lin:    number[];
    lout:   number[];
    name:   string;
}

export interface Way {
    region:     number;
    sourceArea: number;
    sourceID:   number;
    targetArea: number;
    targetID:   number;
    lsource:    number;
    ltarget:    number;
    starts:     string;
    stops:      string;
    lenght:     number;
    time:       number;
}
