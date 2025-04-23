const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

const User = require('./user')(sequelize);
const Channel = require('./channel')(sequelize);
const Review = require('./review')(sequelize);

// Associations
User.hasMany(Channel, { foreignKey: 'sellerId', as: 'channels' });
Channel.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

User.hasMany(Review, { foreignKey: 'buyerId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Channel.hasMany(Review, { foreignKey: 'channelId', as: 'reviews' });
Review.belongsTo(Channel, { foreignKey: 'channelId', as: 'channel' });

module.exports = {
  sequelize,
  User,
  Channel,
  Review,
};
