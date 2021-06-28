export const project = {
  name: "Foo",
  author: "bar",
  eventsFunctions: ["oneExtension", "secondExtension"],
  behaviors: {
    one: { eventsFunctions: ["myOtherExt", "secondExtension"] },
    two: { eventsFunctions: ["extension", "yet another extension"] },
  },
};
