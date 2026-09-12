// Helper functions for chart calculations and data formatting

// Format date string to short label for chart X-axis (e.g., "10 Sep")
export const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

// Format number to Rupiah (abbreviated for chart)
export const formatRupiahShort = (amount) => {
  if (amount >= 1000000000) {
    return `Rp${(amount / 1000000000).toFixed(1)}M`;
  }
  if (amount >= 1000000) {
    return `Rp${(amount / 1000000).toFixed(1)}Jt`;
  }
  if (amount >= 1000) {
    return `Rp${(amount / 1000).toFixed(0)}Rb`;
  }
  return `Rp${amount}`;
};

// Format number to full Rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate daily summary from transactions array
export const calculateDailySummary = (transactions) => {
  const summary = {
    pemasukkan: 0,
    pengeluaran: 0,
    utang: 0,
  };

  transactions.forEach(tx => {
    if (tx.type === 'pemasukan') {
      if (tx.paymentStatus === 'utang') {
        summary.utang += tx.amount;
      } else {
        summary.pemasukkan += tx.amount;
      }
    } else if (tx.type === 'pengeluaran') {
      summary.pengeluaran += tx.amount;
    }
  });

  return summary;
};

// Calculate profits from summary
export const calculateProfits = (summary) => {
  const labaKotor = summary.utang + summary.pemasukkan;
  const labaBersih = summary.pemasukkan - (summary.utang + summary.pengeluaran);
  return { labaKotor, labaBersih };
};

// Prepare data for Bar Chart
export const prepareBarData = (chartData) => {
  const labels = chartData.map(d => formatDateLabel(d.date));
  const pemasukkan = chartData.map(d => d.pemasukkan);
  const pengeluaran = chartData.map(d => d.pengeluaran);

  return {
    labels,
    datasets: [
      {
        label: 'Pemasukkan',
        data: pemasukkan,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Pengeluaran',
        data: pengeluaran,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
};

// Prepare data for Line Chart
export const prepareLineData = (chartData) => {
  const labels = chartData.map(d => formatDateLabel(d.date));
  const labaKotor = chartData.map(d => d.labaKotor);
  const labaBersih = chartData.map(d => d.labaBersih);

  return {
    labels,
    datasets: [
      {
        label: 'Laba Kotor',
        data: labaKotor,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Laba Bersih',
        data: labaBersih,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
};
