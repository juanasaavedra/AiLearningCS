// Ejemplo mínimo funcional de boxplot
window.addEventListener('DOMContentLoaded', function() {
  // Prueba rápida de boxplot
  const ctxTest = document.getElementById('boxplotTest');
  if (ctxTest) {
    new Chart(ctxTest.getContext('2d'), {
      type: 'boxplot',
      data: {
        labels: ['No Fraude', 'Fraude'],
        datasets: [{
          label: 'Amount',
          data: [
            [10, 20, 30, 40, 50, 100], // No Fraude
            [100, 200, 300, 400, 500, 1000] // Fraude
          ],
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
          title: { display: true, text: 'Boxplot de Amount por Clase' }
        },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#222' }, grid: { color: '#ccc' } },
          x: { ticks: { color: '#222' }, grid: { color: '#ccc' } }
        }
      }
    });
  }

  // Lógica para cargar y graficar el boxplot real desde el CSV
  Papa.parse('src/credit_card_fraud_dataset.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      try {
        const data = results.data;
        // Asumimos que las columnas relevantes son Amount y IsFraud
        const amountsNoFraud = data.filter(row => row.IsFraud == 0).map(row => row.Amount).filter(x => typeof x === 'number' && !isNaN(x));
        const amountsFraud = data.filter(row => row.IsFraud == 1).map(row => row.Amount).filter(x => typeof x === 'number' && !isNaN(x));
        const ctx = document.getElementById('amountBoxplot');
        if (ctx) {
          new Chart(ctx.getContext('2d'), {
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
                title: { display: true, text: 'Boxplot de Amount por Clase' }
              },
              scales: {
                y: { beginAtZero: true, ticks: { color: '#222' }, grid: { color: '#ccc' } },
                x: { ticks: { color: '#222' }, grid: { color: '#ccc' } }
              }
            }
          });
        } else {
          console.warn('No se encontró el canvas #amountBoxplot');
        }
      } catch (e) {
        console.error('Error al graficar el boxplot real:', e);
      }
    },
    error: function(err) {
      console.error('Error al cargar el CSV:', err);
    }
  });
}); 