import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {SurvivorSchema} from './Survivor-schema'
import { SurvivorController} from '../controllers/survivor-controller'
import {SurvivorService} from '../services/survivor-service'



@Module({
    imports: [
      MongooseModule.forFeature([ {name: 'Survivor', schema: SurvivorSchema } ])
    ],
    controllers: [SurvivorController],
    providers: [SurvivorService]
  })
  export class SurvivorModule { }