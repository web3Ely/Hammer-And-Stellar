const HSInspection = require("../hsInspection");
const HSUtility = require("../hsUtilities");
const HSForms = require("../hsStandardUtilities");

let TingTheEccentricDesigner = {};

TingTheEccentricDesigner.interact = () => {
    const interaction = interactWithTing();
    return (arg) => interaction.next(arg).value;
};

const interactWithTing = function* interactWithTing() {
    let outGoingInteraction = { roomCreationForm };
    while (true) {
        const inComingInteraction = yield outGoingInteraction;
        outGoingInteraction = tingReacts(inComingInteraction);
    }
};

const SwitchTingInteraction = {
    SwitchTingInteractionString: (talking) => tingReplies(talking),
    SwitchTingInteractionObject: (form) => tingReceivesDocument(form),
    SwitchTingInteractionUnknow: (_) => tingCouldNotComprehand(),
};

const tingReplies = (inComingTalk) => {
    console.log("Ting says yes");
};

const tingCouldNotComprehand = () => {
    console.log("Ting says she doesn't know");
};

const tingReceivesDocument = (item) => {
    console.log("Ting says documents");
};
const tingReacts = (inComingInteraction) => {
    const interactionType = "SwitchTingInteraction" + HSUtility.getType(inComingInteraction);
    const unkownInteractionType = "SwitchTingInteractionUnknow";
    const outGoingInteraction =
        SwitchTingInteraction[interactionType] || SwitchTingInteraction[unkownInteractionType];
    return outGoingInteraction(inComingInteraction);
};

const roomCreationForm = () => {};

module.exports = TingTheEccentricDesigner;
