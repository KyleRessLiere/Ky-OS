module TSOS {

    export class Memory {
        public memoryArray: string[] = new Array(0x300);

      

        constructor(){
        }

        public init(): void {
            // initialize memeory
            for (var i = 0; i < this.memoryArray.length; i++) {
                this.memoryArray[i] = "00";
            }
        }

    }
}