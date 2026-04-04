# CodeQL demo

Este repo es de Terraform, pero CodeQL no analiza archivos `*.tf` directamente. Por eso este ejemplo usa una carpeta aislada en JavaScript para enseñar:

1. Como se lanza CodeQL en GitHub Actions.
2. Como se limita el analisis a una carpeta concreta.
3. Como se anade una query personalizada.

## Archivos importantes

- `.github/workflows/codeql-example.yml`
  Workflow de ejemplo. Se puede lanzar a mano con `workflow_dispatch` o en una PR que toque el ejemplo.
- `.github/codeql/codeql-config.yml`
  Configuracion de CodeQL. Carga las queries standard y tambien las locales.
- `.github/codeql/queries/js/insecure-eval.ql`
  Query minima que marca cualquier llamada directa a `eval()`.
- `examples/codeql-demo/src/app.js`
  Codigo inseguro a proposito para que la query encuentre algo.

## Que deberias ver

Cuando ejecutes el workflow en GitHub, CodeQL deberia reportar al menos una alerta sobre la llamada a `eval()` en `examples/codeql-demo/src/app.js`.

## Idea clave

CodeQL funciona mejor cuando piensas en tres piezas:

- Base de codigo a analizar.
- Queries standard o propias.
- Resultado publicado en code scanning alerts.

## Para IaC real

Si quieres analizar Terraform de verdad, lo normal es combinar esto con herramientas especificas como `tfsec`, `checkov` o reglas de `trivy config`. CodeQL aqui queda como ejemplo didactico de la mecanica general.
