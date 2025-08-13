// models/Booking.js
export default (sequelize, DataTypes) => {
  return sequelize.define('Booking', {
    bookingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: DataTypes.INTEGER,
    townId: DataTypes.INTEGER,
    packageId: DataTypes.INTEGER,
    numberOfPeople: { type: DataTypes.INTEGER, allowNull: false },
    totalPrice: DataTypes.DECIMAL(10, 2),
    status: {
      type: DataTypes.ENUM('pending','confirmed','paid','cancelled'),
      defaultValue: 'pending',
    },
  }, {
    timestamps: true,
    tableName: 'bookings',
  });
};
