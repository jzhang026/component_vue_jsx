const {parseHTML} = require('./parse')
module.exports = function(source, map) {
  console.log('myloader is run \n', this.resourcePath)
  const replacer = function replacer(key, value) {
    return value;
  };

  console.log(JSON.stringify(parseHTML(source), replacer, 2));
  return '';
}