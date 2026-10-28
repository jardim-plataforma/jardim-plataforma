---
{
  "title": "AWS e conceitos de cloud",
  "description": "Entender conta, região, serviço, recurso e ARN antes de escolher e configurar infraestrutura na nuvem.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "aws"
  ],
  "relations": [
    {
      "target": "conceitos/armazenamento",
      "kind": "utiliza"
    },
    {
      "target": "conceitos/iam",
      "kind": "utiliza"
    },
    {
      "target": "conceitos/kms",
      "kind": "utiliza"
    },
    {
      "target": "conceitos/cloudformation",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Organizar onde os recursos existem, quem pode acessá-los e como sua utilização é administrada.

## Como funciona

AWS é um provedor de computação em nuvem. Sua equipe utiliza capacidades de computação, armazenamento e outros serviços sem precisar comprar e operar toda a infraestrutura física correspondente. Essa infraestrutura continua existindo em datacenters.

### Conta e acesso
Uma conta AWS organiza recursos e estabelece um limite importante para acessos e cobrança. Uma organização pode ter várias contas, por exemplo para separar produção e experimentação. Conta AWS não é sinônimo de pessoa, role ou login. Diferentes pessoas e automações podem receber acesso à mesma conta.

Também não é necessário pensar na AWS como um único plano que libera todos os serviços. O consumo, a contratação e os modelos de cobrança dependem dos serviços utilizados.

### Região e latência
A região identifica uma área geográfica de infraestrutura AWS. Ela contém zonas de disponibilidade, que oferecem isolamento de falhas e podem compreender um ou mais datacenters. Escolher uma região não significa escolher um computador físico individual.

Latência é o atraso de uma comunicação. A distância influencia, mas também importam o caminho da rede, processamento, congestionamento e intermediários. No nosso caso, interessa a proximidade entre o backend que busca os arquivos e o armazenamento, além da proximidade com os usuários.

A região também interfere em disponibilidade de serviços, requisitos sobre localização de dados e custos. Alguns serviços, como IAM, não se organizam regionalmente da mesma forma que um bucket.

### Serviço e recurso
| Serviço | Capacidade | Exemplo de recurso |
|---|---|---|
| EC2 | Computação com máquinas virtuais | Uma instância |
| S3 | Armazenamento de objetos | Um bucket |
| EBS | Armazenamento em blocos | Um volume |
| EFS | Sistema de arquivos compartilhado | Um sistema de arquivos |
| IAM | Identidades e acessos | Uma role |
| KMS | Gerenciamento de chaves criptográficas | Uma chave KMS |
| CloudFormation | Provisionamento por templates | Uma stack |

EC2 significa Elastic Compute Cloud. A expressão “ES2” não identifica com segurança outro serviço neste contexto; não deve ser incorporada ao mapa sem confirmar a referência.

### ARN
ARN, Amazon Resource Name, é um identificador de recurso. Não é um serviço, uma senha ou uma autorização.

Exemplo fictício: `arn:aws:iam::123456789012:role/jardim-provisionamento`.

O ARN contém componentes que identificam o serviço e o recurso; conta e região aparecem conforme o tipo. Nem todo ARN contém ambos. Normalmente consultamos o ARN atribuído ao recurso e o referenciamos. Não inventamos um identificador independente do recurso real.

## No fluxo de entrega

A escolha de conta e região antecede o provisionamento. Os serviços oferecem capacidades; os recursos são as instâncias concretas configuradas pela equipe.

## Exemplo

S3 é um serviço; jardim-documentacao-estudo é o nome fictício de um bucket. IAM e KMS atendem a necessidades diferentes desse recurso.

## Como verificar

Diante de uma demanda, identifique serviço, recurso, conta, região e identidade de execução. Confirme cada informação antes de aplicar mudanças.

## Conexões

[[conceitos/armazenamento]] — relação: **utiliza**.

[[conceitos/iam]] — relação: **utiliza**.

[[conceitos/kms]] — relação: **utiliza**.

[[conceitos/cloudformation]] — relação: **utiliza**.

## Referências

- [Infraestrutura global AWS](https://aws.amazon.com/about-aws/global-infrastructure/)
- [Conceito de conta AWS](https://docs.aws.amazon.com/accounts/latest/reference/accounts-welcome.html)
- [ARNs](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html)
