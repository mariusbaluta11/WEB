'use strict';
module.exports = (sequelize, DataTypes) => {
  const SearchManager = sequelize.define('SearchManager', {
    word: DataTypes.STRING,
    category: DataTypes.TEXT,
    count: DataTypes.INTEGER
  }, {});
  SearchManager.associate = function(models) {
    // associations can be defined here
  };
  return SearchManager;
};