var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "rina123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "agus123",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "siti123",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Ali Akbar",
    email: "ali@ut.ac.id",
    password: "ali123",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "admin123",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

var dataBahanAjar = {
  upbjjList: [
    "Jakarta",
    "Surabaya",
    "Makassar",
    "Padang",
    "Denpasar"
  ],

  kategoriList: [
    "MK Wajib",
    "MK Pilihan",
    "Praktikum",
    "Problem-Based"
  ],

  pengirimanList: [
    { kode: "REG", nama: "Reguler (3-5 hari)" },
    { kode: "EXP", nama: "Ekspres (1-2 hari)" }
  ],

  paket: [
    {
      kode: "PAKET-UT-001",
      nama: "PAKET IPS Dasar",
      isi: ["EKMA4116", "EKMA4115"],
      harga: 120000
    },
    {
      kode: "PAKET-UT-002",
      nama: "PAKET IPA Dasar",
      isi: ["BIOL4201", "FISIP4001"],
      harga: 140000
    }
  ],

  stok: [
    {
      kode: "EKMA4116",
      judul: "Pengantar Manajemen",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A3",
      harga: 65000,
      qty: 28,
      safety: 20,
      catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
    },
    {
      kode: "EKMA4115",
      judul: "Pengantar Akuntansi",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A4",
      harga: 60000,
      qty: 7,
      safety: 15,
      catatanHTML: "<strong>Cover baru</strong>"
    },
    {
      kode: "BIOL4201",
      judul: "Biologi Umum (Praktikum)",
      kategori: "Praktikum",
      upbjj: "Surabaya",
      lokasiRak: "R3-B2",
      harga: 80000,
      qty: 12,
      safety: 10,
      catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
    },
    {
      kode: "FISIP4001",
      judul: "Dasar-Dasar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Makassar",
      lokasiRak: "R2-C1",
      harga: 55000,
      qty: 2,
      safety: 8,
      catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
    }
  ],

  tracking: {
    "DO2025-0001": {
      nim: "123456789",
      nama: "Rina Wulandari",
      status: "Dalam Perjalanan",
      ekspedisi: "JNE",
      tanggalKirim: "2025-08-25",
      paket: "PAKET-UT-001",
      total: 120000,
      perjalanan: [
        {
          waktu: "2025-08-25 10:12:20",
          keterangan: "Penerimaan di Loket: TANGSEL"
        },
        {
          waktu: "2025-08-25 14:07:56",
          keterangan: "Tiba di Hub: JAKSEL"
        },
        {
          waktu: "2025-08-26 08:44:01",
          keterangan: "Diteruskan ke Kantor Tujuan"
        }
      ]
    }
  },

  histori: [
    {
      tanggal: "2025-08-25",
      aktivitas: "Delivery Order dibuat",
      nomorDO: "DO2025-0001",
      pengguna: "Rina Wulandari",
      keterangan: "Paket PAKET-UT-001 sedang dalam perjalanan"
    }
  ]
};

(function () {
  const dataLocal = localStorage.getItem("dataBahanAjarLocal");

  if (dataLocal) {
    try {
      const parsed = JSON.parse(dataLocal);

      if (parsed.stok) {
        dataBahanAjar.stok = parsed.stok;
      }

      if (parsed.tracking) {
        dataBahanAjar.tracking = parsed.tracking;
      }

      if (parsed.histori) {
        dataBahanAjar.histori = parsed.histori;
      }
    } catch (error) {
      console.log("Gagal membaca localStorage:", error);
    }
  }
})();

function simpanDataBahanAjar() {
  localStorage.setItem(
    "dataBahanAjarLocal",
    JSON.stringify({
      stok: dataBahanAjar.stok,
      tracking: dataBahanAjar.tracking,
      histori: dataBahanAjar.histori
    })
  );
}