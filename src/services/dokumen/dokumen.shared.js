export const dokumenPath = 'dokumen'

export const dokumenMethods = ['find', 'get', 'create', 'patch', 'remove']

export const dokumenClient = (client) => {
  const connection = client.get('connection')

  client.use(dokumenPath, connection.service(dokumenPath), {
    methods: dokumenMethods
  })
}
