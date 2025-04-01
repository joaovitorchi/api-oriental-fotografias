class Parser {
  flexStringToInt(value) {
    if (typeof value != "string") {
      return value;
    }

    if (value.lenth < 1)
      return value;

    const newValue = parseInt(value);

    if (isNaN(newValue))
      return value;

    return newValue;
  }

  flexStringToFloat(value) {
    if (typeof value != "string") {
      return value;
    }


    if (value.indexOf(",") > -1 && value.indexOf(".") < 0) {
      value = value.replace(",", ".");
    }

    if (value.lenth < 1)
      return value;

    const newValue = parseFloat(value);

    if (isNaN(newValue))
      return value;

    return newValue;
  }

  toLogico(value) {
    const trueOptions = [true, 'true', 1, '1'];

    return trueOptions.includes(value);
  }
}

module.exports = new Parser();
