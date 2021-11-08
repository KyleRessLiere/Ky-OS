/* ------------
This will do the logic for the CPU scheduling when their are mutple running processes.
*/
var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor() { }
        currentProcess() {
            if (_ReadyPCBList.length > 0) {
                if ((_ReadyPCBList.length == 1) && (_CurrentPCB == null)) {
                    var params = [_ReadyPCBList[0]];
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                }
                else if ((_ReadyPCBList.length >= 2) && (_CurrentPCB == null)) {
                    this.nextProcess();
                }
                else if (_ReadyPCBList.length >= 2) {
                    if (((_CurrentPCB.quantumRan < _RoundRobinQuantum) == false)) {
                        _CurrentPCB.state = "Waiting";
                        this.nextProcess();
                    }
                }
                _CPU.isExecuting = true;
            }
            else {
                _CPU.isExecuting = false;
            }
        } //current process
        nextProcess() {
            var nextFound = false;
            var i = 0;
            while (i < _ReadyPCBList.length) {
                if (_ReadyPCBList[i].quantumRan < _RoundRobinQuantum) {
                    var params = [_ReadyPCBList[i]];
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
                    nextFound = true;
                    break;
                }
                i++;
            }
            if (nextFound != false) {
                for (var i = 0; i < _ReadyPCBList.length; i++) {
                    _ReadyPCBList[i].quantumRan = 0;
                }
                var params = [_ReadyPCBList[0]];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, params));
            }
        } //next process
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map