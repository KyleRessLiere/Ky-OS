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
        constructor(PC = 0, IR = "", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            var isCompleted = false;
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //Change the PCB to state Running
            _CurrentPCB.state = "Running";
            console.log(_CurrentPCB.IR);
            // Get the currentPCB and assign its values to corresponding cpu values
            this.updateCPUWithPCB();
            // Update the GUI
            TSOS.Control.processTableUpdate();
            TSOS.Control.cpuUpdate();
            //console.log(_CurrentPCB + "CurrentPCB")
            // Run the next code
            try {
                switch (_CurrentPCB.IR) {
                    case "A9":
                        this.loadAccConstant();
                        break; //load accumulator with a constant
                    case "AD":
                        this.loadAccMemory();
                        break; //load accumulator from memory
                    case "8D":
                        this.storeAcc();
                        break; //store accumulator in memory
                    case "6D":
                        this.addWithCarry();
                        break; //add contents of memory to accumulator and store in accumulator
                    case "A2":
                        this.loadXFromConstant();
                        break; //load Xreg 
                    case "AE":
                        this.loadXFromMemory();
                        break; //load Xrega
                    case "A0":
                        this.loadYFromConstant();
                        break; //load Yreg 
                    case "AC":
                        this.loadYFromMemory();
                        break; //load Yreg 
                    case "EA":
                        this.PC++;
                        break;
                    case "00":
                        isCompleted = true;
                        break;
                    case "EC":
                        this.compareMemToX();
                        break;
                    case "D0":
                        this.branchBytes();
                        break;
                    case "EE":
                        this.incrementByte();
                        break;
                    case "FF":
                        this.systemCall();
                        break;
                    default:
                        console.log("Invalid Op Code");
                        var params = [_CurrentPCB.PID.toString(), 'Running Process Invalid Op Code'];
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PROCESS_BREAK_IRQ, params));
                }
            }
            catch (Error) {
                var params = [_CurrentPCB.PID.toString(), 'Running Process Memory Access Violation'];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PROCESS_BREAK_IRQ, params));
            }
            // Increment the PC so we know to go on the next command the next cpu cycle for this process
            this.PC++;
            _CurrentPCB.quantumRan++;
            // Update the IR
            this.IR = _MemoryAccessor.readMemoryHex(_CurrentPCB.section, this.PC);
            // Copy the CPU to the CurrentPCB
            this.updatePCBWithCPU();
            // Update the GUI again
            TSOS.Control.memoryUpdate();
            TSOS.Control.cpuUpdate();
            // Control.processTableUpdate();
            console.log(_CurrentPCB);
            _Scheduler.currentProcess();
            if (isCompleted) {
                console.log("Finished");
                this.breakProcess();
            }
        }
        updateCPUWithPCB() {
            this.PC = _CurrentPCB.PC;
            this.IR = _CurrentPCB.IR;
            this.Acc = _CurrentPCB.ACC;
            this.Xreg = _CurrentPCB.X;
            this.Yreg = _CurrentPCB.Y;
            this.Zflag = _CurrentPCB.Z;
        }
        updatePCBWithCPU() {
            _CurrentPCB.PC = this.PC;
            _CurrentPCB.IR = this.IR;
            _CurrentPCB.ACC = this.Acc;
            _CurrentPCB.X = this.Xreg;
            _CurrentPCB.Y = this.Yreg;
            _CurrentPCB.Z = this.Zflag;
        }
        breakProcess() {
            _CurrentPCB.state = "Complete";
            TSOS.Control.processTableUpdate();
            // the program is completed...
            // I don't know if  I shouldn't be doing this OS stuff in the cpu. May need to change for better host/OS separation
            _StdOut.advanceLine();
            _StdOut.putText("Process " + _CurrentPCB.PID + " Complete!");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
            // clear that section in memory
            _MemoryManager.clearMemory(_CurrentPCB.section);
            // remove PCB from _ReadyPCBList and _PCBList
            _ReadyPCBList.splice(_MemoryManager.pidIndex(_ReadyPCBList, _CurrentPCB.PID), 1); // the two parameters are the index and the number of PCBs removed
            _PCBList.splice(_MemoryManager.pidIndex(_PCBList, _CurrentPCB.PID), 1);
            // remove PCB from _CurrentPCB
            _CurrentPCB = _PCBList[0];
            TSOS.Control.memoryUpdate();
            TSOS.Control.cpuUpdate();
            TSOS.Control.cpuClear();
            _Scheduler.currentProcess();
        }
        useInstruction() {
            this.PC++;
        }
        loadAccConstant() {
            //Pass over a opp code
            this.useInstruction();
            // Assign the following constant to the Acc
            this.Acc = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
        }
        loadAccMemory() {
            //Pass over a opp code
            this.useInstruction();
            // Fetch the memory location where we want to load the Accumulator with
            this.Acc = TSOS.Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            //Pass over a opp code
            this.useInstruction();
        }
        storeAcc() {
            //Pass over a opp code
            this.useInstruction();
            // Fetch the memory location where we want to store the Accumulator
            _Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)] = TSOS.Utils.decimalToHex(this.Acc);
            this.useInstruction();
        }
        addWithCarry() {
            //Pass over a opp code
            this.useInstruction();
            // Fetch the memory location where we want to add to the Accumulator
            //add the value from the memory location
            this.Acc += TSOS.Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            //Pass over a opp code
            this.useInstruction();
        }
        loadXFromConstant() {
            //Pass over a opp code
            this.useInstruction();
            // Load accumulator with the decimal equivalent of a hex byte
            this.Xreg = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
        }
        loadXFromMemory() {
            //Pass over a opp code
            this.useInstruction();
            // loads accumulator with a value that is stored in memory, with the two byte hex memory given by the next two bytes
            this.Xreg = TSOS.Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            // We increment again because we are reading two bytes for the memory address
            //Pass over a opp code
            this.useInstruction();
        }
        loadYFromConstant() {
            //Pass over a opp code
            this.useInstruction();
            // Load accumulator with the decimal equivalent of a hex byte
            this.Yreg = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
        }
        loadYFromMemory() {
            //Pass over a opp code
            this.useInstruction();
            // loads accumulator with a value that is stored in memory, with the two byte hex memory given by the next two bytes
            this.Yreg = TSOS.Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            //
            //Pass over a opp code
            this.useInstruction();
        }
        compareMemToX() {
            //Pass over a opp code
            this.useInstruction();
            var byteInMemory = TSOS.Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            if (byteInMemory == this.Xreg) {
                this.Zflag = 1;
            }
            else {
                this.Zflag = 0;
            }
            //Pass over a opp code
            this.useInstruction();
        }
        branchBytes() {
            //Pass over a opp code
            this.useInstruction();
            // If the Zflag is zero jump foward
            if (this.Zflag == 0) {
                var bytes = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
                if (bytes + this.PC > 256) {
                    this.PC = (this.PC + bytes) % 256;
                }
                else {
                    this.PC += bytes;
                }
            }
        }
        incrementByte() {
            //Pass over a opp code
            this.useInstruction();
            // increment the value of a byte in memory
            _Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)] =
                TSOS.Utils.incrementHexString(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
            //Pass over a opp code
            this.useInstruction();
        }
        systemCall() {
            // does something specific based on the Xreg
            var params = [];
            if (this.Xreg == 1) {
                // Print out the integer stored in the Yreg
                console.log('System call print Yreg');
                params[0] = this.Yreg.toString();
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_IRQ, params));
            }
            else if (this.Xreg == 2) {
                console.log("System call print string");
                // Print out the 00 terminated string stored at the address in the Y register
                // This means the letters associated with the code in memory
                var location = this.Yreg + _Memory.getSectionBase(_CurrentPCB.section);
                var output = "";
                var byteString;
                for (var i = 0; i + location < _Memory.memoryArray.length; i++) {
                    byteString = _Memory.memoryArray[location + i];
                    if (byteString == "00") {
                        break;
                    }
                    else {
                        output += String.fromCharCode(TSOS.Utils.hexToDecimal(byteString));
                    }
                }
                params[0] = output;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_IRQ, params));
            }
            else {
                console.log("System call with Xreg != 1 or 2");
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map