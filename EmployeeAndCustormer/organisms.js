/**
 * type descriptions are from ChatGPT, lol
 */

const CelestialOrganismFeatures = {
    private: () => ({
        class: "An highly intelligent life form that is capable of adapting, using, and creating things",
    }),
    public: (private) => ({
        getClass: () => private.class,
    }),
};

const CelestialOrganism = () => {
    const private = CelestialOrganismFeatures.private();
    const public = CelestialOrganismFeatures.public(private);
    return { ...public };
};

const AlphaFeatures = {
    inheritance: () => ({ CelestialOrganism }),
    private: () => ({
        class: "The Alpha-class organism exhibit a remarkable physiological configuration wherein distinct capabilities are compartmentalized within specialized anatomical regions. Their intricate communication mechanisms manifest through a centrally positioned, oval-shaped aperture atop the uppermost cranial segment. In terms of locomotion, they employ a homogeneous ensemble of lower bodily components that establish consistent contact with the substrate. Furthermore, their adeptness extends to the manipulation and management of tools, where a set of identical mid-level body parts functions as both a support mechanism and an interface for tool engagement.",
        skin: "Full spectrum of colors",
        hands: 0,
        feet: 0,
    }),
    public: (private) => ({
        getClass: () => private.class,
        getSkin: () => private.skin,
        getHands: () => private.hands,
        getFeet: () => private.feet,
        communicate: (inComming) => "Talk",
        motion: (direction) => "Move",
        useTool: (tool) => "Hand",
    }),
    constructors: (priave, inheritance) => ({
        0: () => {},
        1: (skin) => {
            priave.skin = skin;
        },
    }),
};

const Alpha = (...args) => {
    const inheritance = AlphaFeatures.inheritance();
    const private = AlphaFeatures.private();
    const public = AlphaFeatures.public(private);
    const constructors = AlphaFeatures.constructors(private, inheritance);
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

const GammaFeatures = {
    inheritance: () => ({ CelestialOrganism }),
    private: () => ({
        class: "The enigma surrounding Gamma-class organisms shrouds them in obscurity, leaving us with only sparse fragments of comprehension. What we do know is that these formidable entities command a lethal prowess and an imposing magnitude that evokes awe and trepidation in equal measure. Their presence, an enigmatic force of nature, defies conventional understanding, casting an ominous shadow across the cosmic tapestry.",
    }),
    public: (private) => ({
        getClass: () => private.class,
        unknow: null,
    }),
};

const Gamma = () => {
    const inheritance = GammaFeatures.inheritance();
    const private = GammaFeatures.private();
    const public = GammaFeatures.public(private);
    return {
        ...Object.keys(inheritance).reduce(
            (objAccumulator, parentTypes) => ({
                ...objAccumulator,
                ...inheritance[parentTypes](),
            }),
            {}
        ),
        ...public,
    };
};

const BetaFeatures = {
    inheritance: () => ({ CelestialOrganism }),
    private: () => ({
        class: "In the vast annals of existence, the Beta-class organism emerges as a primordial echo, lingering on the fringes of advancement. A sense of bustling unease emanates from these nascent entities as they encounter outsiders, their interactions laden with an air of rudimentary urgency. Amongst the ranks of Beta-class organisms, diversity flourishes, with variations in body architecture. Notably, the conventional demarcations between body segments when wielded as tools are absent, underscoring a basic integration of form and function. Their communication, a symphony of primal tones, reverberates through the cosmos, evoking echoes of an era untouched by the intricacies of sophisticated discourse.",
    }),
    public: (private) => ({
        getClass: () => private.class,
    }),
};

const Beta = () => {
    const inheritance = BetaFeatures.inheritance();
    const private = BetaFeatures.private();
    const public = BetaFeatures.public(private);
    return {
        ...Object.keys(inheritance).reduce(
            (objAccumulator, parentTypes) => ({
                ...objAccumulator,
                ...inheritance[parentTypes](),
            }),
            {}
        ),
        ...public,
    };
};

const HumanFeatures = {
    inheritance: () => ({ Alpha }),
    private: () => ({
        class: "Human",
        creditScore: 0,
        name: "",
        skin: "",
        hands: 2,
        feet: 2,
    }),
    public: (private) => ({
        getClass: () => private.class,
        getCreditScore: () => private.creditScore,
        getName: () => private.name,
    }),
    constructors: (priave, inheritance) => ({
        0: () => {},
        3: (name, skin, creditScore) => {
            inheritance.Alpha = Alpha(skin);
            priave.name = name;
            priave.skin = skin;
            priave.creditScore = creditScore;
        },
    }),
};

const Human = (...args) => {
    const inheritance = HumanFeatures.inheritance();
    const private = HumanFeatures.private();
    const public = HumanFeatures.public(private);
    const constructors = HumanFeatures.constructors(private, inheritance);
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
const bob = Human("Bob", "Tan", "850");
console.log(bob.getSkin());

const Oria = {};

const Gonabi = {};

const Furry = {};

// const bob = HumanLike();
// console.log(Object.keys(bob));
// console.log(bob.talk());

// const ChildMembers = {
//     inheritance: () => ({ Entity }),
//     private: () => ({
//         type: "This is the child",
//     }),
//     public: (private) => ({
//         // getClass: () => private.type,
//         getChildType: () => private.type,
//     }),
// };

// const Child = () => {
//     const inheritance = ChildMembers.inheritance();
//     const private = ChildMembers.private();
//     const public = ChildMembers.public(private);
//     return {
//         ...Object.keys(inheritance).reduce(
//             (objAccumulator, parentTypes) => ({
//                 ...objAccumulator,
//                 ...inheritance[parentTypes](),
//             }),
//             {}
//         ),
//         ...public,
//     };
// };
