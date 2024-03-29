"use_strict"
const Jimp = require("jimp");

async function makeWelcomeImage (interaction, language_result) {
  const image = await Jimp.read("./utils/welcome-system/welcomeDefault.jpg");
  const imageTest = await Jimp.read("./utils/welcome-system/welcomeDefault.jpg");
  const fontRoboto42 = await Jimp.loadFont("./utils/welcome-system/font/ROBOTOWHITE42/ROBOTO-LIGHT-42.fnt");

  // SCRIVO IL MESSAGGIO DI BENVENUTO NEL IMMAGINE
  image.print(fontRoboto42, 340, 150, {
    text: "BENVENUTO IN\n ALKA NETWORK ITALIA",
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  }, 600, 0);
  
  // RIDIMENSIONO L'IMMAGINE UTENTE
  imageTest.resize(150, 150);
  image.blit(imageTest, 10, 10)
  

  image.write("test.jpg");
}

makeWelcomeImage();