//problems:
// 1. how to set print size of flooring to customer desired size, currently is fix to 2

const HSInspection = require("../OtheServices/hsInspection");
const HSUtility = require("../OtheServices/hsUtilities");
const HSForms = require("../OtheServices/hsStandardUtilities");

let BobTheFloorGuy = {};

BobTheFloorGuy.interact = () => {
    const interaction = interactWithBob();
    return (arg, extra) => interaction.next(arg, extra).value;
};

const interactWithBob = function* interactWithBob() {
    let outGoingInteraction = { sectorCreationForm, flooringCreationForm };
    while (true) {
        const inComingInteraction = yield outGoingInteraction;
        outGoingInteraction = bobReacts(inComingInteraction);
    }
};

// floorPlan forms
const flooringCreationForm = (sector, sectorAlignment, position, flooring, ...rest) => {
    // const inputSector = HSUtility.checkType(sector, "Object") ? { ...sector } : {};
    // if (inputSector.errorMessage !== undefined) return inputSector;
    // const sInspectionResult = inspectAndResult(inputSector.type, inputSector);
    // if (sInspectionResult.errorMessage !== undefined) return sInspectionResult;
    // const ffInspectionResult = inspectAndResult("flooringForm", customerInputs, true);
    // if (ffInspectionResult.errorMessage !== undefined) return ffInspectionResult;
    // if (flooring === undefined) flooring = HSForms.wrapper("flooring", [[[[0, 1]]]]);
    // const inputFlooring = HSUtility.checkType(flooring, "Object") ? { ...flooring } : {};
    // if (inputFlooring.errorMessage !== undefined) return inputFlooring;
    // const fInspectionResult = inspectAndResult("flooring", inputFlooring);
    // if (fInspectionResult.errorMessage !== undefined) return fInspectionResult;
    // inputFlooring.flooring = HSUtility.deepCopy(inputFlooring.flooring);

    //check sector
    const sectorResult = inspectionResult(sector);
    if (hasErrorMessage(sectorResult)) return sectorResult;
    //check other input
    const customerInputs = [sectorAlignment, position, ...rest];
    const flooringForm = HSForms.wrapper("flooringForm", customerInputs);
    const ffResult = inspectionResult(flooringForm);
    if (hasErrorMessage(ffResult)) return ffResult;
    //check floorPlan
    const floor = flooring === undefined ? HSForms.wrapper("flooring", [[[[0, 1]]]]) : flooring;
    const flooringResult = inspectionResult(floor);
    if (hasErrorMessage(flooringResult)) return flooringResult;
    const inputflooring = HSUtility.deepCopy(floor.flooring);
    //create and check new flooring
    const linesOfTiles = addSectorToFlooring(sector, sectorAlignment, position, inputflooring);
    const newFlooring = HSForms.wrapper("flooring", [linesOfTiles]);
    const finalResutl = inspectionResult(newFlooring);
    return hasErrorMessage(finalResutl) ? finalResutl : newFlooring;
};

// sector forms
const sectorCreationForm = (...customerInputs) => {
    const inputSector = HSForms.wrapper(customerInputs[0] + "Sector", customerInputs.slice(1));
    const sectorResult = inspectionResult(inputSector);
    return hasErrorMessage(sectorResult) ? sectorResult : inputSector;
};

const inspectionResult = (input) => {
    const inputForm = HSUtility.checkType(input, "Object") ? input : {};
    if (hasErrorMessage(inputForm)) return inputForm;
    const inspections = HSForms.getFormInspections(inputForm.type, inputForm);
    const inspectionResult = HSInspection.inspect(inspections);
    return inspectionResult;
};
const hasErrorMessage = (inputForm) => {
    return !!inputForm.errorMessage;
};
// Bob reactions

const SwitchBobInteraction = {
    SwitchBobInteractionString: (talking) => bobReplies(talking),
    SwitchBobInteractionObject: (form) => bobReceivesDocument(form),
    SwitchBobInteractionUnknow: (_) => bobCouldNotComprehand(),
};

const bobReacts = (inComingInteraction) => {
    const interactionType = "SwitchBobInteraction" + HSUtility.getType(inComingInteraction);
    const unkownInteractionType = "SwitchBobInteractionUnknow";
    const outGoingInteraction =
        SwitchBobInteraction[interactionType] || SwitchBobInteraction[unkownInteractionType];
    return outGoingInteraction(inComingInteraction);
};

const bobReplies = (talk) => {
    console.log(`Bob says ${talk}`);
};

const bobCouldNotComprehand = () => {
    const error = "Bob could not comprehand your intention";
    throw new Error(error);
};

const bobReceivesDocument = (inputForm) => {
    const accept = "everything looks correct on your form, and here is how it looks";
    const result = inspectionResult(inputForm);
    const reply = hasErrorMessage(result) ? result.errorMessage : accept;
    bobReacts(reply);
    inputForm.type !== undefined && inputForm.type.includes("Sector") && showSector(inputForm);
    inputForm.flooring !== undefined && showFlooring(inputForm);
};

const showSector = (sector) => {
    const linesOfTiles = LinesOfTilesInSector[sector.type](sector);
    const lines = showLinesOfTiles(linesOfTiles);
    lines.forEach((line) => console.log(line));
};

const showFlooring = (flooring) => {
    const floor = flooring.flooring;
    floor.forEach((linesOfTiles) => {
        const lines = showLinesOfTiles(linesOfTiles, true);
        console.log(lines.join(""));
    });
};

const showLinesOfTiles = (list, concat = false) => {
    const printScaling = 2;
    let lastEnd = 0;
    return list.reduce((acc, item) => {
        const padStart = (item[0] - lastEnd) * printScaling;
        const tiles = (item[1] - item[0]) * printScaling;
        lastEnd = concat ? item[1] : 0;
        return [...acc, " ".repeat(padStart) + "\x1b[47m \x1b[0m".repeat(tiles)];
    }, []);
};
// flooring creation
/**
 * This function creates new flooring by combining the sector to a flooring at desired position
 * We first create flooring for the sector
 * We then adjust the position based on given alignment, position is which tile coordinate you want to add the sector
 *      You can assign 9 different alignment that also influence the position where sector is added
 *      combined position is a combination of sector alignment and original position
 *      it has nagative value so that we can properly used in the next phase
 *      all sizing are start from 0, that means the sector lands at [0,0] on the flooring and walk [x,y] in each direction described in position
 * We expand the flooring based on the combined position and sector's height, this includes expanding from both x, y directions
 *      negative value on the x axis from the combined position will shift all flooring space to the right
 *      negative value on the y axis or y that is greater than flooring height from the combined position will transform to new flooring block
 * We obtain final position that is x,y coordinates on the flooring plain starting from top right witch is the point [0,0]
 *      therefore, we must change any nagative to 0 since the new flooring is already adjusted using the combined position
 * Finaly, we expand the flooring based on the differences between current flooring and sector's height + starting y
 *
 * @param {*} sector
 * @param {*} sectorAlignment
 * @param {*} position
 * @param {*} flooring
 * @returns
 */
const addSectorToFlooring = (sector, sectorAlignment, position, flooring) => {
    // console.log("-------------");
    // console.log({ sectorAlignment, position });
    // console.log("original flooring:");
    // console.log(flooring);
    const linesOfTiles = LinesOfTilesInSector[sector.type](sector);
    // console.log("sector flooring");
    // console.log(linesOfTiles);
    const combinedPosition = adjustPosition(sectorAlignment, position, flooring);
    // console.log({ combinedPosition });
    const firstExp = firstExpansion(combinedPosition, flooring);
    // console.log("first expansion");
    // console.log(firstExp);
    const finalPosition = combinedPosition.map((coord) => (coord < 0 ? 0 : coord));
    // console.log({ finalPosition });
    const secondExp = secondExpansion(finalPosition, firstExp, linesOfTiles);
    // console.log("Second expansion");
    // console.log(secondExp);
    const shiftLinesOfTiles = adjustLinesOfTiles(linesOfTiles, finalPosition[0]);
    // console.log("ajust sector's flooring");
    // console.log(shiftLinesOfTiles);
    const newFlooring = createFlooring(shiftLinesOfTiles, finalPosition, secondExp);
    // console.log(newFlooring);
    return newFlooring;
};

const LinesOfTilesInSector = {
    circleSector: (sector) => circleSectorLOT(sector),
    rectangleSector: (sector) => rectangleSectorLOT(sector),
    customSector: (sector) => customSectorLOT(sector),
};

const circleSectorLOT = (sector) => {
    const circleFlooring = HSUtility.generateCircle(sector.radius);
    const maxWidth = HSUtility.maxWidth(circleFlooring);
    const height = circleFlooring.length;
    const linesOfTiles = new Array(height).fill().map((_, index) => {
        const start = Math.floor((maxWidth - circleFlooring[index]) / 2);
        return [start, start + circleFlooring[index]];
    });
    return linesOfTiles;
};

const rectangleSectorLOT = (sector) => new Array(sector.height).fill().map(() => [0, sector.width]);

const customSectorLOT = (sector) => {
    const customFlooring = sector.linesOfTiles;
    const maxWidth = HSUtility.maxWidth(customFlooring);
    const height = customFlooring.length;
    const linesOfTiles = new Array(height).fill().map((_, index) => {
        let start = CustomSectorTileAlignment[sector.tileAlignment](
            maxWidth,
            customFlooring[index]
        );
        return [start, start + customFlooring[index]];
    });
    return linesOfTiles;
};

const CustomSectorTileAlignment = {
    left: (width, lineOfTiles) => 0,
    right: (width, lineOfTiles) => width - lineOfTiles,
    center: (width, lineOfTiles) => Math.floor((width - lineOfTiles) / 2),
};

const adjustLinesOfTiles = (linesOfTiles, startX) =>
    linesOfTiles.map(([start, end]) => [startX + start, startX + end]);

const adjustPosition = (sectorAlignment, position, flooring) => {
    const floor = [HSUtility.maxWidth(flooring), flooring.length];
    // console.log({ floor, position });
    return FloorPlanAlignment[sectorAlignment](position, floor);
};

const FloorPlanAlignment = {
    topCenter: (pos, floor) => [HSUtility.middle(floor[0]) + pos[0], pos[1]],
    topLeft: (pos, floor) => pos,
    topRight: (pos, floor) => [floor[0] + pos[0], pos[1]],
    midCenter: (pos, floor) => [
        HSUtility.middle(floor[0]) + pos[0],
        HSUtility.middle(floor[1]) + pos[1],
    ],
    midLeft: (pos, floor) => [pos[0], HSUtility.middle(floor[1]) + pos[1]],
    midRight: (pos, floor) => [floor[0] + pos[0], HSUtility.middle(floor[1]) + pos[1]],
    bottomCenter: (pos, floor) => [HSUtility.middle(floor[0]) + pos[0], floor[1] + pos[1]],
    bottomLeft: (pos, floor) => [pos[0], floor[1] + pos[1]],
    bottomRight: (pos, floor) => [floor[0] + pos[0], floor[1] + pos[1]],
};

// the sector must lands on the position
const secondExpansion = (position, flooring, linesOfTiles) => {
    const diff = position[1] + linesOfTiles.length - flooring.length;
    const expands = diff > 0 ? expandVertical(flooring, diff, false) : [...flooring];
    return expands;
};

const firstExpansion = (position, flooring) => {
    const expandH = position[0] < 0 ? expandHorizontal(flooring, position[0]) : [...flooring];
    const expandV = position[1] < 0 ? expandVertical(expandH, position[1]) : expandH;
    return expandV;
};

const expandHorizontal = (flooring, startX) =>
    flooring.map((line) => line.map(([start, end]) => [-startX + start, -startX + end]));

const expandVertical = (flooring, startY, before = true) => {
    const expands = new Array(Math.abs(startY)).fill().map(() => new Array().fill([]));
    return before ? [...expands, ...flooring] : [...flooring, ...expands];
};

//wrapper wrap array with another layer of array because of sector creation inputs is an array
const createFlooring = (linesOfTiles, position, flooring) => {
    // console.log("--------");
    // console.log({ position });
    // console.log(flooring);
    // console.log(linesOfTiles);
    let startY = position[1];
    const newFlooring = [...flooring];
    linesOfTiles.forEach((tiles) => {
        const newTiles = renewLine(newFlooring[startY], tiles);
        newFlooring.splice(startY, 1, newTiles);
        startY++;
    });
    // console.log(newFlooring);
    return newFlooring;
};

// first insert the new tiles to the line
// second compress tiles to obtain the correct range
const renewLine = (line, target) => {
    // console.log(line, target, "----");
    let newLine = line.reduce(
        (acc, tiles) => {
            let last = acc[acc.length - 1];
            let current = tiles;
            // console.log(last, current);
            const startSmaller = current[0] <= last[0];
            // console.log(startSmaller);
            startSmaller && acc.splice(acc.length - 1, 1, tiles);
            [last, current] = startSmaller ? [current, last] : [last, current];
            // console.log(last, current);
            const endSmaller = current[0] <= last[1];
            // console.log(endSmaller);
            endSmaller && acc[acc.length - 1].splice(1, 1, Math.max(last[1], current[1]));
            !endSmaller && acc.push(current);
            return acc;
        },
        [target]
    );
    return newLine;
};

module.exports = BobTheFloorGuy;
