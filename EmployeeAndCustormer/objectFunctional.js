/**
 * !OOP && Object Functional Programing(OFP)
 * OOP is super powerful, but verbose and codes are not reuseable
 * OFP tries to implement the same concept with reuseable and modular code with limitless structure
 * Importence is the idea, not the implementation. Implementation can vary based on once style
 *
 * Object in OFP is a function that has two parts: objectFeatures and objectInitialization
 *
 * objectFeatures is an object that has following four keys(properties) that each maches a function object:
 *      1. inheritance: it is a function that returns all parent function object
 *      2. private: it is a function that holds all private members of an object
 *      3. public: it is a function that holds all public members of an object, we must pass the private function object for getters and setters
 *      4. constructors: it is a collection of function stored in a key value pair that act as constructorss in OOP. They key of a single constructors is its parameters count
 *
 * objectInitialization is an function object that handles initialization of a function using following steps:
 *      1. instantiate objectFeatures
 *      2. assign parameters to private members by calling the matching contructor, it also instantiate parant function object if stated in the constructor
 *      3. return an object that contains all public members of the target object function and its parents function, it must be freezed to avoid further manipulation
 *
 * Note:
 * Protected Member: we do not need protected member for now
 * Override: when returning the object in objectInitialization function, any child public members that are added after parents public members will replace the same name members in its parents
 * Polymorphism: since pure javascrip does not have type indicator, developer must make sure they are calling the right function object,
 *               I will add support for polymorphism in typescript in the next update
 * objectFeatures: the reason for every properties in this object is an function is because of the flexibility that we can pass parameters to them
 *                 since arrow function has no context, we must pass the exact object property that we want to change to a function property that we want to call
 * Style: code below is not the best implementation of OFP, therefore you can implement your own style based on your project.
 *
 * Issue:
 * 1. Might create hard time figuring bugs by reading exception message
 * 2. Child Object function members can not call Parent's public members within the child object function declaration
 *    Therefore in the code below, Dog object function private member isOldEnough can not access age that is defined in Animal object function
 */

// Basic Overview
const AnimalFeatures = {
    inheritance: () => {},
    private: () => ({
        name: "",
        age: 0,
        type: "It is an animal",
    }),
    public: (private) => ({
        getName: () => private.name,
        setName: (name) => (private.name = name),
        getAge: () => private.age,
        setAge: (age) => (private.age = age),
        getType: () => private.type,
    }),
    constructors: (private) => ({
        0: () => {},
        2: (name, age) => {
            private.name = name;
            private.age = age;
        },
    }),
};

const Animal = (...args) => {
    //instantiate objectFeatures
    const inheritance = {};
    const private = AnimalFeatures.private();
    const public = AnimalFeatures.public(private);
    const constructors = AnimalFeatures.constructors(private, inheritance);
    //assign params
    constructors[args.length] && constructors[args.length](...args);
    //return object
    return Object.freeze({
        ...Object.keys(inheritance).reduce(
            (objAccumulator, parentTypes) => ({
                ...objAccumulator,
                ...(inheritance[parentTypes] === "function"
                    ? inheritance[parentTypes]()
                    : inheritance[parentTypes]),
            }),
            {}
        ),
        ...public,
    });
};

const DogFeatures = {
    inheritance: () => ({
        Animal,
    }),
    private: () => ({
        type: "It is a dog",
        color: "",
        isOldEnough: (age) => (age >= 15 ? true : false),
    }),
    public: (private) => ({
        checkIfOldEnough: () => private.isOldEnough(private.age),
        getColor: () => private.color,
        setColor: (color) => (private.color = color),
        getType: () => private.type,
    }),
    constructors: (private, inheritance) => ({
        0: () => {},
        3: (name, age, color) => {
            inheritance.Animal = Animal(name, age);
            private.color = color;
        },
    }),
};

const Dog = (...args) => {
    const inheritance = DogFeatures.inheritance();
    const private = DogFeatures.private();
    const public = DogFeatures.public(private);
    const constructors = DogFeatures.constructors(private, inheritance);
    constructors[args.length] && constructors[args.length](...args);
    return Object.freeze({
        ...Object.keys(inheritance).reduce(
            (objAccumulator, parentTypes) => ({
                ...objAccumulator,
                ...(inheritance[parentTypes] === "function"
                    ? inheritance[parentTypes]()
                    : inheritance[parentTypes]),
            }),
            {}
        ),
        ...public,
    });
};

// const bulldog = Dog("Dogy", 10, "brown");
// console.log(bulldog.getName());
// console.log(bulldog.getAge());
// console.log(bulldog.checkIfOldEnough());

// const animal = Animal();
// const dogOne = Dog();
// const dogTwo = Dog();
// [animal, dogOne, dogTwo].forEach((animal) => console.log(animal.getType()));

// ------------------------------------------------------------------
// modular and reusable
const objectInstantiation = (Features, args) => {
    const inheritance = !!Features["inheritance"]
        ? Features["inheritance"]()
        : {};
    const private = !!Features["private"] ? Features["private"]() : {};
    const public = !!Features["public"] ? Features["public"](private) : {};
    const constructors = !!Features["constructors"]
        ? Features["constructors"](private, inheritance)
        : {};
    constructors[args.length] && constructors[args.length](...args);
    return { inheritance, public };
};

const returnObject = ({ inheritance, public }) => {
    return Object.freeze({
        ...Object.keys(inheritance).reduce(
            (objAccumulator, parentTypes) => ({
                ...objAccumulator,
                ...(inheritance[parentTypes] === "function"
                    ? inheritance[parentTypes]()
                    : inheritance[parentTypes]),
            }),
            {}
        ),
        ...public,
    });
};

// we can add more params that determine if a property needs a setter or getter or both
const getAndSetters = (properties, private) => {
    return properties.reduce((proptAccumulator, property) => {
        const firstUpperCase = property
            .slice(1)
            .padStart(property.length, property.charAt(0).toUpperCase());
        proptAccumulator["get" + firstUpperCase] = () => private[property];
        proptAccumulator["set" + firstUpperCase] = (value) =>
            (private[property] = value);
        return proptAccumulator;
    }, {});
};

const Animal2Features = {
    private: () => ({
        name: "",
        age: 0,
        type: "It is an animal",
    }),
    public: (private) => ({
        ...getAndSetters(["name", "age", "type"], private),
    }),
    constructors: (private) => ({
        0: () => {},
        2: (name, age) => {
            private.name = name;
            private.age = age;
        },
    }),
};

const Animal2 = (...args) => {
    return returnObject(objectInstantiation(Animal2Features, args));
};

const Dog2Features = {
    inheritance: () => ({
        Animal,
    }),
    private: () => ({
        type: "It is a dog",
        color: "",
        isOldEnough: (age) => {
            const yes = age >= 15 ? true : false;
        },
    }),
    public: (private) => ({
        checkIfOldEnough: () => private.isOldEnough(private.age),
        ...getAndSetters(["type", "color"], private),
    }),
    constructors: (private, inheritance) => ({
        0: () => {},
        3: (name, age, color) => {
            inheritance.Animal = Animal(name, age);
            private.color = color;
        },
    }),
};

const Dog2 = (...args) => {
    return returnObject(objectInstantiation(Dog2Features, args));
};

const bulldog = Dog2("Dogy", 10, "brown");
console.log(bulldog.getName());
console.log(bulldog.getAge());
bulldog.setAge(16);
console.log(bulldog.getAge());
// console.log(bulldog.checkIfOldEnough());

const animal = Animal2();
const dogOne = Dog2();
const dogTwo = Dog2();
[animal, dogOne, dogTwo].forEach((animal) => console.log(animal.getType()));
