function formatTimestampToWIB(timestamp) {
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta", // Atur zona waktu ke Waktu Indonesia Barat (WIB)
    };
  
    return new Intl.DateTimeFormat("id-ID", options).format(new Date(timestamp));
  }
export default formatTimestampToWIB