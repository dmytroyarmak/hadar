var n = 2000;
console.log('%%%MatrixMarket matrix array real general');
console.log('%-------------------------------------------------------------------------------');
console.log('% Matrix A to test Cholesky ' + n + 'x' + n);
console.log('%-------------------------------------------------------------------------------');
console.log(n, n);

for (var j = 0; j < n; j++) {
    for (var i = 0; i < n; i++) {
        console.log(n - Math.max(i, j));
    }
}
