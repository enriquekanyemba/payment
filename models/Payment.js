export default (sequelize, DataTypes) => {
  return sequelize.define('Payment', {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingId: { type: DataTypes.INTEGER, allowNull: true },
    stripePaymentId: { type: DataTypes.STRING(255), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'zar' },
    status: { type: DataTypes.STRING(50), allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'payments',
  });
};
