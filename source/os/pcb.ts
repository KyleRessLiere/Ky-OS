module TSOS {

    export class PCB {

        constructor(public PID: number = 0,  // Process ID
                    public PC: number = 0,  //Process Counter
                    public IR: String = "", //  //IR
                    public ACC: number =0, //Accumulator
                    public X: number  =0,   //X Register
                    public Y: number  =0,   //Y Register
                    public Z: number  =0,   //Z Flag
                    public state: String  = "Resident",   //State of the process
                    public location: String ="Memory",
                    public section: string =  null,
                    public quantumRan: number = 0, //the amount of times the process has ran 
                    ) {  
        }

    }
}