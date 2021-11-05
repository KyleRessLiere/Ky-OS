/* ------------
This will do the logic for the CPU scheduling when their are mutple running processes.
*/
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() { }
        //determines which process will be running processe
        currentProcess() {
            //more than one process running
            if (_ReadyPCBList.length > 0) {
                if ((_ReadyPCBList.length == 1) && (_CurrentPCB == null)) {
                    var currentPcb = [_ReadyPCBList[0]];
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, currentPcb));
                }
                _CPU.isExecuting = true;
            }
            else {
                _CPU.isExecuting = false;
            }
        } //current process
        nextProcess() {
            let found = false;
            for (let i = 0; i < _ReadyPCBList.length; i++) {
                //checks to see which process has hit quantum yet
                if (_ReadyPCBList[i].quantumRan < _RoundRobinQuantum) {
                    let currentPcb = [_ReadyPCBList[i]];
                    //cpmtext switches to move onto next process
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, currentPcb));
                    found = true;
                    break;
                }
            }
            //if no qunatums are reset qunatum to zero
            if (found == false) {
                for (let i = 0; i < _ReadyPCBList.length; i++) {
                    _ReadyPCBList[i].quantumRan = 0;
                }
                let currentPcb = [_ReadyPCBList[0]];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, currentPcb));
            }
        } //next process
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map