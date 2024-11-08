import { authenticate, AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { OAuthStrategy, oauth } from '@feathersjs/authentication-oauth';
import { clearCookie, setCookie, parseCookie } from 'koa-cookies';

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile,entity) {
    console.log('Google Profile:', profile);
    const baseData = await super.getEntityData(profile);
    // console.log('User is:', entity );
    return {
      ...baseData,
      email: profile.email,
      name: profile.name,
      sub: profile.sub ,
      alamat: 'Jalan',
      nomor_telepon: '+62',
      role: 'User',
      pin: '000000'
    };
  }
  
  async getRedirect(data, params) {
    try {
      // Pastikan token ada
      const token = data.accessToken;
      if (!token) {
          console.error('Token tidak tersedia');
          return '/';
      }

      console.log('Data user:', data);
      // Fungsi untuk mendapatkan informasi user
      const getCurrentUserInfo = async (token) => {
          try {
              const response = await fetch('http://localhost:3030/authentication', {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      strategy: 'jwt',
                      accessToken: token
                  })
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
 
              const authResult = await response.json();
              return authResult.user;
          } catch (error) {
              console.error('Error dalam getCurrentUserInfo:', error);
              throw error; 
          }
      };

      const user = await getCurrentUserInfo(token);
      console.log(user);
      // Validasi data user
      if (!user || !user.userProfile || !user.userProfile.role) {
          console.error('Data user tidak lengkap');
          return '/';
      }
      // Redirect berdasarkan role
      const userData = {
        name: data.user.name,
        role: data.user.userProfile.role
      };
  
      // Encode data user untuk URL
      const encodedData = encodeURIComponent(JSON.stringify(userData));
      
      // Redirect berdasarkan role dengan data user
      const userRole = userData.role;
      switch(userRole) {
        case 'SuperAdmin':
          return `/superadmin-dashboard.html?data=${encodedData}`;
        case 'Admin':
          return `/admin-dashboard.html?data=${encodedData}`;
        case 'User':
          return `/user-dashboard.html?data=${encodedData}`;
        default:
          return '/';
      }
    } catch (error) {
      console.error('Error dalam getRedirect:', error);
      return '/';
    }
  }

}

class CustomJWTStrategy extends JWTStrategy {
  // Override getPayload untuk menambahkan custom payload
  async getPayload(authResult, params) {
    const { user } = authResult;

  return {
    ...await super.getPayload(authResult, params),
    name: user.name,    
    email: user.email,  
    role: user.role    
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
