const { Sequelize, DataTypes,Op, where, fn, col} = require('sequelize'); //npm install --save sequelize , npm install --save mysql2
const MYSQL_IP="mysql-209247-0.cloudclusters.net";
const MYSQL_LOGIN="admin";
const MYSQL_PASSWORD="Plz1LzeR";
const DATABASE = "sakila";
const sequelize = new Sequelize(DATABASE, MYSQL_LOGIN, MYSQL_PASSWORD,{host:MYSQL_IP, port:10028, dialect: "mysql"});

const Actor = sequelize.define('Actor', {
  actor_id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: {type: DataTypes.STRING(45), allowNull: false },
  last_name: {type: DataTypes.STRING(45), allowNull: false },
    last_update: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
  }, {tableName: 'actor',timestamps: false});

const Payment = sequelize.define('Payment', {
  paymentId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'payment_id' },
  customerId: {type: DataTypes.INTEGER, allowNull: false, field: 'customer_id' },
  staffId: {type: DataTypes.INTEGER, allowNull: false, field: 'staff_id' },
  rentalId: {type: DataTypes.INTEGER, allowNull: false, field: 'rental_id' },
  amount: {type: DataTypes.DECIMAL(5,2), allowNull: false },
  paymentDate: {type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), field: 'payment_date' }
}, {tableName: 'payment',timestamps: false});

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



function printSequelizeObjects(results){
    let tabularData = results.map(result => result.dataValues);
    console.table(tabularData);
}

async function filterActors(){ 
  try{
    let returnedEntries = await Actor.findAll();
    console.log("returnedEntries", returnedEntries.length);
    printSequelizeObjects(returnedEntries);
 }catch(e){
  console.error("error", e);
 }
};

async function filterByName(name){
  let returnedEntries = await Actor.findAll({
    where: {
      [Op.or]: [
        { first_name: name },
        { last_name: name }
      ]
    }
  });
  printSequelizeObjects(returnedEntries);
}

async function filterByNameContains(name){
  let returnedEntries = await Actor.findAll({
    attributes: ['first_name', 'last_name'],
    where: {
      [Op.or]: [
        { first_name: { [Op.like]: `%${name}%` } },
        { last_name: { [Op.like]: `%${name}%` } }
      ]
    }
  });
  printSequelizeObjects(returnedEntries);
}

async function filterByFullNameContains(name){
  let returnedEntries = await Actor.findAll({
    where: [Sequelize.where(
          Sequelize.fn(
            'CONCAT',
            Sequelize.col('first_name'),
            ' ',
            Sequelize.col('last_name')
          ),
          {
            [Op.like]: `%${name}%`
          }
        ),
        {last_update: {[Op.gt]: new Date('2006-02-15')}}
      ]

  });
  printSequelizeObjects(returnedEntries);
}

async function filterFormatedLastUpdatedDates(){
  let returnedEntries = await Actor.findAll({
    attributes: [
      'actor_id', 
      [Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), 'full_name'],
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('last_update'), '%d/%m/%Y'), 'last_update_date_formated']
    ]
  });
  printSequelizeObjects(returnedEntries);
}

async function filterByNameIgnoreCase(name){
   let returnedEntries = await Actor.findAll({
    where: 
       where(fn('UPPER', col('first_name')), name.toUpperCase())
   });
  printSequelizeObjects(returnedEntries);
}

async function filterPaymentsByAmount(amount){
  let returnedEntries = await Payment.findAll({
    where: {
      amount: { [Op.gte]: amount }
    }
  });
  printSequelizeObjects(returnedEntries);
}

async function filterFilmsByRating(rating){
  let returnedEntries = await Film.findAll({
    where: {
      rating: rating
    }
  });
  printSequelizeObjects(returnedEntries);
} 


async function filterNameOnly(){
  let returnedEntries = await Actor.findAll({
    attributes: ['first_name', 'last_name'],
    where: {
      last_name: { [Op.like]: 'C%' }
    },
    order: [[col('first_name'), 'ASC']]
  });
  printSequelizeObjects(returnedEntries);
}



async function filterFilmsIdByRating(rating){
  let returnedEntries = await Film.findAll({
    attributes: ['filmId'],
    where: {
      rating: rating
    }
  });
  printSequelizeObjects(returnedEntries);
} 

async function filterFilmsByLengthGreater(length){
  let returnedEntries = await Film.findAll({
    where: {
      length: { [Op.gt]: length }
    }
  });
  printSequelizeObjects(returnedEntries);
} 

async function getAverageRentalValue(){
  let returnedEntries = await Payment.findAll({
    attributes: [[Sequelize.fn('AVG', Sequelize.col('amount')), 'average_rental_value']]
  });
  printSequelizeObjects(returnedEntries);
}

async function getTotalRentalByMonthAndYear(month, year){
  let returnedEntries = await Payment.findAll({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total_rental_value']],
    where: {
      [Op.and]: [
        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('payment_date')), month),
        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('payment_date')), year)
      ]
    }
  });
  printSequelizeObjects(returnedEntries);
}

//filterActors();
//filterByName("john");
filterByNameContains("jo");

//filterByFullNameContains("JON CH");
//filterByNameIgnoreCase("john");
//filterPaymentsByAmount(4);
//filterFilmsByRating("PG");
//filterFilmsByLengthGreater(60);
//filterFilmsIdByRating("PG");

filterFormatedLastUpdatedDates();
//filterNameOnly()
//getAverageRentalValue();
 //getTotalRentalByMonthAndYear(2,2006);

