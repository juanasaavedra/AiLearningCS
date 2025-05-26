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

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Número de transacciones',
        data: labels.map(l => classCounts[l]),
        backgroundColor: ['#222', '#999']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Distribución de clases (fraude vs no fraude)' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
