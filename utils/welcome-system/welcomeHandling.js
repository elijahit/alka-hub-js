"use_strict"
const {Jimp, loadFont, measureText} = require("jimp");


async function makeWelcomeImage(user, serverName, language_result, color, backgroundUrl) {
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
  let avatarResolve = user.avatarURL() ? user.avatarURL().replace('webp', "jpg") : user.defaultAvatarURL;
  const avatarImage = await Jimp.read(avatarResolve);

  const fontRoboto42 = color == 0 ?
    await loadFont("./utils/welcome-system/font/ROBOTOWHITE64/ROBOTOWHITE64.fnt") :
    await loadFont("./utils/welcome-system/font/ROBOTOBLACK64/ROBOTOBLACK64.fnt");

  baseImage.resize({w: 1280, h:720});

  // SCRIVO IL MESSAGGIO DI BENVENUTO NEL IMMAGINE
  baseImage.print({font: fontRoboto42, x: 640 - (measureText(fontRoboto42, language_result.welcomeMessage.description_embed) / 2), y: 470, text: language_result.welcomeMessage.description_embed});
  // SCRIVO IL NOME DEL SERVER NEL IMMAGINE
  baseImage.print({font: fontRoboto42, x: 640 - (measureText(fontRoboto42, serverName) / 2), y: 550, text: serverName});
  // SCRIVO IL NOME UTENTE NEL IMMAGINE
  baseImage.print({font: fontRoboto42, x: 640 - (measureText(fontRoboto42, user.username) / 2), y: 360, text: user.username});
  // METTO UN HORIZONTAL RULE
  baseImage.print({font: fontRoboto42, x: 640 - (measureText(fontRoboto42, "-") / 2), y: 415, text: "-"});

  // RIDIMENSIONO L'IMMAGINE UTENTE
  avatarImage
    .resize({w: 220, h: 220})
    .circle();
  // RIDIMENSIONO IL CIRCLE MASK
  let colorChecker = color == 0 ? 255 : 0;
  baseCircleMask
    .resize({w: 230, h: 230})
    .circle()
    .normalize()
    .color([
      { apply: "red", params: [colorChecker] },
      { apply: "green", params: [colorChecker] },
      { apply: "blue", params: [colorChecker] }
    ]);

  // APPLICO LE IMMAGINI SULLA BASE
  baseImage.blit({src: baseCircleMask, x: 525, y: 100});
  baseImage.blit({src: avatarImage, x: 530, y: 105});

  return await baseImage.getBuffer("image/jpeg");
}

module.exports = {
  makeWelcomeImage
}
