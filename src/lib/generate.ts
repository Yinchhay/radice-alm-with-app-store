export function getRandom8DigitCode() {
    // Credit: https://stackoverflow.com/a/3437180/11946373
    /*
     * Math.random() generates a random number between 0 and 1
     * Math.random()                         ->  0.12345678901234
     *          .toString()              -> "0.12345678901234"
     *                     .slice(2,10)  ->   "12345678"
     */
    return Math.random().toString().slice(2, 10);
}

