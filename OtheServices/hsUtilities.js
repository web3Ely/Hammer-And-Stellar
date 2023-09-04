function generateCircle(radius) {
    //mid point circle algorithm that generates half quarter circle
    let halfQuarterCircle = [];
    let x = 0;
    let y = radius;
    let p = 1 - y;
    while (x <= y) {
        halfQuarterCircle.push([x, y]);
        if (p < 0) {
            ++x;
            p = p + 2 * x + 3;
        } else {
            ++x;
            --y;
            p = p + 2 * (x - y) + 5;
        }
    }
    // get the quarterCircle by flipping the x and y of the first half quarter
    let quarterCircle = [
        ...halfQuarterCircle,
        ...halfQuarterCircle.map(([x, y]) => [y, x]).reverse(),
    ];
    // discard the smaller x at the same y
    // *2 +1 to get the full top half width representation of a circle, +1 includes the mid horizontal line where x = 0
    let registeredHeight = new Map();
    let quarterCircleWidth = [];
    quarterCircle.forEach(([x, y]) => {
        x = x * 2 + 1;
        if (registeredHeight.has(y)) {
            if (x > registeredHeight.get(y)) {
                registeredHeight.set(y, x);
                quarterCircleWidth[quarterCircleWidth.length - 1] = x;
            }
        } else {
            registeredHeight.set(y, x);
            quarterCircleWidth.push(x);
        }
    });
    // get the bottom half by reversing the top half without the mid vertical line where y = 0
    return [...quarterCircleWidth, ...quarterCircleWidth.slice(0, -1).reverse()];
}

function maxWidth(target) {
    const flatArray = target.flat(Infinity);
    return flatArray.reduce((acc, cur) => (acc > cur ? acc : cur));
}

function checkType(action, requiredType) {
    const actionType = Object.prototype.toString.call(action);
    const actualType = actionType.substring(actionType.indexOf(" ") + 1, actionType.indexOf("]"));
    return actualType === requiredType;
}

function getType(action) {
    const actionType = Object.prototype.toString.call(action);
    return actionType.substring(actionType.indexOf(" ") + 1, actionType.indexOf("]"));
}
function middle(size) {
    return Math.floor(size / 2);
}

function deepCopy(list) {
    return list.map((item) => {
        return Array.isArray(item) ? deepCopy(item) : item;
    });
}

module.exports = {
    generateCircle,
    maxWidth,
    middle,
    checkType,
    getType,
    deepCopy,
};
