/*  -----------------------------

    This makes the CPU scheduling decisions whe there are one or more
    running processes. This also creates the software interrupts that cause
    the cpu to switch which process it is running

    ----------------------------- */

    module TSOS {

        export class Scheduler {
    
            constructor() {}
    
            
    
        // The function that decided which process gets run
        public currentProcess(){
            if (_ScheduleAlgo == "RR" || _ScheduleAlgo== "FCFS") {
                if (_ReadyPCBList.length > 0) {
                    if ((_ReadyPCBList.length == 1) && (_CurrentPCB == null)) {
                        let pcb = [_ReadyPCBList[0]];
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, pcb));
                    } else if (((_CurrentPCB == null))  && _ReadyPCBList.length >= 2) {
                        var nextFound = false;
                        for (var i = 0; i < _ReadyPCBList.length; i++) {
                            if (_ReadyPCBList[i].quantumRan < _RoundRobinQuantum) {
                                var pcbRR = [_ReadyPCBList[i]];
                                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, pcbRR));
                                nextFound = true;
                                break;
                            }
                        }
                        
                        if (nextFound == false) {
                            for (var i = 0; i < _ReadyPCBList.length; i++){
                                _ReadyPCBList[i].quantumRan = 0;
                            }
                            var params = [_ReadyPCBList[0]];
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                        }
                    } else if (_ReadyPCBList.length >= 2) {
                        if ((_CurrentPCB.quantumRan < _RoundRobinQuantum) == false) {
                            _CurrentPCB.state = "Waiting";
                            var nextFound = false;
                            for (var i = 0; i < _ReadyPCBList.length; i++) {
                                if (_ReadyPCBList[i].quantumRan < _RoundRobinQuantum) {
                                    var pcbRR = [_ReadyPCBList[i]];
                                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, pcbRR));
                                    nextFound = true;
                                    break;
                                }
                            }
                            
                            if (nextFound == false) {
                                for (var i = 0; i < _ReadyPCBList.length; i++){
                                    _ReadyPCBList[i].quantumRan = 0;
                                }
                                var params = [_ReadyPCBList[0]];
                                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                            }
                        }
                    }
                    _CPU.isExecuting = true;
                } else {
                    _CPU.isExecuting = false;
                }
            } else if (_ScheduleAlgo == "PRIORITY") {
                if (_ReadyPCBList.length > 0) {
                    if ( (_CurrentPCB == null) && (_ReadyPCBList.length == 1)) {
                        var params = [_ReadyPCBList[0]];
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                    } else if ((_ReadyPCBList.length >= 2) && (_CurrentPCB == null)) {
                        var tempPCB = _ReadyPCBList[0];
            for (var i = 1; i < _ReadyPCBList.length; i++) {
                
                if (tempPCB.priority > _ReadyPCBList[i].priority) {   
                    tempPCB =_ReadyPCBList[i];
                }
                
                var params = [tempPCB];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));

        }
                       
                        
                    }
                    _CPU.isExecuting = true;
                   
                } else {
                    
                    _CPU.isExecuting = false;
                }
            }

        
            
        }//currentProcess
        public rollOutDecision() {
            var swapPCB: TSOS.PCB;
            var memoryPCBs: TSOS.PCB[] = [];
            let i =0;
            while( i < _PCBList.length ) {
                if (_PCBList[i].location == "Memory") {
                    memoryPCBs[memoryPCBs.length] = _PCBList[i];
                }
                i++;
            }
            swapPCB = memoryPCBs[0];
          
            if (_ScheduleAlgo == "Priority") {
                 i = 1;
                while( i < memoryPCBs.length){
                    if (memoryPCBs[i].priority > swapPCB.priority) {
                        swapPCB = memoryPCBs[i];
                    }
                    i++;
                }
            } else {
                i = 1;
                while ( i < memoryPCBs.length) {
                    if (memoryPCBs[i].swaps < swapPCB.swaps) {
                        swapPCB = memoryPCBs[i];
                    }
                    i++;
                }
            }
            return swapPCB;
        }
        public nextProcess() {
            var nextFound = false;
            for (var i = 0; i < _ReadyPCBList.length; i++) {
                // check the quantum of each process to find next one to run
                if (_ReadyPCBList[i].quantumRan < _RoundRobinQuantum) {
                    // Make that one process the running one
                    var params = [_ReadyPCBList[i]];
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                    nextFound = true;
                    break;
                }
            }
            // If all of the PCBs have used their quanta up...
            if (!nextFound) {
                // reset all of their quanta
                for (var i = 0; i < _ReadyPCBList.length; i++){
                    _ReadyPCBList[i].quantumRan = 0;
                }
                // run the first one in the ready queue
                var params = [_ReadyPCBList[0]];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
            }
        }
        


        }
    }