const {Client} = require('pg');

const getPostgres = ({
  idoperacion,
  time,
  username,
  groupname,
  companyname,
  adminname,
  fondoname,
  tipooperacion,
  importe,
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
    `INSERT INTO movements (idoperacion, time,username,groupname,companyname,adminname,fondoname,tipooperacion,importe) VALUES
        (
            '${idoperacion}',
            '${time.toString().substring(0, 23)}+00:00',
            '${username}',
            '${groupname}',
            '${companyname}',	
            '${adminname}',
            '${fondoname}',
            '${tipooperacion}',
            ${importe}
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

module.exports.getPostgres = getPostgres;