var TSOS;
(function (TSOS) {
    class PCB {
        constructor(PID = _PCBList.length, // Process ID
        PC = 0, //Process Counter
        IR = "", //  //IR
        ACC = 0, //Accumulator
        X = 0, //X Register
        Y = 0, //Y Register
        Z = 0, //Z Flag
        state = "Resident", //State of the process
        location = "Memory") {
            this.PID = PID;
            this.PC = PC;
            this.IR = IR;
            this.ACC = ACC;
            this.X = X;
            this.Y = Y;
            this.Z = Z;
            this.state = state;
            this.location = location;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map