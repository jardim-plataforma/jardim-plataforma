---
{
  "title": "Bucket S3 e decisões de configuração",
  "description": "Reunir as decisões de destino, acesso, criptografia, histórico, lifecycle e validação para configurar um bucket.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "bucket"
  ],
  "relations": [
    {
      "target": "conceitos/s3",
      "kind": "depende-de"
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
      "target": "conceitos/terraform",
      "kind": "utiliza"
    }
  ]
}
---

## O problema que resolve

Criar um recipiente de objetos com regras explícitas de acesso, proteção e preservação.

## Como funciona

O bucket é um recurso de armazenamento de objetos, com configurações próprias. A comparação com pasta ajuda a imaginar a organização, mas o bucket também define decisões de acesso, criptografia e preservação.

### Ficha de decisões
| Categoria | O que registrar | Pergunta para confirmar |
|---|---|---|
| Destino | Conta, região e ambiente | Onde o recurso deve existir? |
| Identificação | Nome do bucket e aplicação | Como reconhecer sua finalidade? |
| Responsabilidade | Responsável e tags | Quem mantém e responde pelo recurso? |
| Administração | Identidades e permissões de provisionamento | Quem pode criar ou alterar configurações? |
| Publicação | Identidade e escopo de escrita | Quem envia, substitui e eventualmente remove documentos? |
| Consulta | Identidade e escopo de leitura | Quem lista e busca os arquivos? |
| Exposição | Bloqueio público e políticas | Quem deve ter acesso e por qual caminho? |
| Propriedade | Object Ownership e uso ou desativação de ACLs | Quem controla os objetos enviados? |
| Criptografia | Modalidade, referência KMS quando aplicável e permissões | Como proteger os dados armazenados? |
| Histórico | Versionamento | É necessário recuperar versões anteriores? |
| Lifecycle | Filtros, ações, marcos e prazos | Quais versões preservar e por quanto tempo? |
| Exclusão | Comportamento da ferramenta e proteção do recurso | Que exclusões o fluxo deve impedir? |
| Verificação | Evidências e configurações esperadas | Como comprovar a criação correta? |

Tags são pares de chave e valor, como `Owner = equipe-jardim`. Ajudam a identificar finalidade e responsabilidade. Nem toda tag serve para custos automaticamente, e uma tag não concede permissão por si só.

Object Ownership controla a propriedade dos objetos. No modo Bucket owner enforced, o proprietário do bucket controla os objetos e ACLs são desativadas. ACL é um mecanismo de controle de acesso; não precisamos habilitá-lo para utilizar policies.

### Dados privados e criptografia
Não reservamos criptografia apenas para documentos classificados como sensíveis. No S3, novos uploads já recebem criptografia do lado do servidor por padrão. O requisito adicional pode ser usar uma chave KMS específica, com controle e permissões definidos.

Configurar criptografia padrão não reescreve automaticamente todos os objetos anteriores. É preciso distinguir os dados já armazenados dos novos uploads.

### Exclusão e lifecycle
`prevent_destroy` é uma proteção no fluxo Terraform; não cria uma trava geral contra exclusões pela AWS. Lifecycle do S3 trata objetos e versões. São mecanismos com responsabilidades diferentes.

### Primeiro escopo da demanda simulada
Criar e validar um bucket privado pode ser uma primeira entrega. Publicar e ler documentos pela aplicação será outra etapa. As referências de chave e identidade necessárias ao provisionamento precisam estar disponíveis; não são criadas apenas porque informamos seus ARNs.

## No fluxo de entrega

A primeira entrega pode ser o bucket privado e vazio. A publicação dos documentos e a consulta pela aplicação são integrações posteriores.

## Exemplo

A identidade de provisionamento configura o recurso; a de publicação envia objetos; a de leitura consulta os documentos. Sucesso em uma operação não comprova sucesso nas demais.

## Como verificar

Confira a ficha de decisões com as configurações efetivas: conta, região, políticas, criptografia, versionamento e lifecycle. Valide com evidências apropriadas ao escopo entregue.

## Conexões

[[conceitos/s3]] — relação: **depende-de**.

[[conceitos/iam]] — relação: **utiliza**.

[[conceitos/kms]] — relação: **utiliza**.

[[conceitos/terraform]] — relação: **utiliza**.

## Referências

- [Object Ownership](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html)
- [Criptografia padrão](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html)
