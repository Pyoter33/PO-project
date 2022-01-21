const areArraysEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.sort().join(',') === b.sort().join(',');
}

module.exports = areArraysEquals;