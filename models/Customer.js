export default (sequelize, DataTypes) => {
  return sequelize.define('Customer', {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }, // remove unique for now
    cell: DataTypes.STRING,
  }, {
    timestamps: true,
    tableName: 'customers',
  });
};
