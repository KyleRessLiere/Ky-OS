module TSOS {

    export class MemoryManager {
         constructor(){}

         public load(input,section){
             //console.log(_MemoryAccessor.sectionIndex());
              let code = input;
              for(var i = 0; i < code.length; i ++){
               _Memory.memoryArray[i + _Memory.getSectionBase(section)] = code[i];
                   
              }
         }

         public clearMemory(memSection:string){
              //clears memory within a given range
             let startIndex = _Memory.getSectionBase(memSection);
             let endIndex = _Memory.getSectionEnd(memSection);
             
            //clears memory 
              for(var i=startIndex;i<endIndex;i++){
                   _Memory.memoryArray[i] = "00";
              }

         }
         public memorySection(){
              var sectionOne = "0";
              var sectionTwo = "1";
              var sectionThree = "2";
              var sectionOneStatus = true;
              var sectionTwoStatus = true;
              var sectionThreeStatus = true;
              for(var PCB of _PCBList){
               switch(PCB.section){
                    case "0": 
                         sectionOneStatus = false; 
                    break;
                    case "1":
                          sectionTwoStatus = false; 
                          break;
                    case "2": 
                         sectionThreeStatus = false; 
                         break;
                    default: console.log("Sorry this is a invalid section")
               }
          }
               if(sectionOneStatus){
                    return sectionOne;
               }
               else if(sectionTwoStatus){
                    return sectionTwo;
               }
               else if(sectionThreeStatus){
                    return sectionThree;
               }
               else{
                    console.log("Invalid section");
               }
             
         }//memorySection

         
         public isResident(pid: number): boolean{
              for(let PCB of _PCBList)
              if(PCB.PID == pid)
              return true;
         }//isResident

         //finds the index in the pcb list given pid
         public pidIndex(pid:number,pcbList:TSOS.PCB[]){
              for(let i =0; i < pcbList.length; i ++)
                   if(pcbList[i].PID == pid)
                        return i;   
         }//pid index
     
    }}