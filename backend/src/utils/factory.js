module.exports = {
  factory(rows, model) {
    return rows && rows.length > 0 ? rows.map(row => new model(row)) : [];
  }
};