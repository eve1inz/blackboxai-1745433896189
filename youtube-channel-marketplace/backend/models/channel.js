const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscribers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    monetizationAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mb: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analyticsScreenshots: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return Channel;
};
