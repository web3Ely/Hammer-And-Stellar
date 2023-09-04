const HSUtility = require("./OtheServices/hsUtilities");

const BobTheFloorGuy = require("./ShipFlooring/shipFloring");
// const TingTheEccentricDesigner = require("./ShipInteriorDesign/shipInteriorDesign");
const OmigTheHandfulMechanic = require("./ShipAppliance/shipAppliance");
const YumyumTheFeistySmith = require("./ShipWeaponry/shipWeaponry");

let shipyard = (module.exports = {});

shipyard.frontdesk = (customerStat = "New Customer") => {
    const interaction = interactWithFrontDesk(customerStat);
    return (arg) => interaction.next(arg).value;
};

const interactWithFrontDesk = function* interactWithFrontDesk(customerStat) {
    let outGoingInteraction = registrationForm.bind(null, customerStat);
    while (true) {
        const inComingInteraction = yield outGoingInteraction;
        outGoingInteraction = frontdeskReacts(inComingInteraction);
    }
};

const registrationForm = (customerStat, name, shipSize, payment) => {
    let _customerStat = customerStat,
        _name = name,
        _shipSize = shipSize,
        _payment = payment;
    return {
        getCustomerStat: () => _customerStat,
        getName: () => _name,
        getShipSize: () => _shipSize,
        getPayment: () => _payment,
    };
};

const SwitchFrontdeskInteraction = {
    SwitchFrontdeskInteractionString: (talking) => receptionistReplies(talking),
    SwitchFrontdeskInteractionObject: (form) => receptionistReceivesDocument(form),
    SwitchFrontdeskInteractionUnknow: (_) => receptionistCouldNotComprehand(),
};

const receptionistReplies = (inComingTalk) => {
    console.log("S94 says yes");
    return 0;
};

const receptionistCouldNotComprehand = () => {
    console.log("S94 says no");
    return 0;
};

const receptionistReceivesDocument = (item) => {
    //Currently no checking logic is implemented
    //do some checking here
    console.log("S94 says our specialist will be right with you");
    return {
        BobTheFloorGuy: BobTheFloorGuy.interact(),
        // TingTheEccentricDesigner: TingTheEccentricDesigner.interact(),
        OmigTheHandfulMechanic: OmigTheHandfulMechanic.interact(),
        YumyumTheFeistySmith: YumyumTheFeistySmith.interact(),
    };
};
const frontdeskReacts = (inComingInteraction) => {
    const interactionType = "SwitchFrontdeskInteraction" + HSUtility.getType(inComingInteraction);
    const unkownInteractionType = "SwitchFrontdeskInteractionUnknow";
    const outGoingInteraction =
        SwitchFrontdeskInteraction[interactionType] ||
        SwitchFrontdeskInteraction[unkownInteractionType];
    return outGoingInteraction(inComingInteraction);
};
