function generateId() {
  let id = 1;

  return function () {
    const generatedId = id;
    id++;
    return generatedId;
  };
}

export default generateId()