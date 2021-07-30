function quotient(x, y) {
  if (y === 0) {
    throw error;
  }
  return ~~(x / y);
}

module.exports = {
  quotient,
};
