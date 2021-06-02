import { Document } from 'mongoose';

export interface Location  {
    readonly  latitude : number;
    readonly  longitude : number;
    
}

export interface Survivor extends Document {

    readonly name: string;

     readonly location : Location;

    readonly age : number;

    readonly items : [string];

    readonly gender : string;
    
    readonly numOfReports : number;
}
