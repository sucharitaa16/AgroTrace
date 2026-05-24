const generateCustomId = (role) => {
  const random = Math.floor(100000 + Math.random() * 900000);

  switch (role) {
    case "FARMER":
      return `FAR${random}`;

    case "MANUFACTURER":
      return `MANU${random}`;

    case "DISTRIBUTOR":
      return `DIST${random}`;

    case "RETAILER":
      return `RET${random}`;

    default:
      return `USR${random}`;
  }
};

module.exports = generateCustomId;