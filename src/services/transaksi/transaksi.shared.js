export const transaksiPath = 'transaksi'

export const transaksiMethods = ['find', 'get', 'create', 'patch', 'remove']

export const transaksiClient = (client) => {
  const connection = client.get('connection')

  client.use(transaksiPath, connection.service(transaksiPath), {
    methods: transaksiMethods
  })
}
