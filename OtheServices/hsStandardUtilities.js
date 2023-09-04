const HSFormStandard = require("./hsStandards");

const HSForms = (module.exports = {});
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// can recevie random type
HSForms.getFormInspections = (type, inputForm) => {
    const standard = HSFormStandard.Standards[type];
    return standard === undefined ? [] : formInspections(standard, inputForm);
};
// can recevie random type
HSForms.wrapper = (type, inputData) => {
    const standard = HSFormStandard.Standards[type];
    return standard === undefined ? {} : generateInputFiedls(standard, inputData);
};
HSForms.getStandard = (standard) => {
    return HSFormStandard[standard];
};
//common functions
const formInspections = (standardForm, inputForm) => {
    const [fixedFields, requiredFields] = getStandardFields(standardForm);
    const fixedInspections = fixedFieldsInspections(fixedFields, inputForm);
    const requiredInspections = requiredFieldInspections(requiredFields, inputForm);
    const extraInspection = extraFieldInspections(standardForm, inputForm);
    return [...fixedInspections, ...requiredInspections, extraInspection];
};
const generateInputFiedls = (standardForm, inputData) => {
    const [fixedFields, requiredFields] = getStandardFields(standardForm);
    const fieldNames = Object.keys(requiredFields);
    const inputFields = fieldNames.reduce(
        (accumulator, fieldName, index) => ({
            ...accumulator,
            [fieldName]: inputData[index],
        }),
        {}
    );
    const ifExtraInputs = inputData.length !== fieldNames.length;
    ifExtraInputs ? (inputFields["inputsMatch"] = false) : (inputFields["inputsMatch"] = true);
    return { ...fixedFields, ...inputFields };
};

// helper functions
function fixedFieldsInspections(fixedFields, inputForm) {
    const fieldNames = Object.keys(fixedFields);
    const inspection = "ifFixedFieldEquals";
    const inspections = fieldNames.reduce(
        (accumulator, fieldName) => [
            ...accumulator,
            [inspection, fieldName, [fixedFields[fieldName], inputForm[fieldName]]],
        ],
        []
    );
    return inspections;
}

function requiredFieldInspections(requiredFields, inputForm) {
    const fieldNames = Object.keys(requiredFields);
    const inspections = fieldNames.reduce(
        (accumulator, fieldName) => [
            ...accumulator,
            ...requiredFields[fieldName].reduce(
                (accumulator, inspection) => [
                    ...accumulator,
                    [inspection, fieldName, inputForm[fieldName]],
                ],
                []
            ),
        ],
        []
    );
    return inspections;
}

function extraFieldInspections(standardForm, inputForm) {
    const ifHas = Object.hasOwn(inputForm, "inputsMatch");
    const checkExtraField = ["ifTrue", "inputsMatch", inputForm.inputsMatch];
    if (ifHas) delete inputForm.inputsMatch;
    if (ifHas) return checkExtraField;
    const [fixedFields, requiredFields] = getStandardFields(standardForm);
    const fixedLength = Object.keys(fixedFields).length;
    const requiredLength = Object.keys(requiredFields).length;
    const inputLength = Object.keys(inputForm).length;
    const inputsMatch = fixedLength + requiredLength === inputLength;
    checkExtraField[2] = inputsMatch;
    return checkExtraField;
}

function getStandardFields(standardForm) {
    return [standardForm.fixedFields, standardForm.requiredFields];
}
