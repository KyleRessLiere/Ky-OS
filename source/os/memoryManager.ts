module TSOS {

    export class MemoryManager {
         constructor(){}

         public load(input,index){
             //console.log(_MemoryAccessor.sectionIndex());
              let code = input;
              for(var i=0;i<code.length;i++){
                   _Memory.memoryArray[i] = code[i];
                   
              }
              console.log(_Memory.memoryArray)
         }

         public clearMemory(startIndex:number, endIndex:number){
              //clears memory wihtin a given range
              for(var i=startIndex;i<endIndex;i++){
                   _Memory.memoryArray[i] = "00";
              }

         }
         public memorySection(){
              var section = "1";
              return section;
         }
     
    }}