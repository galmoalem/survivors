import * as mongoose from 'mongoose';
import {LocationSchema} from './location-schema'
export const SurvivorSchema = new mongoose.Schema({


    name : String,


    items : [String],

    age : Number,

    gender : String ,
    
    numberOfReorts : Number,

    location : LocationSchema
})