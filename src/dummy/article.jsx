import React from "react";
const articles = [
    {
      id: 1,
      title: "Pengenalan React Hooks",
      author: "John Doe",
      date: new Date("2023-08-11"),
      thumbnail: "url_to_thumbnail_image_1.jpg",
      content: "React Hooks adalah fitur baru dalam React yang memungkinkan pengembang untuk menggunakan state dan fitur React lainnya tanpa perlu menulis class. Ini mengubah cara kita berinteraksi dengan komponen dalam React."
    },
    {
      id: 2,
      title: "Mengenal Konsep Component di React yang Katanya Tampan",
      author: "Jane Smith",
      date: new Date("2023-08-15"),
      thumbnail: "url_to_thumbnail_image_2.jpg",
      content: "Komponen adalah bagian fundamental dalam pembangunan aplikasi berbasis React. Mereka memungkinkan kita untuk memisahkan logika, tampilan, dan fungsionalitas menjadi unit yang dapat dikelola dengan mudah."
    },
    {
      id: 3,
      title: "Panduan Menggunakan State dan Props di React",
      author: "Michael Johnson",
      date: new Date("2023-08-20"),
      thumbnail: "url_to_thumbnail_image_3.jpg",
      content: "State dan props adalah dua konsep penting dalam pengembangan aplikasi React. State digunakan untuk menyimpan data yang akan berubah seiring waktu, sedangkan props digunakan untuk mengirimkan data dari komponen induk ke komponen anak."
    },
    {
      id: 4,
      title: "Optimisasi Performa Aplikasi React",
      author: "Emily Brown",
      date: new Date("2023-08-25"),
      thumbnail: "url_to_thumbnail_image_4.jpg",
      content: "Mengoptimalkan performa aplikasi React adalah langkah krusial dalam menghadirkan pengalaman pengguna yang baik. Beberapa praktik yang dapat kita terapkan meliputi lazy loading, memoization, dan code splitting."
    },
    {
      id: 5,
      title: "Mendalam ke dalam Context API",
      author: "Alex Turner",
      date: new Date("2023-08-30"),
      thumbnail: "url_to_thumbnail_image_5.jpg",
      content: "Context API adalah cara yang lebih baik untuk berbagi state antara komponen dalam aplikasi React. Dalam artikel ini, kita akan menjelajahi cara kerja Context API, implementasinya, dan kapan sebaiknya menggunakannya."
    }
  ];
  
  export default articles;
  