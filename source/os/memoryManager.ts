module TSOS {

    export class MemoryManager {
         constructor(){}

         public load(input,index){
              var userCode = input.split(" ");
              for(var i=0;i<userCode.length;i++){
                   _Memory.memoryArray[i] = userCode[i];
                   
              }
         }
     
    }