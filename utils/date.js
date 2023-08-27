function getMonthString(monthNumber) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthNumber - 1] || '';
  }
  
  // Fungsi untuk mengonversi angka hari menjadi string
  function getDayString(dayNumber) {
    const days = [
      'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];
    return days[dayNumber] || '';
  }

  export {getDayString, getMonthString}