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

     module TSOS {

        export class Cpu {
    
            constructor(public PC: number = 0,
                        public IR: string = "",
                        public Acc: number = 0,
                        public Xreg: number = 0,
                        public Yreg: number = 0,
                        public Zflag: number = 0,
                        public isExecuting: boolean = false) {
    
            }
    
            public init(): void {
                this.PC = 0;
                this.IR = "";
                this.Acc = 0;
                this.Xreg = 0;
                this.Yreg = 0;
                this.Zflag = 0;
                this.isExecuting = false;
            }
    
            public cycle(): void {
                var isCompleted = false;
    
                _Kernel.krnTrace('CPU cycle');
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
    
                //Change the PCB to state Running
                
                
                _CurrentPCB.state = "Running";
                
                console.log(_CurrentPCB.IR)
                
                // Get the currentPCB and assign its values to corresponding cpu values
                this.updateCPUWithPCB();
                
    
                // Update the GUI
                Control.processTableUpdate();
                Control.cpuUpdate();
                //console.log(_CurrentPCB + "CurrentPCB")
               
    
    
                // Run the next code
                try {
                    switch (_CurrentPCB.IR) {
        
                        case "A9": 
                             this.loadAccConstant();   
                                    
                        break;  //load accumulator with a constant
                        case "AD":
                             this.loadAccMemory();  
                                  
                              break;  //load accumulator from memory
                        case "8D": 
                            this.storeAcc();      
                                   
                             break;  //store accumulator in memory
                        case "6D": 
                            this.addWithCarry();   
                                    
                            break;  //add contents of memory to accumulator and store in accumulator
                        case "A2": 
                            this.loadXFromConstant();  
                              
                            break;  //load Xreg 
                        case "AE": 
                            this.loadXFromMemory();    
                              
                            break;  //load Xrega
                        case "A0": 
                            this.loadYFromConstant();   
                            
                            break;  //load Yreg 
                        case "AC": 
                            this.loadYFromMemory();  
                                
                            break;  //load Yreg 
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
                            var params: string[] = [_CurrentPCB.PID.toString(), 'Running Process Invalid Op Code'];
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PROCESS_BREAK_IRQ, params));
                    }
                } catch (Error) {
                    var params: string[] = [_CurrentPCB.PID.toString(), 'Running Process Memory Access Violation'];
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
                Control.memoryUpdate();
                Control.cpuUpdate();
               // Control.processTableUpdate();
               console.log(_CurrentPCB)

               _Scheduler.currentProcess();
    
                if (isCompleted) {
                    console.log("Finished")
                    this.breakProcess();
                }
    
            }
    
            public updateCPUWithPCB() {
                this.PC = _CurrentPCB.PC;
                this.IR = _CurrentPCB.IR;
                this.Acc = _CurrentPCB.ACC;
                this.Xreg = _CurrentPCB.X;
                this.Yreg = _CurrentPCB.Y;
                this.Zflag = _CurrentPCB.Z;
            }
    
            public updatePCBWithCPU() {
                _CurrentPCB.PC = this.PC;
                _CurrentPCB.IR = this.IR;
                _CurrentPCB.ACC = this.Acc;
                _CurrentPCB.X = this.Xreg;
                _CurrentPCB.Y = this.Yreg;
                _CurrentPCB.Z = this.Zflag;
    
            }
            public breakProcess() {
                _CurrentPCB.state = "Complete";
                Control.processTableUpdate();
                // the program is completed...
                // I don't know if  I shouldn't be doing this OS stuff in the cpu. May need to change for better host/OS separation
                _StdOut.advanceLine();
                _StdOut.putText("Process " + _CurrentPCB.PID + " Complete!");
                _StdOut.advanceLine();
                _OsShell.putPrompt();
                // clear that section in memory
                _MemoryManager.clearMemory(_CurrentPCB.section);
                // remove PCB from _ReadyPCBList and _PCBList
                _ReadyPCBList.splice(_MemoryManager.pidIndex(_ReadyPCBList,_CurrentPCB.PID), 1); // the two parameters are the index and the number of PCBs removed
                _PCBList.splice(_MemoryManager.pidIndex(_PCBList,_CurrentPCB.PID), 1);
                
                // remove PCB from _CurrentPCB
                _CurrentPCB = _PCBList[0];
                Control.memoryUpdate();
                Control.cpuUpdate();
               
                Control.cpuClear();
                _Scheduler.currentProcess();
            }

            public useInstruction(): void {
                this.PC++;
            }
    
            public loadAccConstant() {
                //Pass over a opp code
                this.useInstruction();
                // Assign the following constant to the Acc
                this.Acc = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
            }
    
            public loadAccMemory() {
                 //Pass over a opp code
                 this.useInstruction();
                // Fetch the memory location where we want to load the Accumulator with
    
                this.Acc = Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
                
                 //Pass over a opp code
                 this.useInstruction();
            }
    
            public storeAcc() {
                 //Pass over a opp code
                 this.useInstruction();
                 // Fetch the memory location where we want to store the Accumulator
                _Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)] = Utils.decimalToHex(this.Acc);
                
                this.useInstruction();
            }
    
            public addWithCarry(){
               //Pass over a opp code
               this.useInstruction();
                 // Fetch the memory location where we want to add to the Accumulator
                 //add the value from the memory location
                this.Acc += Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
               
                //Pass over a opp code
                this.useInstruction();
            }
    
            public loadXFromConstant() {
               //Pass over a opp code
               this.useInstruction();
                // Load accumulator with the decimal equivalent of a hex byte
                this.Xreg = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
            }
    
            public loadXFromMemory() {
               //Pass over a opp code
               this.useInstruction();
                // loads accumulator with a value that is stored in memory, with the two byte hex memory given by the next two bytes
                this.Xreg = Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
                // We increment again because we are reading two bytes for the memory address
               //Pass over a opp code
               this.useInstruction();
            }
    
            public loadYFromConstant() {
                //Pass over a opp code
                this.useInstruction();
                // Load accumulator with the decimal equivalent of a hex byte
                this.Yreg = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
            }
    
            public loadYFromMemory() {
                //Pass over a opp code
                this.useInstruction();
               
                this.Yreg = Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
                //
                //Pass over a opp code
                this.useInstruction();
    
            }
    
            
    
            public compareMemToX() {
               //Pass over a opp code
               this.useInstruction();
                var byteInMemory = Utils.hexToDecimal(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
                if (byteInMemory == this.Xreg) {
                    this.Zflag = 1;
                } else {
                    this.Zflag = 0;
                }
                //Pass over a opp code
                this.useInstruction();
            }
    
            public branchBytes() {
                //Pass over a opp code
                this.useInstruction();
                // If the Zflag is zero jump foward
                if (this.Zflag == 0){
                    var bytes = _MemoryAccessor.readOneMemoryByteToDecimal(_CurrentPCB.section, this.PC);
                    if (bytes + this.PC > 256) {
                        this.PC = (this.PC + bytes) % 256;
                    } else {
                        this.PC += bytes;
                    }
                }
            }
    
            public incrementByte() {
                //Pass over a opp code
                this.useInstruction();
                // increment the value of a byte in memory
                _Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)] = Utils.incrementHexString(_Memory.memoryArray[_MemoryAccessor.twoBytesToDecimal(_CurrentPCB.section, this.PC)]);
                //Pass over a opp code
                this.useInstruction();
            }
    
           
            public systemCall() {
                var input: string[] = [];
                let x = this.Xreg;
            if (x > 0 && x < 2){
               
                console.log('System call print Yreg');
                input[0] = this.Yreg.toString();
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_IRQ, input));
            } else if (this.Xreg == 2) {
                
                var location = this.Yreg + _Memory.getSectionBase(_CurrentPCB.section);
                var print: string = "";
                var byteMessage: string;
                let i =0;
                while ( i + location < _Memory.memoryArray.length) {
                    byteMessage = _Memory.memoryArray[location + i];
                    if (byteMessage== "00") {
                        break;
                    } else {
                        print += String.fromCharCode(Utils.hexToDecimal(byteMessage));
                    }
                    i++;
                }
                input[0] = print;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_IRQ, input));
            } else {
                console.log("System call with Xreg != 1 or 2");
            }
               
            }//systemCall
    
    
        }
    }