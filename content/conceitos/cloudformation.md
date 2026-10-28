---
{
  "title": "CloudFormation templates stacks e StackSets",
  "description": "Distinguir a declaração em template, sua implantação em uma stack e a distribuição de stacks por StackSets.",
  "type": "conceito",
  "stage": "aprender",
  "status": "em-estudo",
  "created": "2026-10-26",
  "updated": "2026-10-28",
  "tags": [
    "conceito",
    "estudo",
    "cloudformation"
  ],
  "relations": [
    {
      "target": "conceitos/aws",
      "kind": "depende-de"
    },
    {
      "target": "conceitos/iac",
      "kind": "implementa"
    }
  ]
}
---

## O problema que resolve

Provisionar recursos AWS a partir de uma declaração reutilizável e administrar suas implantações.

## Como funciona

CloudFormation é um serviço AWS para provisionar e gerenciar recursos descritos em templates. Template, stack e StackSet têm papéis diferentes.

### Template é a declaração
Um template é um arquivo, normalmente YAML ou JSON. Pode declarar um recurso ou vários recursos, inclusive de tipos diferentes. Cada entrada em Resources descreve um recurso.

Este exemplo fictício contém dois buckets. Usamos o mesmo tipo apenas para facilitar a leitura; uma stack não se limita a buckets.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  Documentacao:
    Type: AWS::S3::Bucket
  Evidencias:
    Type: AWS::S3::Bucket
```

Não definimos nomes físicos neste trecho. CloudFormation pode gerá-los. O exemplo omite configurações da demanda, como políticas e retenção.

### Stack é a implantação gerenciada
Ao solicitar a criação de uma stack usando esse template, o CloudFormation provisiona os recursos e passa a acompanhá-los como uma unidade gerenciada. O nome fictício da stack pode ser `jardim-estudo`.

A stack conterá os dois buckets criados. Se o template tivesse um só recurso, a stack poderia ter apenas aquele recurso. Se declarasse bucket, role e chave KMS, ela poderia reunir esses três tipos.

O template permanece sendo a declaração em arquivo; a stack é a implantação gerenciada correspondente. Criar outra stack com o mesmo template cria outra implantação, respeitando as particularidades e nomes dos recursos.

### StackSet distribui implantações
StackSets é uma funcionalidade do CloudFormation. Um StackSet reúne um template e configurações para implantar e administrar stacks em destinos selecionados.

| Destino fictício | Resultado ilustrativo |
|---|---|
| Conta A, região X | Uma stack com seus próprios dois buckets |
| Conta B, região X | Outra stack com seus próprios dois buckets |
| Conta B, região Y | Outra stack com seus próprios dois buckets |

Neste exemplo, três destinos bem-sucedidos produzem três stacks e seis buckets. Os buckets não compartilham automaticamente conteúdo. Distribuir a infraestrutura não configura, por si só, replicação de objetos. Restrições de nomes, permissões e escopo dos recursos precisam ser respeitadas.

Para recursos globais, como roles IAM, a seleção de regiões exige cuidado: repetir a criação do mesmo nome em várias regiões da mesma conta pode conflitar.

### Relação com Terraform
CloudFormation e Terraform podem gerenciar infraestrutura. Nenhum é uma etapa obrigatória do outro. Uma organização pode distribuir identidades por CloudFormation e criar buckets com Terraform que referenciam essas identidades.

## No fluxo de entrega

O template descreve um ou vários recursos. Criar uma stack materializa uma implantação gerenciada; StackSets coordena implantações em destinos selecionados.

## Exemplo

Um template com dois buckets implantado em três destinos pode produzir três stacks e seis buckets. Isso não replica automaticamente os objetos armazenados.

## Como verificar

Identifique o template, a stack e os recursos efetivos em cada destino. Confira nomes, permissões e resultados; distribuir infraestrutura não comprova replicação de conteúdo.

## Conexões

[[conceitos/aws]] — relação: **depende-de**.

[[conceitos/iac]] — relação: **implementa**.

## Referências

- [Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html)
- [StackSets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)
- [Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html)
