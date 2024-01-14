const normalizeVector2 = function (vector) {
  vector.x = (vector.x / document.body.clientWidth) * 2 - 1;
  vector.y = -(vector.y / window.innerHeight) * 2 + 1;
};
export default normalizeVector2;
