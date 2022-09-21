const {Client} = require('pg');

const readPG = async ({
  username
}) => {
  console.log('INICIO POSTGRES');
  const client = new Client({
    host: 'kesavan.db.elephantsql.com',
    user: 'velltdrp',
    port: 5432,
    password: 'X37URSS9XhsoVI3Y1BR2uue0SKEpXIzC',
    database: 'velltdrp',
  });

  client.connect();
  console.log('CONNECTED POSTGRES');

  client.query(
    `SELECT * from movements WHERE username = '${username}'
    ;`,
    (err, res) => {
      if (!err) {
        while(!res.rows);
        console.log('OK');
        console.log(res.rows);
        return res.rows;
      } else {
        console.log('NOT OK');
        console.log(err.message);
      }
      client.end;
      console.log('QUERY END');
    }
  );
};

const insertPG = ({
  idoperacion,
  time,
  username,
  groupname,
  companyname,
  adminname,
  fondoname,
  tipooperacion,
  importe,
  fechaoperacion
}) => {
  console.log('INICIO POSTGRES');
  const client = new Client({
    host: 'kesavan.db.elephantsql.com',
    user: 'velltdrp',
    port: 5432,
    password: 'X37URSS9XhsoVI3Y1BR2uue0SKEpXIzC',
    database: 'velltdrp',
  });

  client.connect();
  console.log('CONNECTED POSTGRES');

  client.query(
    `INSERT INTO movements (idoperacion, time,username,groupname,companyname,adminname,fondoname,tipooperacion,importe,fechaoperacion) VALUES
        (
            '${idoperacion}',
            '${time.toString().substring(0, 23)}+00:00',
            '${username}',
            '${groupname}',
            '${companyname}',	
            '${adminname}',
            '${fondoname}',
            '${tipooperacion}',
            ${importe},
            '${fechaoperacion}'
        );`,
    (err, res) => {
      if (!err) {
        console.log('OK');
        console.log(res.rows);
      } else {
        console.log('NOT OK');
        console.log(err.message);
      }
      client.end;
      console.log('QUERY END');
    }
  );
  console.log('POST END');
};

const getPostgres = {
  insert: insertPG,
  read: readPG,
}

module.exports.getPostgres = getPostgres;