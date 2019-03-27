const Jimp = require("jimp");
const color = require("tinycolor2");
const { konsole } = require("./utils");

const sortPixels = async (imageSrc, id) => {
  try {
    const rawImage = await Jimp.read(imageSrc);
    const v = await vertical(rawImage);
    const h = await horizontal(v);
    return h.writeAsync(`./output/${id}.jpg`).then(() => `./output/${id}.jpg`);
  } catch (e) {
    konsole.error(e);
  }
}

const horizontal = image => {
  const newImage = image.clone();

  for (let row = 0; row < newImage.getHeight(); row++) {
    for (let i = 0; i < newImage.getWidth(); i++) {
      let record = -1;
      let sel = i;
      for (let j = i; j < newImage.getWidth(); j++) {
        const c = color(Jimp.intToRGBA(newImage.getPixelColor(j, row)));
        const a = c.toHsv().h;
        if (a > record) {
          sel = j;
          record = a;
        }
      }

      const temp = newImage.getPixelColor(sel, row);
      newImage.setPixelColor(newImage.getPixelColor(i, row), sel, row);
      newImage.setPixelColor(temp, i, row);
    }
  }

  konsole.log("Horizontal: done!");
  return Jimp.read(newImage);
}

const vertical = image => {
  const newImage = image.clone();

  for (let column = 0; column < newImage.getWidth(); column++) {
    for (let i = 0; i < newImage.getHeight(); i++) {
      let record = -1;
      let sel = i;
      for (let j = i; j < newImage.getHeight(); j++) {
        const c = color(Jimp.intToRGBA(newImage.getPixelColor(column, j)));
        const a = c.toHsv().v;
        if (a > record) {
          sel = j;
          record = a;
        }
      }

      const temp = newImage.getPixelColor(column, sel);
      newImage.setPixelColor(newImage.getPixelColor(i, column), column, sel);
      newImage.setPixelColor(temp, column, i);
    }
  }

  konsole.log("Vertical: done!");
  return Jimp.read(newImage);
}

module.exports = { sortPixels };