export const jabatanPath = 'jabatan'

export const jabatanMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jabatanClient = (client) => {
  const connection = client.get('connection')

  client.use(jabatanPath, connection.service(jabatanPath), {
    methods: jabatanMethods
  })
}
