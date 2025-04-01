module.exports = {
  whereAndStackError(filePath, error) {
    return `Arquivo: ${filePath}\n${error.stack}.`;
  }
};