const Archdeaconries = [
  "Somolu", "Oto-Awori", "Isolo", "Bariga", "Ikeja", "Opebi",
  "Ojo-Alaba", "Ogudu", "Idimu", "Imota", "Satellite", "Oshodi",
  "Ojodu", "Ikorodu", "Ikotun", "Gowon Estate", "Ipaja", "Egbe",
  "Ikorodu-North", "Owutu", "Iju-Ishaga", "Ikosi-Ketu", "Abule Egba",
  "Ijede", "Ojo", "Cathedral", "Festac", "Iba", "Agege", "Amuwo Odofin"
].sort();

const getArchdeaconryCode = (archdeaconry) => {
  const codeMap = {
    "Abule Egba": "01",
    "Agege": "02",
    "Amuwo Odofin": "03",
    "Bariga": "04",
    "Cathedral": "05",
    "Egbe": "06",
    "Festac": "07",
    "Gowon Estate": "08",
    "Iba": "09",
    "Idimu": "10",
    "Ijede": "11",
    "Iju-Ishaga": "12",
    "Ikeja": "13",
    "Ikorodu": "14",
    "Ikorodu-North": "15",
    "Ikosi-Ketu": "16",
    "Ikotun": "17",
    "Imota": "18",
    "Ipaja": "19",
    "Isolo": "20",
    "Ogudu": "21",
    "Ojo": "22",
    "Ojo-Alaba": "23",
    "Ojodu": "24",
    "Opebi": "25",
    "Oshodi": "26",
    "Oto-Awori": "27",
    "Owutu": "28",
    "Satellite": "29",
    "Somolu": "30"
  };
  return codeMap[archdeaconry] || "";
};

export { Archdeaconries, getArchdeaconryCode };