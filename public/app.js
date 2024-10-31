const apiUrl = 'http://localhost:3030/users'
const authUrl = 'http://localhost:3030/authentication'
const googleAuthUrl = 'http://localhost:3030/oauth/google'

const createUser = async (userData) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Pendaftaran gagal: ' + (await response.text()))
    return await response.json()
  } catch (error) {
    console.error('Pendaftaran gagal:', error.message)
    return { error: error.message }
  }
}

const loginUser = async (loginData) => {
  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    if (!response.ok) throw new Error('Login gagal')
    return await response.json()
  } catch (error) {
    console.error('Login gagal:', error.message)
    return { error: error.message }
  }
}

const getUserRole = (user) => {
  return user.userAuth.role
}

const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${apiUrl}?email=${email}`)
    if (!response.ok) throw new Error('Gagal mendapatkan pengguna')
    return await response.json()
  } catch (error) {
    console.error('Gagal mendapatkan pengguna:', error.message)
    return { error: error.message }
  }
}

const getCurrentUserInfo = async (accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('Access token tidak ditemukan')
    }

    const response = await fetch(`${authUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        strategy: 'jwt',
        accessToken: accessToken
      })
    })

    if (!response.ok) {
      throw new Error('Gagal mendapatkan informasi pengguna')
    }

    const authResult = await response.json()
    return authResult.user
  } catch (error) {
    console.error('Gagal mendapatkan informasi pengguna:', error.message)
    return { error: error.message }
  }
}

const adminButtons = document.getElementById('admin-buttons')
const logoutButtons = document.getElementById('logout-button')

// Fungsi untuk logout
const logoutUser = () => {
  localStorage.clear()
  const welcomeMessage = document.getElementById('welcome-message')
  if (welcomeMessage) {
    welcomeMessage.textContent = ''
  }
  alert('Anda telah logout.')
  if (adminButtons) {
    adminButtons.style.display = 'none'
  }
  if (logoutButtons) {
    logoutButtons.style.display = 'none'
  }
  window.location.href = '/'
}

// Fungsi untuk mengarahkan pengguna ke dashboard yang sesuai
const redirectToDashboard = (userRole) => {
  switch (userRole) {
    case 'SuperAdmin':
    case 'Aplikasi':
      window.location.href = '/superadmin-dashboard.html'
      break
    case 'Admin':
      window.location.href = '/admin-dashboard.html'
      break
    case 'User':
      window.location.href = '/user-dashboard.html'
      break
    default:
      console.error('Role tidak dikenal:', userRole)
      alert('Terjadi kesalahan. Silakan coba lagi.')
      window.location.href = '/'
  }
}

// Event listener untuk DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
  // Event listener untuk form pendaftaran
  const userForm = document.getElementById('user-form')
  if (userForm) {
    userForm.addEventListener('submit', async (event) => {
      event.preventDefault()
      const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
        jabatan: document.getElementById('jabatan').value,
        pin: document.getElementById('pin').value
      }

      const response = await createUser(userData)
      if (response.id) {
        alert('Pendaftaran berhasil!')
        userForm.reset()
      } else {
        alert('Pendaftaran gagal: ' + response.error)
      }
    })
  }

  const loginWithGoogle = () => {
    window.location.href = googleAuthUrl
  }
  const googleLoginButton = document.getElementById('login-google-button')
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', loginWithGoogle)
  }

  // Event listener untuk form login
  const loginForm = document.getElementById('login-form')
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault()
      const loginData = {
        strategy: 'local',
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
      }

      const response = await loginUser(loginData)
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken)
        const userResponse = await getUserByEmail(loginData.email)
        const user = userResponse.data[0]

        localStorage.setItem('userName', user.name)
        const userRole = getUserRole(user)
        localStorage.setItem('userRole', userRole)

        redirectToDashboard(userRole)

        loginForm.reset()
      } else {
        alert('Login gagal: ' + response.error)
      }
    })
  }

  // Event listener untuk tombol logout
  if (logoutButtons) {
    logoutButtons.addEventListener('click', logoutUser)
  }

  handlePageLoad()
})

// Fungsi untuk menangani muatan halaman
const handlePageLoad = async () => {
  const welcomeMessage = document.getElementById('welcome-message')
  const path = window.location.pathname

  // Ambil token dari hash URL (bagian setelah #)
  const hash = window.location.hash
  let token = null

  // Cek apakah ada access_token di hash URL
  if (hash.includes('access_token')) {
    token = hash.split('access_token=')[1].split('&')[0]

    // Gunakan token untuk mendapatkan informasi pengguna
    const userInfo = await getCurrentUserInfo(token)
    if (userInfo && !userInfo.error) {
      // Simpan nama dan role ke localStorage
      localStorage.setItem('userName', userInfo.name)
      userRole = getUserRole(userInfo)
      localStorage.setItem('userRole', userRole)

      redirectToDashboard(userRole)
      removeHashFromURL()
      // Hapus hash dari URL
    } else {
      console.error('Gagal mendapatkan informasi pengguna setelah OAuth login')
      alert('Terjadi kesalahan saat login. Silakan coba lagi.')
      window.location.href = '/'
    }
  } else if (
    path === '/superadmin-dashboard.html' ||
    path === '/admin-dashboard.html' ||
    path === '/user-dashboard.html'
  ) {
    // Ambil token dari localStorage jika sudah login
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      window.location.href = '/'
      return
    }

    // Tampilkan pesan selamat datang
    if (welcomeMessage) {
      const name = localStorage.getItem('userName')
      const role = localStorage.getItem('userRole')
      if (name && role) {
        welcomeMessage.textContent = `Selamat datang, ${name}! Role anda: ${role}.`
      } else {
        const userInfo = await getUserInfo(accessToken)
        if (userInfo && !userInfo.error) {
          localStorage.setItem('userName', userInfo.name)
          const userRole = getUserRole(userInfo)
          localStorage.setItem('userRole', userRole)
          welcomeMessage.textContent = `Selamat datang, ${userInfo.name}! Role anda: ${userInfo.role}.`
        } else {
          console.error('Gagal mendapatkan informasi pengguna')
          window.location.href = '/'
        }
      }
    }
  } else {
    if (welcomeMessage) {
      welcomeMessage.textContent = ''
    }
  }
}

// Fungsi untuk menghapus hash dari URL setelah token disimpan
const removeHashFromURL = () => {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
}

// Set fungsi ke window.onload
window.onload = handlePageLoad
