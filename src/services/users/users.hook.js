import { authenticate }  from ('@feathersjs/authentication').hooks;
import bcrypt from 'bcrypt';
import { protect } from ('@feathersjs/authentication-local').hooks;
import checkRole from ('../../hooks/checkRole');

 

// Fungsi untuk hash password dengan bcrypt
const hashPassword = async (context) => {
  const { password } = context.data;

  // Hanya hash jika password ada (untuk create atau update)
  if (password) {
    // Mengganti password plaintext dengan password yang di-hash
    const hashedPassword = await bcrypt.hash(password, 10);
    context.data.password = hashedPassword;
  }

  return context;
};

export default {
  before: {
     all: [authenticate('jwt')], 
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [authenticate('jwt'),hashPassword,checkRole()] ,  
    update: [ hashPassword, authenticate('jwt') ],
    patch: [ hashPassword, authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },
  after: {
    all: [ protect('password') ], // Melindungi field password agar tidak ter-expose
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}; 


