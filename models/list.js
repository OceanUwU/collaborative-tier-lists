'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  List.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // Or Sequelize.UUIDV1
    },
    name: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    items: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};