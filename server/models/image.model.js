module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define(
    "image",
    {
     
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "url is required" },
        },
      
      }
    },
    {
      paranoid: true,
    }
  );

  return Image;
};
