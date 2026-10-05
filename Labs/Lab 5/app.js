const Mathematics = require('./math');

class App {
    constructor() {
        this.math = new Mathematics();
    }

    run() {
        const sum = this.math.add(5, 3);
        const difference = this.math.subtract(10, 4);

        console.log(`Hello Trey. The sum of 5 and 3 is: ${sum}. The difference of 10 and 4 is: ${difference}`);
    }
}

const myApp = new App();
myApp.run();