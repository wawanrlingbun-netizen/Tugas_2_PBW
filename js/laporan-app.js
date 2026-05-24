const { createApp } = Vue;

createApp({
    // --- 1. MANAJEMEN DATA (STATE) ---
    data() {
        return {
            // Mengambil data utama stok dan pelacakan DO dari objek globa
            stokList: dataBahanAjar.stok,
            trackingList: dataBahanAjar.tracking
        };
    },
    // --- 2. AKUMULASI & REKAP DATA (COMPUTED) ---
    computed: {
        // Mengubah format data tracking (objek) menjadi array agar mudah di-looping di UI
        daftarDO() {
            return Object.keys(this.trackingList).map(nomor => {
                return {
                    nomorDO: nomor,
                    ...this.trackingList[nomor]
                };
            });
        },
        // Menghitung variasi jenis/judul bahan ajar yang terdaftar
        totalBahanAjar() {
            return this.stokList.length;
        },
        // Menghitung total keseluruhan unit fisik barang yang ada di gudang
        totalStok() {
            return this.stokList.reduce((total, item) => total + item.qty, 0);
        },
        // Menghitung jumlah item yang stoknya kritis (di bawah angka safety) atau habis
        stokMenipis() {
            return this.stokList.filter(item => item.qty < item.safety || item.qty === 0).length;
        },
        // Menghitung total seluruh dokumen Delivery Order (DO) yang berjalan
        totalDO() {
            return this.daftarDO.length;
        }
    },
    // --- 3. FORMATTING & INDIKATOR VISUAL (METHODS) ---
    methods: {
        // Mengubah nominal angka biasa menjadi format mata uang Rupia
        formatRupiah(value) {
            return "Rp " + Number(value).toLocaleString("id-ID");
        },
        // Menentukan label teks status stok barang
        statusStok(item) {
            if (item.qty === 0) return "Kosong";
            if (item.qty < item.safety) return "Menipis";
            return "Aman";
        },
        // Menentukan warna badge (class Tailwind) sesuai kondisi riil stok
        statusClass(item) {
            if (item.qty === 0) return "bg-red-100 text-red-700";
            if (item.qty < item.safety) return "bg-orange-100 text-orange-700";
            return "bg-green-100 text-green-700";
        }
    }
// Menghubungkan aplikasi Vue ke elemen HTML dashboard dengan id="laporanApp"
}).mount("#laporanApp");