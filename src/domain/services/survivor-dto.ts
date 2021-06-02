
export class CreateSurvivorDTO {
    
    readonly name: string;

    readonly location : LocationDTO ;

    readonly age: number ; 

    readonly items: [string] ;
    
    readonly gender: string;

}




export class LocationDTO {
    
    readonly longitude: number;

    readonly altitude: number;

}



export class TradeItems {
   
   
    readonly survId1;
    readonly survId2;

    readonly items1: [string] ;

    readonly items2: [string];

}