const HSInspection = require("../OtheServices/hsInspection");
const HSUtility = require("../OtheServices/hsUtilities");
const HSForms = require("../OtheServices/hsStandardUtilities");

let OmigTheHandfulMechanic = {};
const AvailableAppliance = HSForms.getStandard("AvailableApplianceStandard");

OmigTheHandfulMechanic.interact = () => {
    const interaction = interactWithOmig();
    return (arg) => interaction.next(arg).value;
};

const interactWithOmig = function* interactWithOmig() {
    let outGoingInteraction = { appliancePlacementForm, AvailableAppliance };
    while (true) {
        const inComingInteraction = yield outGoingInteraction;
        outGoingInteraction = omigReacts(inComingInteraction);
    }
};

const SwitchOmigInteraction = {
    SwitchOmigInteractionString: (talking) => omigReplies(talking),
    SwitchOmigInteractionObject: (form) => omigReceivesDocument(form),
    SwitchOmigInteractionUnknow: (_) => omigCouldNotComprehand(),
};

const omigReplies = (inComingTalk) => {
    console.log("Omig says oo");
    return 0;
};

const omigCouldNotComprehand = () => {
    console.log("Omig says ka");
    return 0;
};

const omigReceivesDocument = (inputForm) => {
    inputForm.appliance !== undefined && showAppliance(inputForm);
};

const showAppliance = (appliance) => {
    const floor = appliance.flooring;
    const showlines = floor.map((linesOfTiles) => showLinesOfTiles(linesOfTiles, true).join(""));
    const applianceSize = ApplianceSize[appliance.appliance];
    const pos = appliance.combinedPosition;
    applianceSize.forEach((level, index) => {
        const start = pos[0] - index;
        const replaceIndex = pos[1] + index;
        if (showlines[replaceIndex] === undefined) showlines.push([]);
        const line = showlines[replaceIndex].split("");
        line.splice(start, level, ..."|".repeat(level).split(""));
        showlines[replaceIndex] = line.join("");
    });
    showlines.forEach((each) => {
        each = each.replaceAll("_", "\x1b[47m \x1b[0m");
        each = each.replaceAll("|", "\x1b[41m \x1b[0m");
        console.log(each);
    });
};

const showLinesOfTiles = (list, concat = false) => {
    const printScaling = 1;
    let lastEnd = 0;
    return list.reduce((acc, item) => {
        const padStart = (item[0] - lastEnd) * printScaling;
        const tiles = (item[1] - item[0]) * printScaling;
        lastEnd = concat ? item[1] : 0;
        return [...acc, " ".repeat(padStart) + "_".repeat(tiles)];
    }, []);
};

const omigReacts = (inComingInteraction) => {
    const interactionType = "SwitchOmigInteraction" + HSUtility.getType(inComingInteraction);
    const unkownInteractionType = "SwitchOmigInteractionUnknow";
    const outGoingInteraction =
        SwitchOmigInteraction[interactionType] || SwitchOmigInteraction[unkownInteractionType];
    return outGoingInteraction(inComingInteraction);
};

const appliancePlacementForm = (appliance, alignment, position, flooring, ...rest) => {
    // check AppliancePlacementForm
    const customerInputs = [appliance, alignment, position, ...rest];
    const placementForm = HSForms.wrapper("appliancePlacementForm", customerInputs);
    const pfResult = inspectionResult(placementForm);
    if (hasErrorMessage(pfResult)) return pfResult;
    //check floorPlan
    const flooringResult = inspectionResult(flooring);
    if (hasErrorMessage(flooringResult)) return flooringResult;
    const inputflooring = HSUtility.deepCopy(flooring.flooring);
    // create and check new flooring
    const combinedPosition = adjustPosition(alignment, position, inputflooring).map((coord) =>
        coord < 0 ? 0 : coord
    );
    const isPossible = addApplianceToFlooring(
        ApplianceSize[appliance],
        combinedPosition,
        inputflooring
    );
    if (!isPossible) return { errorMessage: "Provided postion does not fit for appliance" };
    const applianceSize = ApplianceSize[appliance].map((line, index) => [
        combinedPosition[0] - index,
        combinedPosition[0] - index + line,
    ]);
    return {
        type: "appliance",
        applianceName: appliance,
        applianceStructure: applianceSize,
        combinedPosition,
    };
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

const ApplianceSize = {
    EngineNozzle: [4, 6, 8],
};

const addApplianceToFlooring = (appliance, combinedPosition, flooring) => {
    const firstLevel = appliance[0];
    const secondLevel = appliance[1];
    const thirdLevel = appliance[2];
    // console.log({ combinedPosition });
    //firstlevel check
    let yAxis = flooring[combinedPosition[1]];
    if (yAxis === undefined) return false;
    let xAxis = combinedPosition[0];
    // console.log({ yAxis, xAxis, firstLevel });
    let matchedTiles = yAxis.find(
        (tiles) => Math.min(tiles[1], xAxis + firstLevel) - Math.max(tiles[0], xAxis) === firstLevel
    );
    if (matchedTiles === undefined) return false;
    // if (matchedTiles[1] < firstLevel + xAxis) return 1;
    //secondlevel check
    yAxis = flooring[combinedPosition[1] + 1];
    xAxis = xAxis - (secondLevel - firstLevel) / 2;
    // console.log({ yAxis, xAxis, secondLevel });
    if (yAxis !== undefined) {
        matchedTiles = yAxis.find(
            (tiles) => Math.max(tiles[0], xAxis) < Math.min(tiles[1], xAxis + secondLevel)
        );
        if (matchedTiles !== undefined) return false;
    }
    //thirdlevel check
    yAxis = flooring[combinedPosition[1] + 2];
    xAxis = xAxis - (secondLevel - firstLevel) / 2;
    // console.log({ yAxis, xAxis, thirdLevel });
    if (yAxis !== undefined) {
        matchedTiles = yAxis.find(
            (tiles) => Math.max(tiles[0], xAxis) < Math.min(tiles[1], xAxis + thirdLevel)
        );
        if (matchedTiles !== undefined) return false;
    }
    return true;
};

const adjustPosition = (alignment, position, flooring) => {
    const floor = [HSUtility.maxWidth(flooring), flooring.length];
    return FloorPlanAlignment[alignment](position, floor);
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

module.exports = OmigTheHandfulMechanic;
