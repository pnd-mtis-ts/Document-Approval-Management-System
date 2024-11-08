export const aplikasiPath = 'aplikasi'

export const aplikasiMethods = ['find', 'get', 'create', 'patch', 'remove']

export const aplikasiClient = (client) => {
  const connection = client.get('connection')

  client.use(aplikasiPath, connection.service(aplikasiPath), {
    methods: aplikasiMethods
  })
}
