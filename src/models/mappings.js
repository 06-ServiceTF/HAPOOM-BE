'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mappings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Posts, {
        targetKey: 'postId',
        foreignKey: 'postId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.Tags, {
        targetKey: 'tagId',
        foreignKey: 'tagId'
      });
    }
  }
  Mappings.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tagId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Mappings',
    timestamps: false,
  });
  return Mappings;
};