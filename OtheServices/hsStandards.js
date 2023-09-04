/**
 * state of the art standard for constructing a spaceship
 */

const SectorTileAlignmentStandard = {
    center: 0,
    left: 1,
    right: 2,
};

const CircleSector = {
    fixedFields: { type: "circleSector", tileAlignment: "center" },
    requiredFields: { radius: ["ifNotNull", "ifIntegerAndGTZero"] },
};
const RectangleSector = {
    fixedFields: { type: "rectangleSector", tileAlignment: "center" },
    requiredFields: {
        width: ["ifNotNull", "ifIntegerAndGTZero"],
        height: ["ifNotNull", "ifIntegerAndGTZero"],
    },
};
const CustomSector = {
    fixedFields: { type: "customSector" },
    requiredFields: {
        tileAlignment: ["ifNotNull", "ifValidSectorAlignment"],
        linesOfTiles: ["ifNotNull", "ifArray", "ifIntegersAndAllGTZero"],
    },
};

const FloorPlanAlignmentStandard = {
    topCenter: 0,
    topRight: 1,
    topLeft: 2,
    midCenter: 0,
    midRight: 1,
    midLeft: 2,
    bottomCenter: 3,
    bottomRight: 4,
    bottomLeft: 5,
};

const FlooringForm = {
    fixedFields: { type: "flooringForm" },
    requiredFields: {
        sectorAlignment: ["ifNotNull", "ifValidFloorPlanAlignment"],
        position: ["ifNotNull", "ifArray", "ifLengthTwo", "ifIntegers"],
    },
};

const Flooring = {
    fixedFields: { type: "flooring" },
    requiredFields: {
        flooring: ["ifNotNull", "ifArray", "ifFloorPlanStructure"],
    },
};

const AppliancePlacementForm = {
    fixedFields: { type: "appliancePlacementForm" },
    requiredFields: {
        appliance: ["ifNotNull", "ifValidAppliance"],
        alignment: ["ifNotNull", "ifValidFloorPlanAlignment"],
        position: ["ifNotNull", "ifArray", "ifLengthTwo", "ifIntegers"],
    },
};

const AvailableApplianceStandard = {
    EngineNozzle: "EngineNozzle",
};

const Standards = {
    circleSector: CircleSector,
    rectangleSector: RectangleSector,
    customSector: CustomSector,
    flooringForm: FlooringForm,
    flooring: Flooring,
    appliancePlacementForm: AppliancePlacementForm,
};

module.exports = {
    Standards,
    SectorTileAlignmentStandard,
    FloorPlanAlignmentStandard,
    AvailableApplianceStandard,
};
