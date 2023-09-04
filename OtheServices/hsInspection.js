/**
 * Hammer-And-Stellar invested this inspection machine few years back
 * It is very very expensive, some might wondes if this investment serves other purpose, hmmmmmmmmmmmmm
 * It can detect any error on documents related to building a spaceship filled out by its customers
 * H&S Operators will get very upset if they see any red notification through this inspection machine
 * Afterall, they are just highly intelegent life forms that rely on salary, sadge...
 */

//add reaction to Operators when they see errors, like rolling on the ground
const {
    SectorTileAlignmentStandard,
    FloorPlanAlignmentStandard,
    AvailableApplianceStandard,
} = require("./hsStandards");

let HSInspection = (module.exports = {});

HSInspection.inspect = (inspections) => {
    let errorMessage = "";
    if (inspections.length === 0)
        errorMessage = "provided information do not match with any form standard";
    const errorField = inspections.find(
        ([inspection, _, value]) => !listOfInspection[inspection](value)
    );
    if (errorField !== undefined)
        errorMessage = `provided ${errorField[1]} failled to pass inspection: ${errorField[0]}`;
    return { errorMessage: errorMessage };
};

const listOfInspection = {
    // integers
    ifIntegerAndGTZero: (target) => Number.isInteger(target) && target > 0,
    ifIntegersAndAllGTZero: (target) => target.every((num) => Number.isInteger(num) && num > 0),
    ifIntegers: (target) => target.every((num) => Number.isInteger(num)),
    // ifIntegerAndGTAEZero: (target) => Number.isInteger(target) && target >= 0,
    // ifIntegersAndAllGTAEZero: (target) => target.every((num) => Number.isInteger(num) && num >= 0),
    // array
    ifArray: (target) => Array.isArray(target),
    ifLengthTwo: (target) => target.length === 2,
    ifNotEmpty: (target) => target.length > 0,
    // property
    ifValidSectorAlignment: (target) => SectorTileAlignmentStandard[target] !== undefined,
    ifValidFloorPlanAlignment: (target) => FloorPlanAlignmentStandard[target] !== undefined,
    ifValidAppliance: (target) => AvailableApplianceStandard[target] != undefined,
    // other
    ifNotNull: (target) => target !== undefined,
    ifTrue: (target) => target === true,
    ifFixedFieldEquals: ([left, right]) => left === right,
    // check functions
    ifFloorPlanStructure: (target) => checkIfFloorPlan(target),
};

function checkIfFloorPlan(target) {
    return (
        target.every((line) => {
            const lineInspection =
                listOfInspection.ifArray(line) && listOfInspection.ifNotEmpty(line);
            let lastSetOfTiles = [-1, -1];
            return (
                lineInspection &&
                line.every((tiles) => {
                    const inspections =
                        listOfInspection.ifArray(tiles) &&
                        listOfInspection.ifLengthTwo(tiles) &&
                        listOfInspection.ifIntegers(tiles) &&
                        listOfInspection.ifTrue(tiles[0] < tiles[1]) &&
                        listOfInspection.ifTrue(tiles[0] > lastSetOfTiles[1]);
                    lastSetOfTiles = tiles;
                    return inspections;
                })
            );
        }) && kebabOnGrill(target)
    );
}

function kebabOnGrill(linesOfItems) {
    let grill = [];
    linesOfItems.forEach((line) => {
        const lineOfKebabs = [];
        const matchedSkewers = [];
        line.forEach((item, index) => {
            const kebab = KebabItem(item, index);
            const matchedKebabs = grill.filter((lastKebab, index) => {
                const lkPos = lastKebab.getLocation();
                const sameSkewer = Math.max(lkPos[0], item[0]) < Math.min(lkPos[1], item[1]);
                sameSkewer && matchedSkewers.push(index);
                return sameSkewer;
            });
            matchedKebabs.length > 0 && kebab.setSkewer(matchedKebabs[0].getSkewer());
            lineOfKebabs.push(kebab);
        });
        const unMatchedSkewers = grill.filter((_, index) => !matchedSkewers.includes(index));
        grill = [...lineOfKebabs, ...unMatchedSkewers];
    });
    const firstSkewer = grill[0].getSkewer();
    return grill.every((item) => item.getSkewer() === firstSkewer);
}

function KebabItem(kebabLocation, sequence) {
    let skewer = "" + sequence + kebabLocation[0] + kebabLocation[1];
    let kebabPos = kebabLocation;
    return {
        getSkewer: () => skewer,
        setSkewer: (targetSkewer) => (skewer = targetSkewer),
        getLocation: () => kebabPos,
    };
}
