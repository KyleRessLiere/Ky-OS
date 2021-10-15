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
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public IR: String = "") {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = "";
            this.isExecuting = false;
        }

        public cycle(): void {
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

           this.cpuUpdate();

           switch (_CurrentPCB.IR) {
            case "A9": this.loadAccConstant();          break;
            case "AD": this.loadAccMemory();            break;
            case "8D": this.storeAcc();                 break;
            case "6D": this.addWithCarry();             break;
            case "A2": this.loadXregFromConstant();     break;
            case "AE": this.loadXregFromMemory();       break;
            case "A0": this.loadYregFromConstant();     break;
            case "AC": this.loadYregFromMemory();       break;
            case "EA":                                  break;
            case "00": this.breakProcess();             break;
            case "EC": this.compareMemToXreg();         break;
            case "D0": this.branchBytes();              break;
            case "EE": this.incrementByte();            break;
            case "FF": this.systemCall();               break;
            case "A9": this.loadAccConstant();          break;  //load accumulator with a constant
            case "AD": this.loadAccMemory();            break;  //load accumulator from memory
            case "8D": this.storeAcc();                 break;  //store accumulator in memory
            case "6D": this.addWithCarry();             break;  //add contents of memory to accumulator and store in accumulator
            case "A2": this.loadXregFromConstant();     break;  //load Xreg with a constant
            case "AE": this.loadXregFromMemory();       break;  //load Xreg from memory
            case "A0": this.loadYregFromConstant();     break;  //load Yreg with a constant
            case "AC": this.loadYregFromMemory();       break;  //load Yreg from memory
            case "EA":                                  break;  //no operation (we increment PC after the switch statement, so we don't get stuck here)
            case "00": this.breakProcess();             break;  //break
            case "EC": this.compareMemToXreg();         break;  //compare byte in memory to Xreg, set Zflag to zero if equal
            case "D0": this.branchBytes();              break;  //branch a given amount of bytes if Zflag is zero
            case "EE": this.incrementByte();            break;  //increment the value of a byte
            case "FF": this.systemCall();               break;  //system call (used for printing stuff)
            default:
                // There was an invalid op code
                console.log("Invalid Op Code");
                // probably write some sort of notice to the user that something is broken
        }
        
        this.PC++;
        this.pcbUpdate();
        this.pcbListUpdate();

        //update gui 
        Control.memoryUpdate();
        }
        public cpuUpdate(): void {
            this.PC = _CurrentPCB.PC;
            this.IR = _CurrentPCB.IR;
            this.Acc = _CurrentPCB.ACC;
            this.Xreg = _CurrentPCB.X;
            this.Yreg = _CurrentPCB.Y;
            this.Zflag = _CurrentPCB.Z;
        }
        public pcbUpdate(): void {
            _PCBList[_CurrentPCB.PID] = _CurrentPCB;
        }
        public pcbListUpdate(){
            _PCBList[_CurrentPCB.PID] = _CurrentPCB;
        }
        public loadAccConstant() {
            this.PC++;
           console.log("loadacccon")
        }

        public loadAccMemory() {
            this.PC++;
            


        }

        public storeAcc() {

        }

        public addWithCarry(){

        }

        public loadXregFromConstant() {

        }

        public loadXregFromMemory() {

        }

        public loadYregFromConstant() {

        }

        public loadYregFromMemory() {


        }

        public breakProcess() {

        }

        public compareMemToXreg() {

        }

        public branchBytes() {

        }

        public incrementByte() {

        }

        public systemCall() {

        }
    }
    
    
}