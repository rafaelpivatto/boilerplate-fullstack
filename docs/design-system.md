# Design system

O produto deve parecer uma ferramenta operacional: calmo, denso e legível. Use tokens semânticos em `apps/web/src/app/globals.css`; não espalhe cores literais pelas features.

Primitives locais ficam em `shared/ui` (`Button`, `Card`, `Input`, `Badge`, `PageHeader`, `EmptyState`, `LoadingState`). Bibliotecas externas podem fornecer comportamento acessível, mas não substituem o sistema local sem uma decisão explícita.

Use `Source Sans 3` para controles e texto operacional, uma serif para títulos e `tabular-nums` em números. Toda tela interna começa com `PageHeader` e suporta estados de loading, vazio e erro.
