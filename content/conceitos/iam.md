---
{
  "title": "IAM e identidades autorizadas",
  "description": "Distinguir roles, políticas de confiança, permissões e credenciais no acesso de pessoas e automações aos recursos AWS.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "iam"
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
      "target": "conceitos/kms",
      "kind": "configura"
    }
  ]
}
---

## O problema que resolve

Definir quem pode atuar e quais operações cada identidade pode realizar sobre os recursos.

## Como funciona

AWS IAM significa Identity and Access Management. É o serviço de gerenciamento de identidades e acessos. Para entender uma operação, precisamos identificar quem faz a requisição, que ação solicita e em qual recurso.

### Roles e policies
Uma role é uma identidade assumível por participantes autorizados. Ela não é uma conta AWS e não possui um e-mail e senha de login. Assumir uma role permite operar com credenciais temporárias, dentro das permissões efetivas da sessão.

Uma policy é um documento de regras. Policy não significa apenas “lista do que pode”: ela também pode expressar negações e condições.

| Política | Pergunta |
|---|---|
| Confiança da role | Quem pode assumir essa identidade e sob quais condições? |
| Permissões da identidade | Que operações são permitidas ou negadas? |
| Política do bucket | Que regras de acesso se aplicam ao recurso? |
| Política da chave KMS | Quem pode administrar ou usar a chave e em quais condições? |

A política de confiança também é uma policy. A distinção é sua finalidade. A permissão efetiva depende do conjunto de políticas e limites aplicáveis; não basta encontrar um único Allow e ignorar possíveis Deny.

### Exemplo de separação de trabalho
A automação de infraestrutura precisa configurar o bucket. A de documentação precisa publicar objetos. O backend precisa lê-los. Essas necessidades podem ser representadas por identidades distintas e escopos diferentes.

O código de um módulo não possui identidade própria. Quem executa os programas utiliza credenciais. Na pipeline, a máquina de execução, chamada runner, lê os arquivos e executa Terraform; seu provider utiliza as credenciais disponíveis para chamar AWS.

OIDC pode participar da comprovação da identidade da pipeline para obtenção de credenciais temporárias. STS é o serviço AWS que fornece essas credenciais em operações como assumir roles. Esse fluxo precisa ser configurado; colocar o ARN em uma lista não o estabelece.

## No fluxo de entrega

O runner executa os programas com uma identidade autorizada. Publicação e leitura podem usar identidades distintas com escopos diferentes.

## Exemplo

Uma role de publicação pode enviar documentos sem poder administrá-los. O backend precisa de suas próprias permissões de consulta; o ARN apenas identifica o recurso.

## Como verificar

Identifique as credenciais realmente utilizadas e avalie políticas de confiança, permissões, condições e negações. Não conclua que um ARN informado concede acesso.

## Conexões

[[conceitos/aws]] — relação: **depende-de**.

[[conceitos/bucket]] — relação: **configura**.

[[conceitos/kms]] — relação: **configura**.

## Referências

- [Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- [Credenciais temporárias](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)
