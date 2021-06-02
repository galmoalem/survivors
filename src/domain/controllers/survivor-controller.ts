import { Controller, Get, Res, HttpStatus, Post, Body, Put, NotFoundException, Delete, Param } from '@nestjs/common';
import {CreateSurvivorDTO , LocationDTO ,TradeItems} from '../services/survivor-dto'
import {SurvivorService} from '../services/survivor-service'




@Controller()
export class SurvivorController {
    constructor(private survivorService: SurvivorService) { }


    
    // add a Survivor
    @Post('/create')
    async addSurvivor(@Res() res, @Body() createSurvivorDTO: CreateSurvivorDTO) {
       
        const survivor = await this.survivorService.addSurvivor(createSurvivorDTO);
      
        return res.status(HttpStatus.OK).json({
            message: "survivor has been created successfully",
            survivor: survivor
        })
    }

    @Put('/location/:survivorId')
    async updateLocation(@Res() res  , @Param('survivorId') survivorId , 
    @Body() locationDTO: LocationDTO) {
        const surv = await this.survivorService.updateSurvivorLocation(survivorId, 
            locationDTO.longitude,locationDTO.altitude);

        return res.status(HttpStatus.OK).json(surv);
    }


    
    @Put('/infected/:survivorId')
    async updateInfected(@Res() res  , @Param('survivorId') survivorId ){

          const surv =  this.survivorService.updateSurvivorInfected(survivorId)
   
            
           return res.status(HttpStatus.OK).json(surv);
        }




    @Put('/trade')
    async trade( @Res() res  ,@Body() tradeItems :TradeItems  ){

        this.survivorService.updateSurvivorTrades(tradeItems.survId1,tradeItems.survId2,
            tradeItems.items1,tradeItems.items2)

            return res.status(HttpStatus.OK)
    }


    @Get('/survivors/infected')
    async getPercentageOfInfected(@Res() res) {

        const numOfInfected = await this.survivorService.getAllInfected()
        return res.status(HttpStatus.OK).json(numOfInfected);
    }

    @Get('/survivors/healthy')
    async getPercentageOfHealthy(@Res() res) {

        const numOfHealthy = await this.survivorService.getAllHealthy()
        return res.status(HttpStatus.OK).json(numOfHealthy);
    }

   

    @Get('/survivors/avg')
    async getAvg(@Res() res) {

        const num = await this.survivorService.getAverageOfSurvivors()
        return res.status(HttpStatus.OK).json(num);
    }

    @Get('/survivors/lost')
    async getLostPoints(@Res() res) {

        const num = await this.survivorService.getLostPoints()
        return res.status(HttpStatus.OK).json(num);
    }

    

 

}