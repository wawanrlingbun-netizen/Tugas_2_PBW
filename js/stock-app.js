const { createApp } = Vue;

createApp({
    // --- 1. MANAJEMEN STATE / DATA UTAMA ---
    data() {
        return {
            // Data master (diambil dari objek global dataBahanAjar)
            upbjjList: dataBahanAjar.upbjjList,
            kategoriList: dataBahanAjar.kategoriList,
            stok: dataBahanAjar.stok,

            // State untuk menampung filter dan pengurutan (sorting) aktif
            selectedUpbjj: "",
            selectedKategori: "",
            isSafety: false,
            sortBy: "",

            // Template objek untuk menampung input data baru
            newItem: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: "",
                qty: "",
                safety: "",
                catatanHTML: ""
            },

            // State untuk manajemen mode edit data
            editIndex: null,
            editItemData: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: "",
                qty: "",
                safety: "",
                catatanHTML: ""
            }
        };
    },

    // --- 2. LOGIKA REAKTIF (FILTER & SORTING DATA) ---
    computed: {
        // Menyaring daftar kategori secara dinamis berdasarkan UPBJJ yang dipilih
        kategoriListFiltered() {
            if (!this.selectedUpbjj) return [];

            const hasil = this.stok
                .filter(item => item.upbjj === this.selectedUpbjj)
                .map(item => item.kategori); // Menghilangkan duplikasi kategori

            return [...new Set(hasil)];
        },
        // Memproses filter (UPBJJ, Kategori, Stok Kritis/Safety) dan pengurutan data stok untuk ditampilkan di UI
        filteredData() {
            let data = [...this.stok];

            if (this.selectedUpbjj) {
                data = data.filter(item => item.upbjj === this.selectedUpbjj);
            }

            if (this.selectedKategori) {
                data = data.filter(item => item.kategori === this.selectedKategori);
            }

            if (this.isSafety) {
                data = data.filter(item => item.qty < item.safety || item.qty === 0);
            }
            // Eksekusi pengurutan berdasarkan judul, qty, atau harga
            if (this.sortBy === "judul") {
                data.sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortBy === "qty") {
                data.sort((a, b) => a.qty - b.qty);
            } else if (this.sortBy === "harga") {
                data.sort((a, b) => a.harga - b.harga);
            }

            return data;
        }
    },
    // --- 3. PENGAMAT PERUBAHAN DATA (WATCHER) ---
    watch: {
        // Jika pilihan UPBJJ berubah, otomatis reset pilihan kategori ke kosong
        selectedUpbjj() {
            this.selectedKategori = "";
        },
        // Melacak perubahan mode pengurutan di console log
        sortBy(newValue) {
            console.log("Sort berubah:", newValue);
        }
    },
    // --- 4. KUMPULAN FUNGSI AKSI (METHODS) ---
    methods: {
        // Mengembalikan semua kondisi filter ke pengaturan awal
        resetFilter() {
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.isSafety = false;
            this.sortBy = "";
        },
        // Menentukan teks indikator status ketersediaan barang (Kosong/Menipis/Aman)
        statusText(item) {
            if (item.qty === 0) return "Kosong";
            if (item.qty < item.safety) return "Menipis";
            return "Aman";
        },
        // Menentukan warna badge (class Tailwind) berdasarkan status ketersediaan barang
        statusClass(item) {
            if (item.qty === 0) return "bg-red-100 text-red-700";
            if (item.qty < item.safety) return "bg-orange-100 text-orange-700";
            return "bg-green-100 text-green-700";
        },
        // Helper untuk mengubah angka biasa menjadi format mata uang Rupiah
        formatRupiah(value) {
            return "Rp " + Number(value).toLocaleString("id-ID");
        },
        // Validasi input, cek duplikasi kode, lalu menambahkan item baru ke array stok
        addItem() {
            if (
                !this.newItem.kode ||
                !this.newItem.judul ||
                !this.newItem.kategori ||
                !this.newItem.upbjj ||
                !this.newItem.lokasiRak ||
                this.newItem.harga === "" ||
                this.newItem.qty === "" ||
                this.newItem.safety === ""
            ) {
                Swal.fire({
                    title: "Data Belum Lengkap",
                    text: "Semua field wajib diisi.",
                    icon: "warning",
                    confirmButtonColor: "#f97316"
                });
                return;
            }

            const kodeSudahAda = this.stok.some(item => item.kode === this.newItem.kode);

            if (kodeSudahAda) {
                Swal.fire({
                    title: "Kode Sudah Ada",
                    text: "Kode bahan ajar sudah terdaftar.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a"
                });
                return;
            }

            this.stok.push({
                kode: this.newItem.kode,
                judul: this.newItem.judul,
                kategori: this.newItem.kategori,
                upbjj: this.newItem.upbjj,
                lokasiRak: this.newItem.lokasiRak,
                harga: Number(this.newItem.harga),
                qty: Number(this.newItem.qty),
                safety: Number(this.newItem.safety),
                catatanHTML: this.newItem.catatanHTML || "-"
            });

            simpanDataBahanAjar();

            Swal.fire({
                title: "Berhasil!",
                text: "Data bahan ajar berhasil ditambahkan.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            // Reset form input data baru
            this.newItem = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: "",
                qty: "",
                safety: "",
                catatanHTML: ""
            };
        },
        // Membuka modal/form edit dan memuat data item yang dipilih berdasarkan kodenya
        openEdit(item) {
            this.editIndex = this.stok.findIndex(data => data.kode === item.kode);

            this.editItemData = {
                kode: item.kode,
                judul: item.judul,
                kategori: item.kategori,
                upbjj: item.upbjj,
                lokasiRak: item.lokasiRak,
                harga: item.harga,
                qty: item.qty,
                safety: item.safety,
                catatanHTML: item.catatanHTML
            };
        },
        // Menyimpan data yang diubah kembali ke array stok berdasarkan indeksny
        saveEdit() {
            if (this.editIndex === null) return;

            this.stok[this.editIndex] = {
                kode: this.editItemData.kode,
                judul: this.editItemData.judul,
                kategori: this.editItemData.kategori,
                upbjj: this.editItemData.upbjj,
                lokasiRak: this.editItemData.lokasiRak,
                harga: Number(this.editItemData.harga),
                qty: Number(this.editItemData.qty),
                safety: Number(this.editItemData.safety),
                catatanHTML: this.editItemData.catatanHTML || "-"
            };

            simpanDataBahanAjar(); // Menyimpan perubahan ke penyimpanan lokal/database

            this.editIndex = null;

            Swal.fire({
                title: "Berhasil!",
                text: "Data bahan ajar berhasil diperbarui.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        },
        // Membatalkan mode edit data
        cancelEdit() {
            this.editIndex = null;
        }
    }
// Menghubungkan aplikasi Vue ke elemen HTML dengan id="stockApp"
}).mount("#stockApp");