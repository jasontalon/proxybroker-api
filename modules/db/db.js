const Sequelize = require("sequelize"),
  moment = require("moment"),
  sqlite3 = require("sqlite3");
module.exports = function() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false
  });

  return {
    createDbIfNotExists: async function() {
      await new Promise((res, rej) => {
        const db = new sqlite3.Database(
          "./database.sqlite",
          sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
          err => {
            if (!err) {
              db.run(`CREATE TABLE IF NOT EXISTS  "proxy" (
                "proxy"	TEXT NOT NULL,
                "details"	TEXT,
                "insertedAtUtc"	TEXT NOT NULL,
                PRIMARY KEY("proxy")
              );`);
            }

            res();
          }
        );
      });
    },
    get: async function(limit = 100) {
      return await sequelize.query("SELECT * FROM proxy", {
        type: Sequelize.QueryTypes.SELECT
      });
    },
    add: async function(proxy, details) {
      await sequelize.query(
        `INSERT INTO proxy (proxy, details, insertedAtUtc)
        VALUES (:proxy, :details, :insertedAtUtc)
        ON CONFLICT(proxy) 
        DO UPDATE SET details = :details, insertedAtUtc =:insertedAtUtc`,
        {
          replacements: {
            proxy,
            details,
            insertedAtUtc: moment.utc().toISOString()
          },
          type: Sequelize.QueryTypes.INSERT
        }
      );
    },
    delete: async function() {
      await sequelize.query("DELETE FROM proxy", {
        type: Sequelize.QueryTypes.DELETE
      });
    }
  };
};
