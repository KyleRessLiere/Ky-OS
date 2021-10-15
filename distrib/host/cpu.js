/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false, IR = "") {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.IR = IR;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = "";
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _CurrentPCB.state = "Running";
            _CurrentPCB.IR = _Memory.memoryArray[_MemoryAccessor.sectionIndex(_CurrentPCB.section) + _CurrentPCB.PC]; // fix memory accesor section index
            this.PC = _CurrentPCB.PC;
            this.Acc = _CurrentPCB.ACC;
            this.Xreg = _CurrentPCB.X;
            this.Yreg = _CurrentPCB.Y;
            this.Zflag = _CurrentPCB.Z;
        }
        cpuUpdate() {
            this.PC = _CurrentPCB.PC;
            this.IR = _CurrentPCB.IR;
            this.Acc = _CurrentPCB.ACC;
            this.Xreg = _CurrentPCB.X;
            this.Yreg = _CurrentPCB.Y;
            this.Zflag = _CurrentPCB.Z;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map