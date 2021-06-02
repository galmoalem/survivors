import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {SurvivorModule} from './domain/modules/survivor-module';


@Module({
  imports: [
    SurvivorModule,
    MongooseModule.forRoot('mongodb://localhost:27017/Survivors', { useNewUrlParser: true , useFindAndModify: false  })

  ],
})
export class AppModule {}
