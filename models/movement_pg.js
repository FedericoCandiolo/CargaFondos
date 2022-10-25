const { Client } = require('pg');

const readPG = async ({ username }) => {
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
        while (!res.rows);
        console.log('OK');
        console.log(res.rows);
        return res.rows;
      } else {
        console.log('NOT OK');
        console.log(err.message);
      }
      client.end();
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
  fechaoperacion,
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
      client.end();
      console.log('QUERY END');
    }
  );
  console.log('POST END');
};

const updatePG = ({
  idoperacion,
  adminname,
  fondoname,
  tipooperacion,
  importe,
  fechaoperacion,
}) => {

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDateYYYY_MM_DD(datestr) {
    if (!datestr) return '';
    console.log(datestr);
    let date = new Date(datestr);
    date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${padTo2Digits(
      date.getMonth() + 1
    )}-${padTo2Digits(date.getDate())}`;
  }

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

  console.log(`UPDATE movements
    SET
      adminname = '${adminname}',
      fondoname = '${fondoname}',
      tipooperacion = '${tipooperacion}',
      importe = ${importe},
      fechaoperacion = '${formatDateYYYY_MM_DD(fechaoperacion)}'
    WHERE idoperacion = '${idoperacion}'`);

  client.query(
    `UPDATE movements
    SET
      adminname = '${adminname}',
      fondoname = '${fondoname}',
      tipooperacion = '${tipooperacion}',
      importe = ${importe},
      fechaoperacion = '${formatDateYYYY_MM_DD(fechaoperacion)}'
    WHERE idoperacion = '${idoperacion}'
    ;`,
    (err, res) => {
      if (!err) {
        console.log('OK');
        console.log(res.rows);
      } else {
        console.log('NOT OK');
        console.log(err.message);
      }
      client.end();
      console.log('QUERY END');
    }
  );
  console.log('POST END');
};


const deletePG = ({
  idoperacion
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

  console.log(`DELETE FROM movements
     WHERE idoperacion = '${idoperacion}'
    ;`);

  client.query(
    `DELETE FROM movements
     WHERE idoperacion = '${idoperacion}'
    ;`,
    (err, res) => {
      if (!err) {
        console.log('OK');
        console.log(res.rows);
      } else {
        console.log('NOT OK');
        console.log(err.message);
      }
      client.end();
      console.log('QUERY END');
    }
  );
  console.log('POST END');
};

const getPostgres = {
  insert: insertPG,
  read: readPG,
  update: updatePG,
  delete: deletePG,
};

module.exports.getPostgres = getPostgres;
