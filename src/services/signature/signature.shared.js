export const signaturePath = 'signature'

export const signatureMethods = ['find', 'get', 'create', 'patch', 'remove']

export const signatureClient = (client) => {
  const connection = client.get('connection')

  client.use(signaturePath, connection.service(signaturePath), {
    methods: signatureMethods
  })
}
