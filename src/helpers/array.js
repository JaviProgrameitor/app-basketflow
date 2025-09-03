
const groupBy = (data, key) => {
  return data.reduce((acc, item) => {
    const clave = item[key];
    if (!acc[clave - 1]) {
      acc[clave - 1] = [];
    }
    acc[clave - 1].push(item);
    return acc;
  }, []);
};

function mixingArr(arr) {
  // Copia el arreglo para no modificar el original
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    // Elige un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));
    // Intercambia elementos en las posiciones i y j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export {
  groupBy,
  mixingArr
}
