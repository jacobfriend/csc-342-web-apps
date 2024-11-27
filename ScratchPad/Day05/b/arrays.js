const array1 = [1, 2, 3, 4, 5];


// TASK 1: Functional Array Iteration

// Your function here
function printArray(arr) {
    arr.forEach((item, index) =>
        console.log(`The value at position ${index} is ${item}`)
    )
}

printArray(array1);


// TASK 2: Operating on Array Elements

// Your function here
const squareArray = (arr) => {
    return arr.map ((val) => {
        return val * val;
    });
}

console.log(squareArray(array1));


// TASK 3: Filtering Array Elements

// Your function here
const filterArray = (arr) => {
    return arr.filter((val) => val % 2 == 0);
}

console.log(filterArray(array1));


// TASK 4: Reducing Arrays

// Your function here
const sumArray = (arr) => {
    const initialValue = 0;
    return arr.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue,
    );
}

console.log(sumArray(array1));


// TASK 5: Chaining Array Methods

// Your function here
const chainArray = (arr) => {
    const initialValue = 0;
    return arr.filter(
        (word) => word % 2 == 0
    ).map((val) => {
        return val * val;
    }).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue,
    );
}

console.log(chainArray(array1));
