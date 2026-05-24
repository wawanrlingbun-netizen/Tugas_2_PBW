// 1. Mengambil fungsi createApp dari library Vue 3
const { createApp } = Vue;

// 2. Membuat instansiasi aplikasi Vue
createApp({
    // data() digunakan untuk mendefinisikan state/data lokal aplikasi
    data() {
        return {
            // Mengambil data riwayat umum dari objek global dataBahanAjar
            historiList: dataBahanAjar.histori,
            // Mengambil data pelacakan (tracking) dari objek global dataBahanAjar
            trackingList: dataBahanAjar.tracking
        };
    },
    // computed digunakan untuk membuat properti yang nilainya otomatis berubah
    // jika data di dalamnya (historiList/trackingList) mengalami perubahan
    computed: {
        historiGabungan() {
            // Mengubah objek trackingList menjadi array berformat standar
            const historiDO = Object.keys(this.trackingList).map(nomor => {
                // Setiap data pelacakan di-mapping ulang strukturnya
                return {
                    tanggal: this.trackingList[nomor].tanggalKirim,
                    aktivitas: "Tracking DO",
                    nomorDO: nomor,
                    pengguna: this.trackingList[nomor].nama,
                    keterangan: "Status: " + this.trackingList[nomor].status
                };
            });

            // Menggabungkan array historiList dan array historiDO yang baru dibuat
            // menggunakan spread operator (...) menjadi satu array tunggal
            return [...this.historiList, ...historiDO];
        }
    }
// 3. Menghubungkan dan merender aplikasi Vue ini ke elemen HTML dengan id="historiApp"
}).mount("#historiApp");