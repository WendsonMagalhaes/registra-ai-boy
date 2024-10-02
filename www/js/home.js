const SPREADSHEET_ID = '1vn_5JYkVxWK6i3UnhuvVpg11Eb7sdbCVWRVW5ha-hCg';
const RANGE = 'Inadimplencia!A:Z';
const API_KEY = 'AIzaSyB_rfYHUzFP0hF5dmQPUVxK88BoVF74HJo'; // Substitua 'YOUR_API_KEY' pela sua chave da API




document.getElementById("searchButton").addEventListener("click", buscarContrato);


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchButtonid').addEventListener('click', () => {

    const contractNumber = (document.getElementById('contractNumber').value);
    if (!contractNumber) {
      alert('Por favor, insira o número do contrato.');
      return;
    } else if (contractNumber.length <= 6) {
      const contratoBuscar = contractNumber.padStart(6, '0');
      console.log(contratoBuscar);
      showLoadingSpinner();
      searchValue(SPREADSHEET_ID, RANGE, contratoBuscar, displayResult);
      // Aguarda 3 segundos antes de recarregar a página
      setTimeout(function () {
        hideLoadingSpinner()

      }, 1500); // 3000 milissegundos = 3 segundos
    } else if (contractNumber.length > 6) {
      const cpfBuscar = contractNumber.padStart(11, '0');
      console.log(cpfBuscar);
      showLoadingSpinner();
      searchValueCPF(SPREADSHEET_ID, RANGE, cpfBuscar, displayResult);
      // Aguarda 3 segundos antes de recarregar a página
      setTimeout(function () {
        hideLoadingSpinner()

      }, 1500); // 3000 milissegundos = 3 segundos


    }

  })
});

function searchValue(spreadsheetId, range, targetValue, callback) {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
    }).then((response) => {
      const result = response.result;
      const values = result.values;

      if (values && values.length > 0) {
        // Implementação da busca binária
        let low = 0;
        let high = values.length - 1;
        let targetRowIndex = -1;

        while (low <= high) {
          let mid = Math.floor((low + high) / 2);
          let row = values[mid][0]; // Assumindo que a primeira coluna contém os valores ordenados

          if (row === targetValue) {
            targetRowIndex = mid;
            break;
          } else if (row < targetValue) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        if (targetRowIndex !== -1) {
          // Valor encontrado, chama o callback com o valor
          const targetRow = values[targetRowIndex];
          if (callback) callback(targetRow);
        } else {
          // Valor não encontrado
          console.log(`Contrato '${targetValue}' não encontrado.`);
          hideLoadingSpinner()
          Swal.fire({
            title: `Contrato '${targetValue}' não encontrado.`,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#073261', // Cor do botão de confirmação
            confirmButtonText: 'Ok',
            confirmButtonTextColor: "#fff",
            customClass: {
              title: 'sweetalert-font', // Classe CSS para o título
              htmlContainer: 'sweetalert-font', // Classe CSS para o texto
              confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
              container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
            }
          });
          // Aguarda 3 segundos antes de recarregar a página
          setTimeout(function () {
          }, 1500); // 3000 milissegundos = 3 segundos

        }
      } else {
        // Nenhum valor na planilha
        console.log('Nenhum valor na planilha.');
        alert('Nenhum valor na planilha.');

      }
    }, (err) => {
      console.error('Error: ', err.result.error.message);
      alert('Error: ', err.result.error.message);

    });
  });
}

function searchValueCPF(spreadsheetId, range, targetValue, callback) {
  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
    }).then((response) => {
      const result = response.result;
      const values = result.values;

      if (values && values.length > 0) {
        // Implementação da busca linear
        let targetRowIndex = -1;
        for (let i = 0; i < values.length; i++) {
          if (values[i][5] === targetValue) { // Assumindo que a primeira coluna contém os valores a serem buscados
            targetRowIndex = i;
            break;
          }
        }

        if (targetRowIndex !== -1) {
          // Valor encontrado, chama o callback com o valor
          const targetRow = values[targetRowIndex];
          if (callback) callback(targetRow);
        } else {
          // Valor não encontrado
          console.log(`Contrato '${targetValue}' não encontrado.`);
          hideLoadingSpinner();
          Swal.fire({
            title: `Contrato '${targetValue}' não encontrado.`,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#073261', // Cor do botão de confirmação
            confirmButtonText: 'Ok',
            confirmButtonTextColor: "#fff",
            customClass: {
              title: 'sweetalert-font', // Classe CSS para o título
              htmlContainer: 'sweetalert-font', // Classe CSS para o texto
              confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
              container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
            }
          });
          // Aguarda 3 segundos antes de recarregar a página
          setTimeout(function () {
          }, 1500); // 3000 milissegundos = 3 segundos
        }
      } else {
        // Nenhum valor na planilha
        console.log('Nenhum valor na planilha.');
        alert('Nenhum valor na planilha.');
      }
    }, (err) => {
      console.error('Error: ', err.result.error.message);
      alert('Error: ', err.result.error.message);
    });
  });
}


function updateValues(spreadsheetId, range, valueInputOption, _values, callback) {
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  values = _values;
  const body = {
    values: values,
  };


  try {
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: valueInputOption,
      resource: body,
    }).then((response) => {
      const result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
      if (callback) callback(response);
    });
  } catch (err) {
    document.getElementById('content').innerText = err.message;
    return;
  }
}
function redirectToPages(namePage) {
  if (namePage == "home") {
    window.location.href = "home";

  } else {
    window.location.href = "registrados";

  }

}

function displayResult(row) {
  document.getElementById('output-contrato').textContent = row[0];
  document.getElementById('output-cliente').textContent = row[12];
  document.getElementById('output-nome').textContent = row[4];
  document.getElementById('output-endereco').textContent = row[7];
  document.getElementById('output-bairro').textContent = row[10];
  document.getElementById('output-telefone').textContent = row[13];
  document.getElementById('output-forma-de-pagamento').textContent = row[1];
  document.getElementById('output-data-ativacao').textContent = row[11];
  document.getElementById('output-venc-antigo').textContent = row[3];
  document.getElementById('output-total-parcelas').textContent = row[2];
  document.getElementById('output-total-debito').textContent = row[6];

  var anoContrato = parseInt(calcularAno(row[11]));
  if (anoContrato >= 4) {
    anoContrato = 4;
  }
  var parcelas = parseInt(row[2]);
  if (parcelas >= 6) {
    parcelas = 6;
  }
  //var descontoAnterior = row[14];
  // if (descontoAnterior === "RECEBEU DESCONTO EM MENOS DE 6 MESES") {
  //  anoContrato = 0;
  //   parcelas = 0;
  //}
  const descontos = obterDescontos(parcelas, anoContrato);

  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';  // Limpa os cartões anteriores

  descontos.forEach(({ desconto, descricao }) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = `${desconto}`;
    card.dataset.descricao = descricao; // Alteração aqui para armazenar a descrição no dataset
    if (desconto === "Cliente resgatado em menos de 6 meses, verificar se foi ofertado algum desconto.") { // Exemplo de condição
      card.classList.add('red');
    } else {
      card.classList.add('navi-blue');
    }
    card.addEventListener('click', () => {
      console.log(descricao); // Alteração aqui para imprimir a descrição ao clicar
      card.classList.toggle('selected');
    });
    cardsContainer.appendChild(card);
  });
  hideLoadingSpinner();

}
function displayResultsMotoboy(container, data) {
  container.innerHTML = ''; // Clear previous results
  data.forEach(item => {
    const row = document.createElement('div');
    row.className = 'result-row';

    const contractDiv = document.createElement('div');
    contractDiv.className = 'result-item';
    contractDiv.innerHTML = `<span>Contrato:</span> ${item[1]}`;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'result-item result-item-name';
    nameDiv.innerHTML = `<span>Nome:</span> ${item[3]}`;

    const dateDiv = document.createElement('div');
    dateDiv.className = 'result-item';
    dateDiv.innerHTML = `<span>Data do Registro:</span> ${item[0]}`;

    row.appendChild(contractDiv);
    row.appendChild(nameDiv);
    row.appendChild(dateDiv);

    // Adicionar evento de clique a cada linha
    row.addEventListener('click', () => showPopup(item));

    container.appendChild(row);
  });
}
function showPopup(data) {
  const popup = document.getElementById('popup-dados-registro');
  const popupContent = document.getElementById('popup-content');
  var pago;
  var status_registro;

  if (data[20] === "") {
    pago = "Aguardando Pagamento"
  } else {
    pago = "Pago"
  }
  if (data[21] === "FORA DO PRAZO") {
    status_registro = "Fora do Prazo"
  } else if (data[21] === "DENTRO DO PRAZO") {
    status_registro = "Dentro do Prazo"
  } else {
    status_registro = "Planilhado"

  }




  popupContent.innerHTML = `
      <div><strong>Contrato:</strong> ${data[1]}</div>
      <div><strong>Nome:</strong> ${data[3]}</div>
      <div><strong>Endereço:</strong> ${data[4]}</div>
      <div><strong>Bairro:</strong> ${data[5]}</div>
      <div><strong>Telefone:</strong> ${data[6]}</div>
      <div><strong>Data de Ativação:</strong> ${data[8]}</div>
      <div><strong>Parcelas em Atraso:</strong> ${data[9]}</div>
      <div><strong>Total do Débito:</strong> ${data[10]}</div>
      <div><strong>Status do Pagamento:</strong> ${pago}</div>
      <div><strong>Data de Venciameto do Registro:</strong> ${data[15]}</div>
      <div><strong>Status do Registro:</strong> ${status_registro}</div>
      <div><strong>Motoboy:</strong> ${data[11]}</div>
      <div><strong>Observações: <br></strong> ${data[12].replace(/\n/g, '<br>')}</div>
  `;

  popup.style.display = 'block';
  console.log(data);
}

function closePopup() {
  const popup = document.getElementById('popup-dados-registro');
  popup.style.display = 'none';
}
function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
// Função para atualizar o input de data
function atualizarDataInput(id) {
  // Obter o elemento de input de data
  const dataInput = document.getElementById(id);
  // Criar um objeto de data para a data atual
  const dataAtual = new Date();
  // Formatar a data atual no formato YYYY-MM-DD
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Adiciona um zero à esquerda se for necessário
  const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona um zero à esquerda se for necessário
  const dataFormatada = `${ano}-${mes}-${dia}`;

  // Definir o valor do input de data como a data formatada
  dataInput.value = dataFormatada;
}
function calcularAno(data_ativacao) {
  var partes = data_ativacao.split('/');
  var dia = parseInt(partes[0], 10);
  var mes = parseInt(partes[1], 10) - 1; // Mês é zero-based
  var ano = parseInt(partes[2], 10);
  var dataAtivacao = new Date(ano, mes, dia);

  var dataAtual = new Date();
  var ano_de_contrato = dataAtual.getFullYear() - dataAtivacao.getFullYear();
  var mesAtual = dataAtual.getMonth();
  var diaAtual = dataAtual.getDate();

  // Ajustar a idade se o aniversário ainda não aconteceu no ano atual
  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
    ano_de_contrato--;
  }
  return ano_de_contrato;
}

async function enviarDados() {
  showLoadingSpinner();
  const selectedCards = document.querySelectorAll('.card.selected');
  let selectedDescriptions = '';
  let i = 1;
  selectedCards.forEach(card => {
    selectedDescriptions += ` ${i}. Proposta: ` + card.dataset.descricao + '\n';
    i++;
  });
  console.log(selectedDescriptions);

  var dados = {
    values:
      [
        getCurrentDate(),
        document.getElementById('output-contrato').textContent.trim(),
        document.getElementById('output-cliente').textContent.trim(),
        document.getElementById('output-nome').textContent.trim(),
        document.getElementById('output-endereco').textContent.trim(),
        document.getElementById('output-bairro').textContent.trim(),
        document.getElementById('output-telefone').textContent.trim(),
        document.getElementById('output-forma-de-pagamento').textContent.trim(),
        document.getElementById('output-data-ativacao').textContent.trim(),
        document.getElementById('output-total-parcelas').textContent.trim(),
        document.getElementById('output-total-debito').textContent.trim(),
        document.getElementById('output-username').textContent.trim(),
        "Cobrança realizada pelo Motoboy " + document.getElementById('output-username').textContent.trim() +
        '\n' + "Status do Cliente: Comprometeu-se a ir à loja ou entrar em contato com a Central." + '\n' + "Negociação:" + '\n' + selectedDescriptions
        + '\n' + "Observação:  Considerar apenas uma proposta de negociação." + '\n' + '\n' + document.getElementById('output-username').textContent.trim() + " - " + getCurrentDate(),
        "P"
      ]

  };
  try {
    console.log('Enviando solicitação para adicionar nova linha:', JSON.stringify(dados));

    const response = await fetch('/addRow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      throw new Error('Erro ao adicionar nova linha: ' + response.statusText);
    }
    const data = await response.json();
    console.log('Nova linha adicionada:', data);
    // Exibe a mensagem personalizada
    hideLoadingSpinner()
    Swal.fire({
      title: `Negociação Salva com Sucesso`,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#073261', // Cor do botão de confirmação
      confirmButtonText: 'Ok',
      confirmButtonTextColor: "#fff",
      customClass: {
        title: 'sweetalert-font', // Classe CSS para o título
        htmlContainer: 'sweetalert-font', // Classe CSS para o texto
        confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
        container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
      }
    });

    // Aguarda 3 segundos antes de recarregar a página
    setTimeout(function () {
      window.location.reload();
    }, 1500); // 3000 milissegundos = 3 segundos


    return data;


  } catch (error) {
    console.error('Erro ao adicionar nova linha:', error.message);
    throw error;
  }

}
// Função para mostrar o spinner de carregamento
function showLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'block';
}

// Função para ocultar o spinner de carregamento
function hideLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'none';
}
// Exibe a caixa de mensagem personalizada
function showCustomMessage(id) {
  document.getElementById(id).style.display = 'block';
}
function hideCustomMessage(id) {
  document.getElementById(id).style.display = 'none';
}


/** Fecha a caixa de mensagem personalizada
document.getElementById('close-button').addEventListener('click', function() {
  document.getElementById('custom-message').style.display = 'none';
});*/


function obterDescontos(parcelas, ano) {

  if (propostasDescontos[parcelas] && propostasDescontos[parcelas][ano]) {
    return propostasDescontos[parcelas][ano];
  }
  return [];
}
const propostasDescontos = {
  0: {
    0: [
      { desconto: "Cliente resgatado em menos de 6 meses, verificar se foi ofertado algum desconto.", descricao: 'Cobrança efetuada, sem desconto. Cliente resgatado em menos de 6 meses.' }
    ]
  },

  2: {
    0: [
      { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
      { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
      { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    1: [{ desconto: "Parcelamento em 2 Vezes", descricao: 'Ofertado parcelamento em 2 vezes' },
    { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    2: [{ desconto: "Parcelamento em 2 Vezes", descricao: 'Ofertado parcelamento em 2 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    3: [{ desconto: "Parcelamento em 4 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "15% de Desconto", descricao: 'Ofertado desconto de 15%' },
    { desconto: "5% de Desconto com Parcelamento em 2 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 2 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    4: [{ desconto: "Parcelamento em 4 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "20% de Desconto", descricao: 'Ofertado desconto de 20%' },
    { desconto: "5% de Desconto com Parcelamento em 2 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 2 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ]
  },
  3: {
    0: [
      { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
      { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
      { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
      { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    1: [{ desconto: "Parcelamento em 3 Vezes", descricao: 'Ofertado parcelamento em 3 vezes' },
    { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    2: [{ desconto: "Parcelamento em 3 Vezes", descricao: 'Ofertado parcelamento em 3 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "15% de Desconto", descricao: 'Ofertado desconto de 15%' },
    { desconto: "5% de Desconto com Parcelamento em 2 Vezes", descricao: 'Ofertado desconto de 5% mais parcelameno em 2 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    3: [{ desconto: "Parcelamento em 6 Vezes", descricao: 'Ofertado parcelamento em 6 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "20% de Desconto", descricao: 'Ofertado desconto de 20%' },
    { desconto: "5% de Desconto com Parcelamento em 3 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 3 vezes' },
    { desconto: "Isenção de 1 parcela", descricao: 'Ofertado isenção de 1 parcela' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    4: [{ desconto: "Parcelamento em 6 Vezes", descricao: 'Ofertado parcelamento em 6 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "25% de Desconto", descricao: 'Ofertado desconto de 25%' },
    { desconto: "5% de Desconto com Parcelamento em 3 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 3 vezes' },
    { desconto: "Isenção de 1 parcela", descricao: 'Ofertado isenção de 1 parcela' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ]
  },
  4: {
    0: [
      { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
      { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
      { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
      { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    1: [{ desconto: "Parcelamento em 4 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    2: [{ desconto: "Parcelamento em 4 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "20% de Desconto", descricao: 'Ofertado desconto de 20%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelameno em 4 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    3: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "25% de Desconto", descricao: 'Ofertado desconto de 25%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 2 parcelas", descricao: 'Ofertado isenção de 2 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    4: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "30% de Desconto", descricao: 'Ofertado desconto de 30%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 3 parcelas", descricao: 'Ofertado isenção de 3 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ]
  },
  5: {
    0: [
      { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
      { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
      { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
      { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    1: [{ desconto: "Parcelamento em 5 Vezes", descricao: 'Ofertado parcelamento em 5 vezes' },
    { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    2: [{ desconto: "Parcelamento em 5 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "20% de Desconto", descricao: 'Ofertado desconto de 20%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelameno em 4 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    3: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "25% de Desconto", descricao: 'Ofertado desconto de 25%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 2 parcelas", descricao: 'Ofertado isenção de 2 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    4: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "30% de Desconto", descricao: 'Ofertado desconto de 30%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 3 parcelas", descricao: 'Ofertado isenção de 3 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ]
  },
  6: {
    0: [
      { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
      { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
      { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
      { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    1: [{ desconto: "Parcelamento na Nº de Parcelas em Aberto", descricao: 'Ofertado parcelamento no número de parcelas em aberto' },
    { desconto: "5% de Desconto", descricao: 'Ofertado desconto de 5%' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    2: [{ desconto: "Parcelamento em 5 Vezes", descricao: 'Ofertado parcelamento em 4 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "20% de Desconto", descricao: 'Ofertado desconto de 20%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelameno em 4 vezes' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    3: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "25% de Desconto", descricao: 'Ofertado desconto de 25%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 2 parcelas", descricao: 'Ofertado isenção de 2 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ],
    4: [{ desconto: "Parcelamento em 8 Vezes", descricao: 'Ofertado parcelamento em 8 vezes' },
    { desconto: "10% de Desconto", descricao: 'Ofertado desconto de 10%' },
    { desconto: "30% de Desconto", descricao: 'Ofertado desconto de 30%' },
    { desconto: "5% de Desconto com Parcelamento em 4 Vezes", descricao: 'Ofertado desconto de 5% mais parcelamento em 4 vezes' },
    { desconto: "Isenção de 3 parcelas", descricao: 'Ofertado isenção de 3 parcelas' },
    { desconto: "Sem Desconto", descricao: 'Cobrança efetuada sem negociação' },
    { desconto: "Desconto não Ofertado", descricao: 'Cobrança efetuada, porém não foi feita nenhuma negociação' },
    ]
  }
  // Adicione mais anos conforme necessário
};

function searchValueMotoBoy(spreadsheetId, range, date, callback) {
  const login = document.getElementById('output-username').textContent.trim();
  const motoboy = login.charAt(0).toUpperCase() + login.slice(1).toLowerCase();

  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
    }).then((response) => {
      const result = response.result;
      const values = result.values;

      if (values && values.length > 0) {
        let targetRows = values.filter(row => row[11] === motoboy); // Filtra pelo motoboy

        if (date) {
          // Filtra pela data, se fornecida
          targetRows = targetRows.filter(row => row[0] === date);
        }

        if (targetRows.length > 0) {
          // Registros encontrados, chama o callback com os valores
          if (callback) callback(targetRows);
        } else {
          // Nenhum registro encontrado
          console.log(`Nenhum registro realizado na data '${date}' `);
          hideLoadingSpinner()
          Swal.fire({
            title: `Nenhum registro realizado na data '${date}'`,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#073261', // Cor do botão de confirmação
            confirmButtonText: 'Ok',
            confirmButtonTextColor: "#fff",
            customClass: {
              title: 'sweetalert-font', // Classe CSS para o título
              htmlContainer: 'sweetalert-font', // Classe CSS para o texto
              confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
              container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
            }
          });
          // Aguarda 3 segundos antes de recarregar a página
          setTimeout(function () {
          }, 1500); // 3000 milissegundos = 3 segundos

        }
      } else {
        // Nenhuma linha na planilha
        console.log('Nenhuma linha na planilha.');
        alert('Nenhuma linha na planilha.');
      }
    }).catch((err) => {
      console.error('Erro: ', err.result.error.message);
      alert('Erro: ', err.result.error.message);
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const searchButtonRegistrados = document.getElementById('searchButtonRegistrado');

  if (searchButtonRegistrados) {
    searchButtonRegistrados.addEventListener('click', () => {
      const spreadsheetId = '1qANHDNI6jSHg5JX1hWzLKqW5I2Hohe792ZNOjhcDOQM';
      const range = 'A1:Z'; // Substitua pelo intervalo de células onde deseja pesquisar
      const contractNumberElement = document.getElementById('contractNumberRegistrados');

      if (!contractNumberElement) {
        console.error('Element with ID "contractNumberRegistrados" not found.');
        return;
      }

      const contractNumber = (contractNumberElement.value).padStart(6, '0');

      if (!contractNumber) {
        alert('Por favor, insira o número do contrato.');
        return;
      }

      showLoadingSpinner();
      searchValueMotoBoyContrato(spreadsheetId, range, contractNumber, (result) => {
        console.log('Registros encontrados:', result);
        const resultContainer = document.getElementById('result-registrados');
        displayResultsMotoboy(resultContainer, result);
        hideLoadingSpinner();
      });
    });
  } else {
    console.error('Element with ID "searchButtonRegistrado" not found.');
  }
});




function searchValueMotoBoyContrato(spreadsheetId, range, contrato, callback) {
  const login = document.getElementById('output-username').textContent.trim();
  const motoboy = login.charAt(0).toUpperCase() + login.slice(1).toLowerCase();

  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
    }).then((response) => {
      const result = response.result;
      const values = result.values;

      if (values && values.length > 0) {
        let targetRows = values.filter(row => row[11] === motoboy); // Filtra pelo motoboy

        if (contrato) {
          // Filtra pela data, se fornecida
          targetRows = targetRows.filter(row => row[1] === contrato);
        }

        if (targetRows.length > 0) {
          // Registros encontrados, chama o callback com os valores
          if (callback) callback(targetRows);
        } else {
          // Nenhum registro encontrado
          console.log(`Nenhum registro encontrado sobre o '${contrato}'`);
          hideLoadingSpinner()
          Swal.fire({
            title: `Nenhum registro encontrado sobre o '${contrato}'`,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#073261', // Cor do botão de confirmação
            confirmButtonText: 'Ok',
            confirmButtonTextColor: "#fff",
            customClass: {
              title: 'sweetalert-font', // Classe CSS para o título
              htmlContainer: 'sweetalert-font', // Classe CSS para o texto
              confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
              container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
            }
          });
          // Aguarda 3 segundos antes de recarregar a página
          setTimeout(function () {
          }, 1500); // 3000 milissegundos = 3 segundos
        }
      } else {
        // Nenhuma linha na planilha
        console.log('Nenhuma linha na planilha.');
        alert('Nenhuma linha na planilha.');
      }
    }).catch((err) => {
      console.error('Erro: ', err.result.error.message);
      alert('Erro: ', err.result.error.message);
    });
  });
}

function searchValueDataPainel(spreadsheetId, range, date, callback) {

  gapi.load('client', () => {
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(() => {
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });
    }).then((response) => {
      const result = response.result;
      const values = result.values;

      if (values && values.length > 0) {
        let targetRows = values.filter(row => row[0] === date && row[13] === "P"); // Filtra pelo motoboy

        if (targetRows.length > 0) {
          // Registros encontrados, chama o callback com os valores
          if (callback) callback(targetRows);
        } else {
          // Nenhum registro encontrado
          console.log(`Nenhum registro para o motoboy '${date}' e data '${date}' foi encontrado.`);
          hideLoadingSpinner()
          Swal.fire({
            title: `Nenhum registro encontrado na '${date}' .`,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#073261', // Cor do botão de confirmação
            confirmButtonText: 'Ok',
            confirmButtonTextColor: "#fff",
            customClass: {
              title: 'sweetalert-font', // Classe CSS para o título
              htmlContainer: 'sweetalert-font', // Classe CSS para o texto
              confirmButton: 'btn-arredondado', // Classe CSS para o botão de confirmação
              container: 'sweetalert-container' // Classe CSS para a janela do SweetAlert
            }
          });
          // Aguarda 3 segundos antes de recarregar a página
          setTimeout(function () {
          }, 1500); // 3000 milissegundos = 3 segundos

        }
      } else {
        // Nenhuma linha na planilha
        console.log('Nenhuma linha na planilha.');
        alert('Nenhuma linha na planilha.');
      }
    }).catch((err) => {
      console.error('Erro: ', err.result.error.message);
      alert('Erro: ', err.result.error.message);
    });
  });
}

function displayResultsDataPainel(container, data) {
  container.innerHTML = ''; // Clear previous results
  var index = 0;
  data.forEach(item => {
    ++index;
    const row = document.createElement('div');
    console.log(index);
    console.log(item[13])
    row.className = 'result-row-painel';

    // Create the icon element with a dynamic ID
    const iconContratoDiv = document.createElement('div');
    iconContratoDiv.className = 'result-item result-contrato-icon';
    const iconContratoId = `icone-contrato-${index}`;
    const outputContratoId = `output-registro-contrato-${index}`;
    iconContratoDiv.innerHTML = `<i id="${iconContratoId}" class="fa fa-copy" onclick="copyText('${outputContratoId}', '${iconContratoId}')"></i>`;

    const contractDiv = document.createElement('div');
    contractDiv.className = 'result-item';
    contractDiv.innerHTML = `<span>Contrato: </span><span id="${outputContratoId}">${item[1]}</span> `;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'result-item result-item-name';
    nameDiv.innerHTML = `<span>Nome:</span> ${item[3]}`;

    const dateDiv = document.createElement('div');
    dateDiv.className = 'result-item result-data';
    dateDiv.innerHTML = `<span>Data do Registro:</span> ${item[0]}`;

    // Create the icon element with a dynamic ID
    const iconDiv = document.createElement('div');
    iconDiv.className = 'result-item result-icon';
    const iconId = `icone-${index}`;
    const outputId = `output-registro-${index}`;
    iconDiv.innerHTML = `<i id="${iconId}" class="fa fa-copy" onclick="copyText('${outputId}', '${iconId}')"></i>`;

    // Create the icon element with a dynamic ID
    const texObsDiv = document.createElement('div');
    texObsDiv.className = 'result-item result-item-obsercacao';
    texObsDiv.innerHTML = `<span>Observação:</span><br><p id = ${outputId} >${item[12].replace(/\n/g, '<br>')}</p> `;

    // Create the icon element with a dynamic ID
    const statusRegistroDiv = document.createElement('div');
    statusRegistroDiv.className = 'result-item result-item-status';
    statusRegistroDiv.innerHTML = `<span>Resgistro:</span><br><p id = ${outputId} >${item[13].replace(/\n/g, '<br>')}</p> `;



    row.appendChild(contractDiv);
    row.appendChild(iconContratoDiv);

    row.appendChild(nameDiv);
    row.appendChild(texObsDiv);
    row.appendChild(dateDiv);
    row.appendChild(iconDiv);




    container.appendChild(row);
  });
}
function copyText(idText, idIcone) {
  // Cria um elemento de input temporário
  // Cria um range de seleção
  var range = document.createRange();
  // Seleciona o conteúdo da div
  range.selectNode(document.getElementById(idText));
  // Remove qualquer seleção prévia
  window.getSelection().removeAllRanges();
  // Adiciona o range de seleção atual
  window.getSelection().addRange(range);
  // Executa o comando de cópia
  document.execCommand('copy');
  // Remove a seleção
  window.getSelection().removeAllRanges();
  // Muda o ícone
  var icon = document.getElementById(idIcone);
  icon.classList.remove('fa-copy');
  icon.classList.add('fa-check');




}
// Função para formatar a data no formato dd/MM/yyyy
function formatarData(data) {
  if (!data) return ''; // Verifica se a data existe

  // Converte o valor para string se for numérico
  const dataCompacta = data.toString();

  // Verifica se a data tem 8 dígitos (formato YYYYMMDD)
  if (dataCompacta.length !== 8) return '';

  // Extrai o ano, mês e dia da string no formato YYYYMMDD
  const ano = dataCompacta.substring(0, 4);
  const mes = dataCompacta.substring(4, 6);
  const dia = dataCompacta.substring(6, 8);

  return `${dia}/${mes}/${ano}`;
}
// Formata o valor TOTAL_DEBITO no formato 00,00
function formatarValor(valor) {
  return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
function buscarContrato() {
  console.time('Tempo de execução buscarContrato');

  // Obtenha o número do apontamento do input
  var numero_contrato = String(document.getElementById('contractNumber').value).padStart(6, '0');


  // Envie uma requisição para o servidor para buscar os dados do apontamento
  // Você pode usar a função fetch ou outras bibliotecas como axios para isso

  fetch('/buscar-contrato?numero=' + numero_contrato)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log(data.contrato_01);
      console.log(data.contrato_02);
      displayResultNew(data.contrato_01, data.contrato_02);
      console.timeEnd('Tempo de execução buscarContrato'); // Marca o fim do tempo após processar os dados

    })
    .catch(error => {
      console.error('Erro ao buscar apontamento:', error);
      console.timeEnd('Tempo de execução buscarContrato'); // Marca o fim do tempo após processar os dados

    });
}

function displayResultNew(data_01, data_02) {
  const data_ativacao = data_02.DT_ATIVACAO
    ? formatarData(data_02.DT_ATIVACAO)
    : 'Data inválida';

  const venc_mais_antigo = data_01.PARCELA_MAIS_ATRASADA
    ? formatarData(data_01.PARCELA_MAIS_ATRASADA)
    : 'Data inválida';
  // Verifica e formata o valor do TOTAL_DEBITO
  const total_debito = data_01.TOTAL_DEBITO
    ? formatarValor(data_01.TOTAL_DEBITO)
    : '0,00';
  document.getElementById('output-contrato').textContent = data_01.CONTRATO;
  document.getElementById('output-cliente').textContent = "000000";
  document.getElementById('output-nome').textContent = data_01.NOME;
  document.getElementById('output-endereco').textContent = data_01.ENDERECO;
  document.getElementById('output-bairro').textContent = data_01.BAIRRO;
  document.getElementById('output-telefone').textContent = data_01.FONE1;
  document.getElementById('output-forma-de-pagamento').textContent = data_01.FORPG;
  document.getElementById('output-data-ativacao').textContent = data_ativacao;
  document.getElementById('output-venc-antigo').textContent = venc_mais_antigo;
  document.getElementById('output-total-parcelas').textContent = data_01.PARCELAS_ATRASADAS;
  document.getElementById('output-total-debito').textContent = total_debito;

  var anoContrato = parseInt(calcularAno(data_ativacao));
  if (anoContrato >= 4) {
    anoContrato = 4;
  }
  console.log(parseInt(calcularAno(data_ativacao)));
  var parcelas = parseInt(data_01.PARCELAS_ATRASADAS);
  if (parcelas >= 6) {
    parcelas = 6;
  }

  const descontos = obterDescontos(parcelas, anoContrato);

  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';  // Limpa os cartões anteriores

  descontos.forEach(({ desconto, descricao }) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = `${desconto}`;
    card.dataset.descricao = descricao; // Alteração aqui para armazenar a descrição no dataset
    if (desconto === "Cliente resgatado em menos de 6 meses, verificar se foi ofertado algum desconto.") { // Exemplo de condição
      card.classList.add('red');
    } else {
      card.classList.add('navi-blue');
    }
    card.addEventListener('click', () => {
      console.log(descricao); // Alteração aqui para imprimir a descrição ao clicar
      card.classList.toggle('selected');
    });
    cardsContainer.appendChild(card);
  });
  hideLoadingSpinner();
}
