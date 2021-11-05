/* ------------
This will do the logic for the CPU scheduling when their are mutple running processes.
*/
module TSOS {
    export class Scheduler{
        constructor() {}
        //determines which process will be running processe
        public currentProcess(): void{

            //more than one process running
            if(_ReadyPCBList.length > 0){
                if((_ReadyPCBList.length == 1) && (_CurrentPCB == null)){
                    var currentPcb  = [_ReadyPCBList[0]];
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ,currentPcb));
                }
                _CPU.isExecuting = true;


            }
            else{
                _CPU.isExecuting = false;
            }

           

       
    }//current process
}}