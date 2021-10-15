module TSOS {

    export class MemoryAccessor {
        constructor() {}

        public sectionIndex(section) {
            var i: number;
            switch (section) {
                case "1":
                    i = 0;
                    break;
                case "2":
                    i = 256;
                    break;
                case "3":
                    i = 512;
                    break;
                default:
                    console.log("Invalid section");
            }
            return i;

        }
        

    }

}
