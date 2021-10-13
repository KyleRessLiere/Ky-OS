module TSOS {

    export class Memory {
        public memoryArray: string[] = new Array(768);
        private memorySectionOneBase = 0;
        private memorySectionOneEnd = 255;
        private memorySectionTwoBase = 256;
        private memorySectionTwoEnd = 511;
        private memorySectionThreeBase = 512;
        private memorySectionThreeEnd = 767;

      

        constructor(){
        }

        public init(): void {
            // initialize memory
            for (var i = 0; i < this.memoryArray.length; i++) {
                this.memoryArray[i] = "00";
            }
        }
        public getSectionBase(section:string){
            switch(section){
            case "1": 
            return this.memorySectionOneBase
            break;
            case "2": 
            return this.memorySectionTwoBase
            case "3": 
            return this.memorySectionThreeBase
            default:
                console.log("Invalid section")
            }

        }
        public getSectionEnd(section:string){
            switch(section){
                case "1": 
                return this.memorySectionOneEnd;
                break;
                case "2": 
                return this.memorySectionTwoEnd;
                break;
                case "3": 
                return this.memorySectionThreeEnd
                break;
                default:  
                console.log("Invalid section number")
            }
        }
       

    }
}