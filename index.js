const shipyard = require("./arrivedAtHSShipyard");

const frontdesk = shipyard.frontdesk();
const registrationForm = frontdesk();
const form = registrationForm("Ely");
const specialists = frontdesk(form);
// Bob
const BobTheFloorGuy = specialists.BobTheFloorGuy;
const { sectorCreationForm, flooringCreationForm } = BobTheFloorGuy();
const sector = sectorCreationForm("rectangle", 10, 10);
const sector1 = sectorCreationForm("rectangle", 10, 10);
const sector2 = sectorCreationForm("rectangle", 10, 10);
const flooring = flooringCreationForm(sector, "topLeft", [0, 0]);
const flooring1 = flooringCreationForm(sector1, "bottomLeft", [-9, 0], flooring);
const flooring2 = flooringCreationForm(sector2, "bottomRight", [-1, -10], flooring1);
// BobTheFloorGuy(flooring2);
//omig
const OmigTheHandfulMechanic = specialists.OmigTheHandfulMechanic;
const { appliancePlacementForm, AvailableAppliance } = OmigTheHandfulMechanic();
const appliance = appliancePlacementForm(
    AvailableAppliance.EngineNozzle,
    "topLeft",
    [12, 9],
    flooring2
);
console.log(appliance);
const ship = shipyard.construct(flooring2, appliance);
// OmigTheHandfulMechanic(appliance);
//yumyum
// const yumyumTheFeistySmith = specialists.YumyumTheFeistySmith;
// console.log(yumyumTheFeistySmith);
// console.log(appliance);l
// const sector1 = sectorCreationForm("circle", 20);
// const sector2 = sectorCreationForm("rectangle", 10, 10);
// const sector3 = sectorCreationForm("custom", "center", [8, 5, 2, 6, 9]);
// BobTheFloorGuy(sector3);
// console.log("<><><><><><><><><><><><><><>");
// // console.log(sector1);
// // console.log(sector2);
// // console.log(sector3);
// // console.log(BobTheFloorGuy(sector1));
// const flooring = flooringCreationForm(sector3, "topLeft", [0, 0]);
// const secondFlooring = flooringCreationForm(sector2, "topCenter", [4, 1], flooring);
// const thirdFlooring = flooringCreationForm(sector2, "bottomLeft", [-10, -7], secondFlooring);
// // // console.log(thirdFlooring);
// BobTheFloorGuy(flooring);
// console.log("<><><><><><><><><><><><><><>");
// BobTheFloorGuy(secondFlooring);
// console.log("<><><><><><><><><><><><><><>");
// BobTheFloorGuy(thirdFlooring);
// console.log(BobTheFloorGuy(flooring));
// console.log(flooring.flooring);
// console.log(secondFlooring);
// const add = (i) => {
//     return i + 5;
// };
// const test = () => {
//     const i = 5;
//     return {
//         getIndex: () => add(i),
//     };
// };
// const myt = test();
// console.log(myt.getIndex());
// console.log(BobTheFloorGuy(sector3));
// console.log(!!undefined);
// console.log(BobTheFloorGuy(sector1));
// const x = BobTheFloorGuy();
// console.log(x);
// console.log(BobTheFloorGuy.createSector("circle", 20));
// console.log(BobTheFloorGuy.createSector("rectangular", 8, 65));
// console.log(BobTheFloorGuy.createSector("custom", [8, 5, 2, 6, 9], "center"));
// console.log(BobTheFloorGuy.createBaseFloorPlan());
// console.log(
//     BobTheFloorGuy.createBaseFloorPlan(
//         {
//             tiling: [2],
//             tileAlignment: "center",
//             width: 2,
//             height: 1,
//         },
//         [
//             [
//                 [22, 2],
//                 [3, 3],
//             ],
//             [
//                 [2, 3],
//                 [3, 2],
//             ],
//         ]
//     )
// );
// const sector1 = BobTheFloorGuy.createSector("circle", 20);
// const sector2 = BobTheFloorGuy.createSector("rectangular", 8, 65);
// const sector3 = BobTheFloorGuy.createSector("custom", [8, 5, 2, 6, 9], "center");
// const baseFloorPlan = BobTheFloorGuy.createBaseFloorPlan(sector1);
// console.log();
