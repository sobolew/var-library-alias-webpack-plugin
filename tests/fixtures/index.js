function privateFunction() {
    let str = 'im private';
    console.log(truncate(str));
}

const truncate = (input) => {
    if (input.length > 5) {
        return input.substring('5', '...');
    }

    return input;
};

export function publicFunction() {
    privateFunction();
}
