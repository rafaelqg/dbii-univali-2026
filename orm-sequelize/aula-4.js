const { Sequelize, DataTypes,Op, where, fn, col} = require('sequelize'); //npm install --save sequelize , npm install --save mysql2
const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="root";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD,{host:MYSQL_IP, dialect: "mysql"});

const Film = sequelize.define('Film', {
  filmId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'film_id' },
  title: {type: DataTypes.STRING(255), allowNull: false },
  description: {type: DataTypes.TEXT, allowNull: true },
  releaseYear: {type: DataTypes.INTEGER, allowNull: true, field: 'release_year' },
  languageId: {type: DataTypes.INTEGER, allowNull: false, field: 'language_id' },
  originalLanguageId: {type: DataTypes.INTEGER, allowNull: true, field: 'original_language_id' },
  rentalDuration: {type: DataTypes.INTEGER, allowNull: false, field: 'rental_duration' },
  rentalRate: {type: DataTypes.DECIMAL(4,2), allowNull: false, field: 'rental_rate' },
  length: {type: DataTypes.INTEGER, allowNull: true },
  replacementCost: {type: DataTypes.DECIMAL(5,2), allowNull: false, field: 'replacement_cost' },
  rating: {type: DataTypes.ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'), allowNull: true },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'film',timestamps: false});

const Language = sequelize.define('Language', {
  languageId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'language_id' },
  name: {type: DataTypes.STRING(20), allowNull: false },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'language',timestamps: false});

Film.belongsTo(Language, { foreignKey: 'languageId' });

const Country = sequelize.define('Country', {
  countryId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'country_id' },
  name: {type: DataTypes.STRING(50), allowNull: false, field: 'country' },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'country',timestamps: false});

const City = sequelize.define('City', {
  cityId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'city_id' },
  countryId: {type: DataTypes.INTEGER, allowNull: false, field: 'country_id' },
  name: {type: DataTypes.STRING(50), allowNull: false, field: 'city' },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'city',timestamps: false});

Country.hasMany(City, { foreignKey: 'countryId' });
City.belongsTo(Country, { foreignKey: 'countryId' });

const Payment = sequelize.define('Payment', {
  paymentId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'payment_id' },
  customerId: {type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
  staffId: {type: DataTypes.INTEGER, allowNull: false, field: 'staff_id' },
  rentalId: {type: DataTypes.INTEGER, allowNull: false, field: 'rental_id' },
  amount: {type: DataTypes.DECIMAL(5,2), allowNull: false },
  paymentDate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'payment_date' }
}, {tableName: 'payment',timestamps: false});

const Inventory = sequelize.define('Inventory', {
  inventoryId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'inventory_id' },
  filmId: {type: DataTypes.INTEGER, allowNull: false, field: 'film_id' },
  storeId: {type: DataTypes.INTEGER, allowNull: false, field: 'store_id' },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'inventory',timestamps: false});

const Rental = sequelize.define('Rental', {
  rentalId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'rental_id' },
  rentalDate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'rental_date' },
  inventoryId: {type: DataTypes.INTEGER, allowNull: false, field: 'inventory_id' },
  customerId: {type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
  returnDate: {type: DataTypes.DATE, allowNull: true, field: 'return_date' },
  staffId: {type: DataTypes.INTEGER, allowNull: false, field: 'staff_id' },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'rental',timestamps: false});

const Customer = sequelize.define('Customer', {
  customerId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'customer_id' },
  storeId: {type: DataTypes.INTEGER, allowNull: false, field: 'store_id' },
  firstName: {type: DataTypes.STRING(45), allowNull: false, field: 'first_name' },
  lastName: {type: DataTypes.STRING(45), allowNull: false, field: 'last_name' },
  email: {type: DataTypes.STRING(50), allowNull: true },
  addressId: {type: DataTypes.INTEGER, allowNull: false, field: 'address_id' },
  active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  createDate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'create_date' },
  lastUpdate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'last_update' }
}, {tableName: 'customer', timestamps: false});

Inventory.hasMany(Rental, { foreignKey: 'inventoryId' });
Rental.belongsTo(Inventory, { foreignKey: 'inventoryId' });
Payment.belongsTo(Rental, { foreignKey: 'rentalId' });
Payment.hasOne(Rental, { foreignKey: 'rentalId' });
Inventory.belongsTo(Film, { foreignKey: 'filmId' });
Rental.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Rental, { foreignKey: 'customerId' });

function printSequelizeObjects(results){
    let tabularData = results.map(result => result.dataValues || result);
    console.table(tabularData);
}


async function getCustomersWithMultiplePayments(times){
 let customers = await Payment.findAll({
    attributes: ['customerId', [fn('COUNT', col('payment_id')), 'paymentCount']],
    group: ['customerId'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('payment_id')), { [Sequelize.Op.gte]: times })
  });
  printSequelizeObjects(customers);
}

async function getCustomerFilmRentedMoreThanOnce() {
  const results = await Rental.findAll({
    attributes: [
      [Sequelize.literal('CONCAT(`Customer`.`first_name`, \' \', `Customer`.`last_name`)'), 'customerName'],
      [col('`Inventory->Film`.`title`'), 'filmName'],
      [fn('COUNT', col('Rental.rental_id')), 'rentalCount']
    ],
    include: [
      {
        model: Customer,
        attributes: []
      },
      {
        model: Inventory,
        attributes: [],
        include: [
          {
            model: Film,
            attributes: []
          }
        ]
      }
    ],
    group: ['Rental.customer_id', 'Inventory.film_id'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('Rental.rental_id')), Sequelize.Op.gt, 1),
    raw: true
  });
  printSequelizeObjects(results);
}


getCustomersWithMultiplePayments(20);  
getCustomerFilmRentedMoreThanOnce();
