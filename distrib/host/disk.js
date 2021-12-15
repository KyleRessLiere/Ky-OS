/* ------------------------------------
    disk.ts
   Disk for file system
   ------------------------------------  */
var TSOS;
(function (TSOS) {
    class Disk {
        constructor() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 64;
        } //constructor
    } //disk
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {})); //TSOS
//# sourceMappingURL=disk.js.map