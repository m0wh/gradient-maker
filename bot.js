const Jimp = require("jimp");

const sortPixels = async imageSrc => {
  let pixels = []
  try {
    const image = await Jimp.read(imageSrc);
    for(let x = 0; x < image.getWidth(); x++) {
      pixels[x] = [];
      for(let y = 0; y < image.getHeight(); y++) {
        pixels[x][y] = image.getPixelColor(x, y);
      }
    }

    const newImage = await new Jimp(image.getWidth(), image.getHeight());
    for(let x = 0; x < image.getWidth(); x++) {
      for(let y = 0; y < image.getHeight(); y++) {
        newImage.setPixelColor(pixels[image.getWidth() - x - 1][y], x, y);
      }
    }
    return newImage.writeAsync("./output/test.jpg");
  } catch (e) {
    console.log(e);
  }
}

module.exports = { sortPixels };