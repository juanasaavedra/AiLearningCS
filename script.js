let rawData = [];
let labels = [];
let classCounts = {};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnLoadCSV').addEventListener('click', loadCSV);

  // Custom file input logic para input de archivo CSV
  const fileInput = document.getElementById('csvFileInput');
  const customBtn = document.getElementById('customFileBtn');
  const fileName = document.getElementById('fileName');

  if (customBtn && fileInput && fileName) {
    customBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      fileName.textContent = fileInput.files.length ? fileInput.files[0].name : 'Ningún archivo seleccionado';
    });
  }
});

function loadCSV() {
  const input = document.getElementById('csvFileInput');

  if (!input.files.length) {
    alert('Por favor selecciona un archivo CSV');
    return;
  }

  Papa.parse(input.files[0], {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      rawData = results.data;
      showPreview(rawData);
      countClasses(rawData);
      drawChart();
    }
  });
}

function showPreview(data) {
  let html = '<h3>Vista previa de datos</h3><table border="1" cellpadding="5" cellspacing="0"><thead><tr>';
  const keys = Object.keys(data[0]);
  keys.forEach(key => html += `<th>${key}</th>`);
  html += '</tr></thead><tbody>';

  data.slice(0, 10).forEach(row => {
    html += '<tr>';
    keys.forEach(key => html += `<td>${row[key]}</td>`);
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('dataPreview').innerHTML = html;
}

function countClasses(data) {
  classCounts = {};
  data.forEach(row => {
    const cls = row['Class'] || row['class'] || row['fraude'] || row['Fraude'] || 0;
    classCounts[cls] = (classCounts[cls] || 0) + 1;
  });
  labels = Object.keys(classCounts).map(key => key.toString());
}

function drawChart() {
  const ctx = document.getElementById('classDistChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  let allLabels = ['0', '1'];
  let displayLabels = allLabels.map(l => l === '0' ? 'No Fraude' : 'Fraude');
  let dataValues = allLabels.map(l => classCounts[l] || 0);
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: displayLabels,
      datasets: [{
        label: 'Número de transacciones',
        data: dataValues,
        backgroundColor: ['#F9F871', '#F9D6F7'],
        borderColor: ['#22223A', '#22223A'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Distribución de clases (fraude vs no fraude)', color: '#F9F871', font: { size: 22, weight: 'bold' } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff', font: { size: 16 } }, grid: { color: '#444' } },
        x: { ticks: { color: '#fff', font: { size: 18, weight: 'bold' } }, grid: { color: '#444' } }
      }
    }
  });
}

function drawAmountBoxplotByClass(data) {
  const ctx = document.getElementById('amountBoxplot').getContext('2d');
  if (window.amountBoxplot) window.amountBoxplot.destroy();
  const amountsNoFraud = data.filter(row => row.IsFraud == 0).map(row => row.Amount).filter(x => typeof x === 'number' && !isNaN(x));
  const amountsFraud = data.filter(row => row.IsFraud == 1).map(row => row.Amount).filter(x => typeof x === 'number' && !isNaN(x));
  if (amountsNoFraud.length === 0 && amountsFraud.length === 0) {
    document.getElementById('amountBoxplot').insertAdjacentHTML('afterend', '<div style="color:#F9D6F7;text-align:center;font-size:1.2em;margin-top:1em;">No hay datos suficientes para mostrar el boxplot.</div>');
    return;
  }
  window.amountBoxplot = new Chart(ctx, {
    type: 'boxplot',
    data: {
      labels: ['No Fraude', 'Fraude'],
      datasets: [{
        label: 'Amount',
        data: [amountsNoFraud, amountsFraud],
        backgroundColor: ['#F9F871', '#F9D6F7'],
        borderColor: ['#22223A', '#22223A'],
        borderWidth: 2,
        outlierColor: '#F9D6F7'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Boxplot de Amount por Clase', color: '#F9D6F7', font: { size: 22, weight: 'bold' } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff', font: { size: 16 } }, grid: { color: '#444' } },
        x: { ticks: { color: '#fff', font: { size: 18, weight: 'bold' } }, grid: { color: '#444' } }
      }
    }
  });
}
