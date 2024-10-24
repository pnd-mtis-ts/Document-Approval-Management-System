module.export = (options = {}) => {
    return async context => {
        const { user } = context.params; // Ambil pengguna dari context

        // Cek apakah user ada dan apakah role-nya adalah SuperAdmin
        if (!user || user.userAuth.role !== 'SuperAdmin' && user.userAuth.role !== "Aplikasi") {
            throw new Error('Hanya SuperAdmin dan Aplikasi yang bisa mengakses fitur ini!');
        }

        // Jika pengguna adalah SuperAdmin, lanjutkan ke proses berikutnya
        return context;
    };
};
