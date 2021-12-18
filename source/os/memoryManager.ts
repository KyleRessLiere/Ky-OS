module TSOS {

    export class MemoryManager {
         constructor(){}
         
         public load(input,section,pid){
          if (section != "disk") {
               // load them into memory
               
               for (var i = 0; i < input.length; i++){
                   _Memory.memoryArray[i + _Memory.getSectionBase(section)] = input[i];
               }
           } else {
               _diskDriver.createSwap(pid,input);
           }
           Control.cpuUpdate;
           Control.memoryUpdate;
              }
         
         public isMemoryAvailable(): boolean {
          let available = false;
          if(_PCBList.length < 3){
               available = true;
          }
          return available;
          
     }//isMemoryAvailable

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
                         case "disk":                         break;
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
         public getPCB(pid:number){
          for (var PCB of _PCBList) {
               if (PCB.PID == pid){
                   return PCB;
               }
           }
         }

         
         public isResident(pid: number): boolean{
              for(let PCB of _PCBList)
              if(PCB.PID == pid)
              return true;
         }//isResident

         //finds the index in the pcb list given pid
         public pidIndex(list: TSOS.PCB[],givenPID:number){
          for (var i = 0; i < list.length; i++) {
               if (list[i].PID == givenPID) {
                   
                   return i;
               } 
         }//pid index
    }
    public PCBisReady(givenPID: number) {
     for (var PCB of _ReadyPCBList) {
         if (PCB.PID == givenPID){
             return true;
         }
     }
 }//pcbisReady

 public rollInProcess(PID: number) {
     var data: string[] = [];
     var PCB = this.getPCB(PID);
     var pcbs: TSOS.PCB[] = [];
     let i = 0;
     while( i < _PCBList.length) {
         if (_PCBList[i].location == "Memory") {
            pcbs[pcbs.length] = _PCBList[i];
         }
         i++;
     }
     if (pcbs.length < 3) {
         // get the data
         data = _diskDriver.getRollInData(PID);
      
         PCB.section = this.memorySection();
        
         PCB.location = "Memory";
         this.load(data, PCB.section , PID);
     } else {
         let x =0;
         this.rollOutProcess();
         // get the data
         data= _diskDriver.getRollInData(PID);
         // change the section
         PCB.section = this.memorySection();
         // change the location
         PCB.location = "Memory";
         this.load(data, PCB.section, PID);
     }
 }

 public rollOutProcess() {
   
     var rollOutPCB: TSOS.PCB = _Scheduler.rollOutDecision();
     _PCBList[this.pidIndex(_PCBList,rollOutPCB.PID)].swaps++;

     // write the data from memory to the disk
     var data: string[] = [];
     let i = _Memory.getSectionBase(rollOutPCB.section);
     while (i < _Memory.getSectionEnd(rollOutPCB.section)){
         let x = 0;
        data[data.length] = _Memory.memoryArray[i];
         i++;
     }
     _diskDriver.createSwap(rollOutPCB.PID,data);

  
     this.clearMemory(rollOutPCB.section);

     let index = this.pidIndex(_PCBList,rollOutPCB.PID);
     _PCBList[index].location = "Disk";
     _PCBList[index].section = "disk";
 }

 // loads a process on the disk of there is free space in memory
 public loadDiskProcess() {
    //check to se if their is process running
    let process = false;
    let i = 0;
     while ( i < _PCBList.length) {
         if (_PCBList[i].location == "Disk") {
             process = true;
             i++;
         }
     }
     

     if (process) {
         var PCB: TSOS.PCB;
         let i = 0;
         while( i < _PCBList.length) {
             if (_PCBList[i].location == "Disk"){
                 let x =0;
                 PCB = _PCBList[i];
                 i++;
             }
         }
         this.rollInProcess(PCB.PID);
     }

 }//loadDiskProcess
 


 
 
 

}}