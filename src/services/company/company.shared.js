export const companyPath = 'company'

export const companyMethods = ['find', 'get', 'create', 'patch', 'remove']

export const companyClient = (client) => {
  const connection = client.get('connection')

  client.use(companyPath, connection.service(companyPath), {
    methods: companyMethods
  })
}
