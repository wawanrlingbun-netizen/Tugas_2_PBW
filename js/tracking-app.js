const { createApp } = Vue;

createApp({
    // --- 1. MANAJEMEN DATA (STATE) ---
    data() {
        return {
            // Memuat data master pengiriman, paket, stok, dan tracking dari objek global
            pengirimanList: dataBahanAjar.pengirimanList,
            paketList: dataBahanAjar.paket,
            stokList: dataBahanAjar.stok,
            trackingList: dataBahanAjar.tracking,
            // State penampung untuk input pencarian nomor D
            inputDO: "",
            // Template objek untuk menampung input pembuatan DO bar
            newDO: {
                nomorDO: "",
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
                total: 0
            }
        };
    },
    // --- 2. LOGIKA OTOMATIS & PENCARIAN (COMPUTED) ---
    computed: {
        // Mencari detail objek paket berdasarkan kode paket yang sedang dipilih
        selectedPaket() {
            return this.paketList.find(item => item.kode === this.newDO.paket);
        },
        // Mengambil daftar item stok fisik yang ada di dalam paket terpilih
        isiPaketTerpilih() {
            if (!this.selectedPaket) return [];

            return this.selectedPaket.isi
                .map(kodeItem => this.stokList.find(stok => stok.kode === kodeItem))
                .filter(Boolean);
        },
        // Generate nomor urut DO otomatis berdasarkan tahun aktif dan jumlah data tracking
        nextNomorDO() {
            const tahun = new Date().getFullYear();
            const jumlahData = Object.keys(this.trackingList).length + 1;
            const sequence = String(jumlahData).padStart(3, "0");

            return "DO" + tahun + "-" + sequence;
        },
        // Mengambil dan memformat data pelacakan jika nomor DO yang dicari ditemukan
        hasilTracking() {
            if (!this.inputDO) return null;

            const data = this.trackingList[this.inputDO];

            if (!data) return null;

            return {
                nomorDO: this.inputDO,
                nim: data.nim,
                nama: data.nama,
                status: data.status,
                ekspedisi: data.ekspedisi,
                tanggalKirim: data.tanggalKirim,
                paket: data.paket,
                total: data.total,
                perjalanan: data.perjalanan
            };
        }
    },
    // --- 3. REAKSI DATA REAKTIF (WATCHER) ---
    watch: {
        // Jika pilihan paket berubah, otomatis perbarui total harga sesuai paket tersebut
        selectedPaket(newValue) {
            this.newDO.total = newValue ? newValue.harga : 0;
        },
        // Log perubahan pilihan kurir ekspedisi ke console
        "newDO.ekspedisi"(newValue) {
            console.log("Ekspedisi dipilih:", newValue);
        }
    },
    // --- 4. FUNGSI AKSI UTAMA (METHODS) ---
    methods: {
        // Format angka ke mata uang Rupiah
        formatRupiah(value) {
            return "Rp " + Number(value).toLocaleString("id-ID");
        },
        // Validasi input pencarian DO dan trigger alert jika data tidak ditemukan
        cariDO() {
            if (!this.inputDO) {
                Swal.fire({
                    title: "Nomor DO Kosong",
                    text: "Masukkan nomor DO terlebih dahulu.",
                    icon: "warning",
                    confirmButtonColor: "#f97316"
                });
                return;
            }

            if (!this.trackingList[this.inputDO]) {
                Swal.fire({
                    title: "Data Tidak Ditemukan",
                    text: "Nomor DO " + this.inputDO + " tidak tersedia.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a"
                });
            }
        },
        // Mengatur pewarnaan badge Tailwind berdasarkan status logistik (Selesai/Perjalanan/Proses)
        statusClass(status) {
            const statusLower = status.toLowerCase();

            if (statusLower.includes("selesai")) {
                return "bg-green-100 text-green-700 border-green-200";
            } else if (statusLower.includes("perjalanan")) {
                return "bg-blue-100 text-blue-700 border-blue-200";
            } else if (statusLower.includes("proses")) {
                return "bg-orange-100 text-orange-700 border-orange-200";
            } else {
                return "bg-gray-100 text-gray-700 border-gray-200";
            }
        },
        // Validasi form, generate data perjalanan awal, simpan ke objek tracking, dan reset form DO
        submitDO() {
            if (
                !this.newDO.nim ||
                !this.newDO.nama ||
                !this.newDO.ekspedisi ||
                !this.newDO.paket
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Data Belum Lengkap",
                    text: "NIM, nama, ekspedisi, dan paket wajib diisi.",
                    confirmButtonColor: "#f39c12"
                });
                return;
            }

            const nomor = this.nextNomorDO;

            const dataBaru = {
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                status: "Dalam Proses",
                ekspedisi: this.newDO.ekspedisi,
                tanggalKirim: this.newDO.tanggalKirim || new Date().toISOString().split("T")[0],
                paket: this.newDO.paket,
                total: this.newDO.total,
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString("id-ID"),
                        keterangan: "Data DO dibuat dan menunggu pengiriman"
                    }
                ]
            };
            // Simpan ke database/lokal state dan catat ke riwayat log globa
            this.trackingList[nomor] = dataBaru;

            dataBahanAjar.histori.push({
                tanggal: new Date().toISOString().split("T")[0],
                aktivitas: "Delivery Order dibuat",
                nomorDO: nomor,
                pengguna: this.newDO.nama,
                keterangan: "Paket " + this.newDO.paket + " dibuat dengan status Dalam Proses"
            });

            simpanDataBahanAjar();

            Swal.fire({
                icon: "success",
                title: "Data Berhasil Disimpan",
                html: `
                    <p>Nomor DO: <b>${nomor}</b></p>
                    <p>Nama: <b>${this.newDO.nama}</b></p>
                    <p>Paket: <b>${this.newDO.paket}</b></p>
                `,
                confirmButtonText: "Oke",
                confirmButtonColor: "#3085d6"
            });
            // Alihkan pandangan tracking langsung ke DO baru dan kosongkan form input
            this.inputDO = nomor;

            this.newDO = {
                nomorDO: this.nextNomorDO,
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
                total: 0
            };
        }
    },
    // --- 5. INITIALIZATION LIFECYCLE HOOK ---
    mounted() {
        // Set up nomor DO otomatis pertama dan muat sampel pencarian default saat aplikasi siap
        this.newDO.nomorDO = this.nextNomorDO;
        this.inputDO = "DO2025-0001";
    }
// Menghubungkan aplikasi ke HTML dengan id="trackingApp"
}).mount("#trackingApp");