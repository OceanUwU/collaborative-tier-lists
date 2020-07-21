'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubmissionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SubmissionItem.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // Or Sequelize.UUIDV1
    },
    item: DataTypes.STRING,
    submission: DataTypes.STRING,
    tier: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubmissionItem',
  });
  return SubmissionItem;
};