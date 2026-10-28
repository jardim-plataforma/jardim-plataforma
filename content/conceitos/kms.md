---
{
  "title": "KMS e proteção de dados",
  "description": "Entender o serviço KMS, suas chaves e permissões e distinguir criptografia em trânsito da proteção no armazenamento.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "kms"
  ],
  "relations": [
    {
      "target": "conceitos/aws",
      "kind": "depende-de"
    },
    {
      "target": "conceitos/bucket",
      "kind": "configura"
    },
    {
      "target": "conceitos/iam",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Gerenciar chaves criptográficas e controlar sua administração e utilização nas integrações.

## Como funciona

AWS KMS significa Key Management Service, serviço de gerenciamento de chaves. Ele permite criar e controlar chaves criptográficas e seu uso. KMS é o serviço; uma chave KMS é um recurso desse serviço; seu ARN identifica esse recurso.

### Criptografia em trânsito e no armazenamento
TLS, Transport Layer Security, é um protocolo que protege a comunicação. HTTPS é HTTP utilizando TLS. Ele oferece mecanismos de confidencialidade, integridade e autenticação do servidor por certificados, conforme a conexão estabelecida.

Criptografia em repouso protege a representação dos dados enquanto armazenados. No S3 com criptografia do lado do servidor, a aplicação envia o arquivo e o serviço cuida da criptografia para armazená-lo. A leitura autorizada recebe seu conteúdo legível.

São proteções para momentos diferentes. TLS não define quem pode ler um bucket, e criptografia em repouso não torna uma política pública em privada.

### SSE S3 e SSE KMS
O S3 criptografa novos uploads por padrão com chaves gerenciadas pelo S3, modalidade SSE-S3. SSE-KMS utiliza a integração com KMS. Uma equipe pode escolher chave gerenciada pelo cliente para maior controle de uso e administração.

Na integração SSE-KMS, o S3 usa criptografia de envelope: chaves de dados protegem os objetos e a chave KMS participa da proteção dessas chaves. Não precisamos enviar manualmente cada HTML ao KMS nem inserir o material secreto da chave em um arquivo HCL.

Para configurar o bucket podemos informar o ARN de uma chave existente. Isso não cria a chave nem concede automaticamente acesso a ela. Operações de publicação e leitura exigem as permissões S3 e KMS correspondentes.

### KMS além de buckets
KMS também se integra a serviços como EBS, para volumes, e RDS, para bancos de dados. A possibilidade de reutilizar determinada chave depende do tipo, região, permissões e requisitos da integração. Não se deve assumir que qualquer chave funciona em qualquer serviço.

## No fluxo de entrega

O armazenamento usa a configuração de criptografia; as identidades precisam das permissões correspondentes para publicar e ler dados protegidos.

## Exemplo

O backend pode estar autorizado a consultar um objeto no S3 e ainda não possuir a permissão KMS necessária. Ele não precisa receber o segredo da chave.

## Como verificar

Confira a chave referenciada, sua região e as permissões aplicáveis à identidade real da execução. Diferencie acesso ao objeto e autorização de uso da chave.

## Conexões

[[conceitos/aws]] — relação: **depende-de**.

[[conceitos/bucket]] — relação: **configura**.

[[conceitos/iam]] — relação: **utiliza**.

## Referências

- [KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)
- [Integrações KMS](https://docs.aws.amazon.com/kms/latest/developerguide/service-integration.html)
- [SSE KMS no S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html)
- [TLS](https://www.rfc-editor.org/rfc/rfc8446)
