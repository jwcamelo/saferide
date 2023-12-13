let ultimaConsulta;

document.addEventListener('DOMContentLoaded', getData);
document.querySelector('#refresh-icon').addEventListener('click', getData);
document.querySelector('#delete-icon').addEventListener('click', clearData);

function getData() {
  const url = 'https://api.tago.io/data';
  const headers = {
    'Content-Type': 'application/json',
    'Device-Token': 'efa731be-38a4-4910-97e1-c8d525a40ba7'
  };
  fetch(url, {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Manipular os dados aqui
      console.log('Dados recebidos:', data.result);
      const tilesList = document.querySelector('#tilesList');
      tilesList.innerHTML = ""
      ultimaConsulta = new Date();

      document.querySelector('#ultimaConsulta').innerHTML = `Última consulta: ${formatDate(ultimaConsulta)}`;

      if (data.result.length > 0) {
        for (data of data.result) {

          const acidente = data.value
          console.log(data)
          if (acidente) {
            const localizacao = `${data.location.coordinates[1]}, ${[data.location.coordinates[0]]}`;
            const date = `${formatDate(data.time)}`


            const tileDiv = createTile(acidente, localizacao, date);

            const link = document.createElement('a');
            link.href = `https://www.google.com/maps/search/?api=1&query=${localizacao}`;
            link.target = '_blank';
            link.appendChild(tileDiv);

            tilesList.appendChild(link);
          }
        }
      } else {
        tilesList.innerHTML = 'Não existem registros de acidente.'
      }

    })
}

function clearData() {
  const url = 'https://api.tago.io/data?variables=acidente'

  const headers = {
    'Device-Token': 'efa731be-38a4-4910-97e1-c8d525a40ba7'
  };
  fetch(url, {
    method: 'DELETE',
    headers: headers
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      getData();
      return response.json();
    })
};

function formatDate(dateTimeString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateTime = new Date(dateTimeString);
  return dateTime.toLocaleString('pt-BR', options);
};

function createTile(acidente, localizacao, data) {

  const tileDiv = document.createElement('div');
  tileDiv.classList.add('tile');
  if (acidente) tileDiv.classList.add('acidente');

  const iconImg = document.createElement('img');
  iconImg.src = './img/gps.png';
  tileDiv.appendChild(iconImg);

  const dateTimeText = document.createElement('p');
  const formattedDateTime = data;
  dateTimeText.textContent = `Data e Hora: ${formattedDateTime}`;
  tileDiv.appendChild(dateTimeText);

  return tileDiv;
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
};


