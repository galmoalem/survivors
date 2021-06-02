import { Injectable } from '@nestjs/common';
import { Model ,Types} from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Survivor,Location} from './survivor-interface'
import {CreateSurvivorDTO} from './survivor-dto';
import { BadRequestException , NotFoundException ,ConflictException} from '@nestjs/common'


@Injectable()
export class SurvivorService {

    constructor(@InjectModel('Survivor') private readonly survivorModel: Model<Survivor>) 
    { }


    async getAllSurvivors(): Promise<Survivor[]> {
     
        const survivors = await this.survivorModel.find();




        return survivors;
    }



    async getAllInfected(): Promise<number> {
     
        let numOfInfected = 0
        let numOfAll = 0 

        const survivors = await this.getAllSurvivors();

         survivors.forEach((item) => {
             numOfAll = numOfAll +1 ;
                if( item.numOfReports >= 3) 
                numOfInfected = numOfInfected +1 
            }          
        )


        return (numOfAll / numOfInfected ) * 100;
    }


    async getLostPoints(): Promise<number> {

        let sumOfLostPoints = 0 ;

        const survivors = await this.getAllSurvivors();

        survivors.forEach(async (item) => {
         
               if( item.numOfReports < 3) 
               sumOfLostPoints = sumOfLostPoints + await this.calculteItems(item.items)
           }          
       )



            return sumOfLostPoints

    }





    async getAverageOfSurvivors(): Promise<number> {

        let sumOfPoints = 0 ;
        let countOfSurvivors = 0 ;
        const survivors = await this.getAllSurvivors();

        survivors.forEach(async (item) => {
         
               if( item.numOfReports < 3) 
               {countOfSurvivors = countOfSurvivors + 1 
            
                sumOfPoints = sumOfPoints + await this.calculteItems(item.items)
            }
              
           }          
       )



            return ( sumOfPoints / countOfSurvivors) *  100 ;

    }

    async getAllHealthy(): Promise<number> {
     
     
        let numOfHealthy = 0
        let numOfAll = 0 

        const survivors = await this.getAllSurvivors();

          survivors.forEach((item) => {
             numOfAll = numOfAll + 1 ;
                if( item.numOfReports < 3) 
                numOfHealthy = numOfHealthy + 1 
            }          
        )


        return (numOfAll / numOfHealthy ) * 100;
    }

  
    async deleteAll() {
      
         await this.survivorModel.deleteMany();
    }
   

    async getSurvivor(survivorID : string): Promise<Survivor> {
    
        if(! Types.ObjectId.isValid(survivorID)) 
            throw new BadRequestException('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
      
         const surv = await this.survivorModel.findById( survivorID ).exec();
        console.log(surv)
        if(!surv)
            throw new NotFoundException('this survivorID does not exist  ' + survivorID)
        return surv;
    }

    // post a single 
    async addSurvivor(createSurvivorDTO: CreateSurvivorDTO): Promise<Survivor> {
        const params = {
          
            name : createSurvivorDTO.name,
          
            age : createSurvivorDTO.age,
          
            gender : createSurvivorDTO.gender,
            
            numOfReports : 0 , 
            
            location: createSurvivorDTO.location ,
            items : createSurvivorDTO.items
          }
          
      
        const newSurvivor = await new this.survivorModel(params);

        return newSurvivor.save();
    }
    
    async updateSurvivorLocation(survivorID, longitude : number, latitude : number): Promise<Survivor> {
        

      
        const surv = await this.getSurvivor(survivorID)

        if ( surv.numOfReports >= 3)
             throw new ConflictException('user is infected')

       

        const params = {
          
            name : surv.name,
          
            age : surv.age,
          
            gender : surv.gender,
            
            numOfReports : surv.numOfReports , 
            
            location: {longitude : longitude, latitude :latitude

            } ,
            items : surv.items
          }
          
         
              
               const updatedSurv = await this.survivorModel.updateOne({_id:survivorID},params)
             
               return this.getSurvivor(survivorID);
            }




    async updateSurvivorTrades(traderID,traderID2,itemsOfTrade1 , itemsOfTrade2): Promise<void> {

        const surv1 = await this.getSurvivor(traderID)

        const surv2 = await this.getSurvivor(traderID2)

        if(surv1.numOfReports >= 3 || surv2.numOfReports >= 3)
            throw new ConflictException('one of the traders is infected')

        let sumOfTrader1 = this.calculteItems(itemsOfTrade1) 

        let sumOfTrader2 = this.calculteItems(itemsOfTrade2) 

        let survSumOfItems1 =  this.calculteItems(surv1.items) 

        let survSumOfItems2 =  this.calculteItems(surv2.items) 

        if ( sumOfTrader1 > survSumOfItems1 ||  sumOfTrader2 > survSumOfItems2 )
                throw new ConflictException('one of the traders cant afford those items')
        
        if(sumOfTrader1 !==  sumOfTrader2)
             throw new ConflictException('one of the traders cant afford those items')
        


          
        let newItems1 = surv1.items.map((item) => {
           
            if(! itemsOfTrade1.includes(item))
                return item
        })
        

        let newItems2 = surv2.items.map((item) => {
           
            if(! itemsOfTrade2.includes(item))
                return item
        })

        newItems1.concat(itemsOfTrade2)
        newItems2.concat(itemsOfTrade1)

       
        this.updateSurvivorItems(traderID,surv1,newItems1)
         
        this.updateSurvivorItems(traderID2,surv2,newItems2)



    }




    async updateSurvivorItems ( survivorID, survivor, newItems): Promise<void> {


        
      const params = {
          
        name : survivor.name,
      
        age : survivor.age,
      
        gender : survivor.gender,
        
        numOfReports :survivor.numOfReports , 
        
        location: survivor.location ,

        items : newItems
      }
      


      const updatedSurv = await this.survivorModel
      .findByIdAndUpdate(survivorID, params, { new: true });
    


    }


    async calculteItems(items : [string]) :Promise< number > {
       
      let sum = 0 ;

      if (! items)
         return sum

      items.map((item)=> {
           
           if ( item.toLowerCase() === 'Water' )
                sum = sum + 4

          if ( item.toLowerCase() === 'Food' )
                sum = sum + 3
  
          if ( item.toLowerCase() === 'Medication' )
                sum = sum + 2
            
          if ( item.toLowerCase() === 'Ammunition' )
                sum = sum + 1

        })
        
        return sum ;

    }




    async updateSurvivorInfected(survivorID): Promise<Survivor> {
        
      
        const surv = await this.getSurvivor(survivorID)

      let  numOfReports = surv.numOfReports + 1
       
      
      const params = {
          
            name : surv.name,
          
            age : surv.age,
          
            gender : surv.gender,
            
            numOfReports  , 
            
            location: surv.location ,

            items : surv.items
          }
          
              
               const updatedSurv = await this.survivorModel
               .findByIdAndUpdate(survivorID, params, { new: true });
             
               return updatedSurv;

            }




    
   
    
    


    
   



}