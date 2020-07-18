const { parseHTML } = require("./parse");
module.exports = function (source, map) {
  console.log("myloader is run \n", this.resourcePath);
  const replacer = function replacer(key, value) {
    return value;
  };
  let tree = parseHTML(source);
  // console.log(JSON.stringify(tree, replacer, 2));

  let template = null;
  let script = null;
  for (let node of tree.children) {
    if (node.tagName === "template") {
      template = node.children.filter((e) => e.type != "text")[0];
    }
    if (node.tagName === "script") {
      script = node.children[0].content;
    }
  }
  // console.log(template)
  // console.log(script)
  let createCode = "";
  let visit = (node) => {
    if (node.type === "text") return JSON.stringify(node.content);
    let attrs = {};
    for (let attr of node.attributes) {
      attrs[attr.name] = attr.value;
    }
    let children = node.children.map((node) => visit(node));
    return `createElement("${node.tagName}", ${JSON.stringify(
      attrs
    )}, ${children})`;
  };
  visit(template);
  let r = `
  import {createElement} from './createElement'
    class Carousel {
      setAttribute(name, value) {
        this[name] = value;
    }
      render() {
        return ${visit(template)}
      }
      mountTo(parent){
        this.render().mountTo(parent)
    }
    }
    export default Carousel;
  `;
  console.log(r);
  return r;
};
