export let defaultColorSchemes = [
  [125, 125, 117, "Very Bad Day"],
  [184, 183, 118, "Bad Day"],
  [175, 125, 197, "Average Day"],
  [126, 252, 238, "Chill Day"],
  [253, 250, 117, "Good Day"],
  [253, 125, 236, "Amazing Day"],
  [255, 171, 111, "Super Special Day"],
];

// Supports #rrggbb or #rgb
export let parseHex = function (hex) {
  if (hex.length === 7) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    return [r, g, b];
  } else if (hex.length === 3) {
    let r = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
    let g = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
    let b = parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16);

    return [r, g, b];
  }
};
