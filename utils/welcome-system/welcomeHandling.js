"use_strict"
const Jimp = require("jimp");


async function makeWelcomeImage(avatar, user, serverName, language_result, color, backgroundUrl) {
  let baseImage;
  try {
    // CERCA DI RECUPERARE L'IMMAGINE TRAMITE L'URL SE ESISTE O PASSA 
    // QUELLO DI DEFAULT
    baseImage = await Jimp.read(backgroundUrl ? backgroundUrl : "./utils/welcome-system/welcomeDefault.jpg");
  } catch {
    // SE NON RIESCE PASSA IL BACKGROUND DI DEFAULT
    baseImage = await Jimp.read("./utils/welcome-system/welcomeDefault.jpg");
  }
  const baseCircleMask = await Jimp.read("./utils/welcome-system/defaultCircleMask.jpg");
  const avatarImage = await Jimp.read(avatar.replace('webp', "jpg"));

  const fontRoboto42 = color == 0 ?
    await Jimp.loadFont("./utils/welcome-system/font/ROBOTOWHITE64/ROBOTOWHITE64.fnt") :
    await Jimp.loadFont("./utils/welcome-system/font/ROBOTOBLACK64/ROBOTOBLACK64.fnt");

  baseImage.resize(1280, 720);

  // SCRIVO IL MESSAGGIO DI BENVENUTO NEL IMMAGINE
  baseImage.print(fontRoboto42, 640 - (Jimp.measureText(fontRoboto42, language_result.welcomeMessage.description_embed) / 2), 400, language_result.welcomeMessage.description_embed);
  // SCRIVO IL NOME DEL SERVER NEL IMMAGINE
  baseImage.print(fontRoboto42, 640 - (Jimp.measureText(fontRoboto42, serverName) / 2), 480, serverName);
  // SCRIVO IL NOME UTENTE NEL IMMAGINE
  baseImage.print(fontRoboto42, 640 - (Jimp.measureText(fontRoboto42, user.username) / 2), 290, user.username);
  // METTO UN HORIZONTAL RULE
  baseImage.print(fontRoboto42, 640 - (Jimp.measureText(fontRoboto42, "-") / 2), 345, "-");

  // RIDIMENSIONO L'IMMAGINE UTENTE
  avatarImage
    .resize(220, 220)
    .circle(20);
  // RIDIMENSIONO IL CIRCLE MASK
  let colorChecker = color == 0 ? 255 : 0;
  baseCircleMask
    .resize(230, 230)
    .circle(20)
    .normalize()
    .color([
      { apply: "red", params: [colorChecker] },
      { apply: "green", params: [colorChecker] },
      { apply: "blue", params: [colorChecker] }
    ]);

  // APPLICO LE IMMAGINI SULLA BASE
  baseImage.blit(baseCircleMask, 525, 60);
  baseImage.blit(avatarImage, 530, 65);

  return baseImage.getBufferAsync("image/jpeg");
}

module.exports = {
  makeWelcomeImage
}