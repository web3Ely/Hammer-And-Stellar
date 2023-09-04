const HSInspection = require("../OtheServices/hsInspection");
const HSUtility = require("../OtheServices/hsUtilities");
const HSForms = require("../OtheServices/hsStandardUtilities");

let YumyumTheFeistySmith = {};

YumyumTheFeistySmith.interact = () => {
    const interaction = interactWithYumyum();
    return (arg) => interaction.next(arg).value;
};

const interactWithYumyum = function* interactWithYumyum() {
    let outGoingInteraction = {};
    while (true) {
        const inComingInteraction = yield outGoingInteraction;
        outGoingInteraction = yumyumReacts(inComingInteraction);
    }
};

const SwitchYumyumInteraction = {
    SwitchYumyumInteractionString: (talking) => YumyumReplies(talking),
    SwitchYumyumInteractionObject: (form) => YumyumReceivesDocument(form),
    SwitchYumyumInteractionUnknow: (_) => YumyumCouldNotComprehand(),
};

const YumyumReplies = (inComingTalk) => {
    console.log("Yumyum says yes");
    return 0;
};

const YumyumCouldNotComprehand = () => {
    console.log("Yumyum says no");
    return 0;
};

const YumyumReceivesDocument = (item) => {};

const yumyumReacts = (inComingInteraction) => {
    const interactionType = "SwitchYumyumInteraction" + HSUtility.getType(inComingInteraction);
    const unkownInteractionType = "SwitchYumyumInteractionUnknow";
    const outGoingInteraction =
        SwitchYumyumInteraction[interactionType] || SwitchYumyumInteraction[unkownInteractionType];
    return outGoingInteraction(inComingInteraction);
};

const weaponPlacementForm = (weapon, alignment, position, flooring, ...rest) => {
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
    const isPossible = addWeaponToFlooring(WeaponSize[weapon], alignment, position, inputflooring);
    if (!isPossible) return { errorMessage: "Provided postion does not fit for appliance" };
    // const newFlooring = HSForms.wrapper("flooring", [linesOfTiles]);
    // const finalResutl = inspectionResult(newFlooring);
    // return hasErrorMessage(finalResutl) ? finalResutl : newFlooring;
    return { appliance, position };
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

const WeaponSize = {
    Blaster: [2, 2],
};

const addWeaponToFlooring = (weapon, alignment, position, flooring) => {
    const combinedPosition = adjustPosition(alignment, position, flooring).map((coord) =>
        coord < 0 ? 0 : coord
    );
    const firstLevel = weapon[0];
    const secondLevel = weapon[1];
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
    // console.log({ yAxis, xAxis, secondLevel });
    if (yAxis === undefined) return false;
    matchedTiles = yAxis.find(
        (tiles) => Math.min(tiles[1], xAxis + firstLevel) - Math.max(tiles[0], xAxis) === firstLevel
    );
    if (matchedTiles !== undefined) return false;
    return true;
};

const adjustPosition = (alignment, position, flooring) => {
    const floor = [HSUtility.maxWidth(flooring), flooring.length];
    // console.log({ floor, position });
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

module.exports = YumyumTheFeistySmith;
