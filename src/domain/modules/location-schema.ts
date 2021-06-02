import { DH_NOT_SUITABLE_GENERATOR } from 'constants';
import * as mongoose from 'mongoose';
import {SurvivorSchema} from './Survivor-schema'



export const LocationSchema = new mongoose.Schema({
    
    latitude : Number ,
    longitude :Number
})