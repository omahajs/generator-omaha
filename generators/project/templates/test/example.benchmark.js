var fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};

var fibonacci_memoized = (function() {
    var memo = [0, 1];
    var fib = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = fib(n - 1) + fib(n - 2);
            memo[n] = result;
        }
        return result;
    };
    return fib;
}());

module.exports = {
    name: 'Fibonacci Showdown',
    tests: {
        'Fibonacci': function() {
            fibonacci(10);
            fibonacci(5);
        },
        'Fibonacci2': function() {
            fibonacci_memoized(10);
            fibonacci_memoized(5);
        }
    }
};
