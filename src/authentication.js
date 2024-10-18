import { authenticate, AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { OAuthStrategy, oauth } from '@feathersjs/authentication-oauth';
import { setCookie, parseCookie } from 'koa-cookies';

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    console.log('Google Profile:', profile);
    const baseData = await super.getEntityData(profile);
    
    return {
      ...baseData,
      email: profile.email,
      name: profile.name,
      sub: profile.sub ,
      role: 'User',
      jabatan: 'Karyawan',
      pin: '000000'
    };
  }
//   async getRedirect(data,params){
//     const token = data.accessToken;
//     // console.log(data);

//     const getCurrentUserInfo = async (token) => {
//       try {
//           if (!token) {
//               throw new Error('Access token tidak ditemukan');
//           }
  
//           const response = await fetch(`http://localhost:3030/authentication`, {
//               method: 'POST',
//               headers: {
//                   'Authorization': `Bearer ${token}`,
//                   'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                   strategy: 'jwt',
//                   accessToken: token
//               })
//           });
  
//           if (!response.ok) {
//               throw new Error('Gagal mendapatkan informasi pengguna');
//           }
  
//           const authResult = await response.json();
//           return authResult.user;
//       } catch (error) {
//           console.error('Gagal mendapatkan informasi pengguna:', error.message);
//           return { error: error.message };
//       }
//   };

//   const user = await getCurrentUserInfo(token);

//   if (user.error) {
//     console.error('Error:', user.error);
//     return '/';  // Kembali ke login jika terjadi kesalahan
// }

// if (!user.userAuth || !user.userAuth.role) {
//     console.error('UserAuth atau role tidak ditemukan');
//     return '/login';  // Kembali ke login jika userAuth atau role tidak ditemukan
// }
//   const userRole = user.userAuth.role;
//   const email = user.email;
//   console.log(user);  
//   console.log(userRole);
//   console.log(email)

//   switch(userRole) {
//     case 'SuperAdmin':
//         window.location.href = '/dashboard/superadmin';
//         break;
//     case 'Admin':
//         window.location.href = '/dashboard/admin';
//         break;
//     case 'User':
//         window.location.href = '/user-dashboard.html';
//         break;
//     default:
//         window.location.href = '/';  // Fallback ke halaman login
// }

//   }
}

class CustomJWTStrategy extends JWTStrategy {
  // Override getPayload untuk menambahkan custom payload
  async getPayload(authResult, params) {
    // Ambil user dari authResult
    const { user } = authResult;

  return {
    ...await super.getPayload(authResult, params),
    name: user.name,    // Tambahkan name user ke payload
    email: user.email,  // Tambahkan email user ke payload
    role: user.role     // Tambahkan role user ke payload
  };
  }
}

export const authentication = (app) => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new CustomJWTStrategy());  
  authentication.register('local', new LocalStrategy());
  authentication.register('google', new GoogleStrategy());

  app.use('/authentication', authentication);
  app.use(parseCookie());
  
  const oauthConfig = app.get('authentication').oauth.google;

  app.configure(oauth({
    google: {
      key: oauthConfig.key,
      secret: oauthConfig.secret,
      scope: oauthConfig.scope
    }
  }));

  app.get('/oauth/google', async (req, res) => {
    try {
      const { user } = await app.service('authentication').create({
        strategy: 'google',
        redirect: true
      });
      res.redirect(user.redirect);
    } catch (error) {
      console.error(error);
      res.status(400).send('Authentication failed');
    }
  });
 
  // app.get('/oauth/google/callback', async (ctx) => {
  //   try {
  //     const { accessToken, user } = await ctx.app.service('authentication').create({
  //       strategy: 'google',
  //       ...ctx.query
  //     });
  
  //     // Set cookie dengan JWT token
  //     await setCookie('feathers-jwt', accessToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production', // hanya true di produksi
  //       sameSite: 'strict',
  //       maxAge: 24 * 60 * 60 * 1000, // 1 hari
  //       path: '/', // Cookie berlaku di seluruh path
  //     })(ctx);
  
  //     // Redirect ke dashboard tanpa mengekspos token di URL
  //     ctx.redirect('/dashboard');
  //   } catch (error) {
  //     console.error('Authentication error:', error);
  //     ctx.status(401).send('Authentication failed');
  //   }
  // });
  
  app.service('authentication').hooks({
    before: {
      create: [
        async context => {
          return context;
        }
      ]
    }
  });
};
