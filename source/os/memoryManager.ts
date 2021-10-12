module TSOS {

    export class MemoryManager {
         constructor(){}

         public load(input,index){
              var userCode = input.split(" ");
              for(var i=0;i<userCode.length;i++){
                   _Memory.memoryArray[i] = userCode[i];
                 
              }
         }

         public clearMemory(startIndex:number, endIndex:number){
              //clears memory wihtin a given range
              for(var i=startIndex;i<endIndex;i++){
                   _Memory.memoryArray[i] = "00";
              }

         }
     
    }}