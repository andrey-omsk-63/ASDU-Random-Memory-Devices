export interface DateRPU {
    bopt:         number;
    brpu:         number;
    ntu:          number;
    ndk:          number;
    naptoph:      GB[];
    tirtonap:     Tirtonap[];
    counts:       Count[];
    timetophases: Timetophase[];
    rpus:         Rpus[];
    prombase:     Prom[];
    prom:         Prom[];
    redgs:        Greenout[];
    nks:          number[];
    cks:          Ck[];
    konf:         Greenout[];
    tvps:         Tvp[];
    gbs:          GB[];
    greenout:     Greenout[];
    powerout:     Greenout[];
    redout:       Greenout[];
    yellowout:    Greenout[];
    phases:       null;
    switches:     null;
    konfprom:     null;
    brokens:      null;
}

export interface Ck {
    number: number;
    lines:  Line[];
}

export interface Line {
    time:   number;
    number: number;
}

export interface Count {
    num:     number;
    id:      number;
    type:    number;
    default: number;
}

export interface GB {
    nph:  number;
    naps: number[];
}

export interface Greenout {
    number: number;
    mask:   string;
}

export interface Prom {
    nap: number;
    gd:  number;
    gb:  number;
    yel: number;
    red: number;
    ry:  number;
}

export interface Rpus {
    number: number;
    tcycle: number;
    cont:   boolean;
    pahses: Pahse[];
}

export interface Pahse {
    phase: number;
    time:  number;
}

export interface Timetophase {
    nphase: number;
    tmax:   number;
    tmin:   number;
}

export interface Tirtonap {
    num:      number;
    type:     number;
    green:    number;
    yellow:   number;
    counter?: number;
    reds:     number[];
}

export interface Tvp {
    number: number;
    wait:   number;
    phases: any[];
}
