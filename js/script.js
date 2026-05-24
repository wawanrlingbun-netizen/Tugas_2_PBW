document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // LOGIN
    // ==========================================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (typeof dataPengguna === "undefined") {
                Swal.fire({
                    title: "Error",
                    text: "Data pengguna belum dimuat.",
                    icon: "error"
                });
                return;
            }

            const user = dataPengguna.find(function (item) {
                return item.email === email && item.password === password;
            });

            if (user) {
                localStorage.setItem("namaUser", user.nama);
                localStorage.setItem("roleUser", user.role);
                localStorage.setItem("lokasiUser", user.lokasi);

                Swal.fire({
                    title: "Login Berhasil!",
                    text: "Selamat datang, " + user.nama + "!",
                    icon: "success",
                    confirmButtonColor: "#0ab5ff",
                    confirmButtonText: "Lanjutkan"
                }).then(function () {
                    window.location.href = "dashboard.html";
                });
            } else {
                Swal.fire({
                    title: "Login Gagal!",
                    text: "Email atau password salah. Silakan coba lagi.",
                    icon: "error",
                    confirmButtonColor: "#1e3a8a",
                    confirmButtonText: "OK"
                });
            }
        });
    }

    // ==========================================
    // LUPA PASSWORD DAN BUAT AKUN
    // ==========================================
    const forgetLink = document.getElementById("forgetLink");
    const registerLink = document.getElementById("registerLink");

    if (forgetLink) {
        forgetLink.addEventListener("click", function (e) {
            e.preventDefault();

            Swal.fire({
                title: "Lupa Password?",
                text: "Silakan hubungi admin UT untuk reset password.",
                icon: "info"
            });
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", function (e) {
            e.preventDefault();

            Swal.fire({
                title: "Buat Akun Baru",
                text: "Kunjungi laman MyUT untuk membuat akun baru.",
                icon: "question"
            });
        });
    }

    // ==========================================
    // GREETING DASHBOARD
    // ==========================================
    const greetingText = document.getElementById("greetingText");
    const greetingIcon = document.getElementById("greetingIcon");

    if (greetingText) {
        const namaUser = localStorage.getItem("namaUser") || "Admin SITTA";
        const hour = new Date().getHours();

        let greeting = "";
        let iconClass = "";

        if (hour >= 4 && hour < 11) {
            greeting = "Selamat Pagi";
            iconClass = "fa-solid fa-sun";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Selamat Siang";
            iconClass = "fa-solid fa-cloud-sun";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat Sore";
            iconClass = "fa-solid fa-cloud";
        } else {
            greeting = "Selamat Malam";
            iconClass = "fa-solid fa-moon";
        }

        greetingText.innerText = greeting + ", " + namaUser;

        if (greetingIcon) {
            greetingIcon.className = iconClass;
        }
    }

    // ==========================================
    // LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            Swal.fire({
                title: "Yakin ingin logout?",
                text: "Anda akan keluar dari sistem.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#161af9",
                cancelButtonColor: "rgb(221, 51, 125)",
                confirmButtonText: "Logout",
                cancelButtonText: "Batal"
            }).then(function (result) {
                if (result.isConfirmed) {
                    localStorage.removeItem("namaUser");
                    localStorage.removeItem("roleUser");
                    localStorage.removeItem("lokasiUser");

                    Swal.fire({
                        title: "Logout Berhasil",
                        text: "Anda telah keluar dari sistem.",
                        icon: "info",
                        confirmButtonColor: "#1e3a8a"
                    }).then(function () {
                        window.location.href = "index.html";
                    });
                }
            });
        });
    }
});