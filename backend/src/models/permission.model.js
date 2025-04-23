// models/permission.js
module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Permission.associate = (models) => {
      // Define a relação entre Permission e UserPermission
      Permission.belongsToMany(models.User, {
        through: models.UserPermission,
        foreignKey: 'permissionId',
        otherKey: 'userId',
      });
    };
  
    return Permission;
  };
  