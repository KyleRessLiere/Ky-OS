/* ------------------------------------
    disk.ts
   Disk for file system
   ------------------------------------  */

   module TSOS {

    export class Disk {

        public tracks: Number;
        public sectors: Number;
        public blocks: Number;
        public blockSize: Number;

        constructor () {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 64;
        }//constructor

    }//disk

}//TSOS