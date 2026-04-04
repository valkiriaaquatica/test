# CodeQL demo

Este ejemplo esta metido en una carpeta aislada porque este repo es de Terraform y CodeQL no analiza archivos `*.tf` directamente. La idea es que puedas entender como funciona CodeQL viendo un caso pequeno y completo.

## Que ensena este ejemplo

Este ejemplo ensena cuatro cosas:

1. Como lanzar CodeQL en GitHub Actions.
2. Como decirle a CodeQL que analice solo una carpeta concreta.
3. Como anadir una query personalizada.
4. Como hacer que el analisis produzca una alerta real.

## Idea general de CodeQL

CodeQL no ejecuta tu programa para ver si falla. Lo que hace es analizar el codigo fuente y convertirlo en una representacion interna que entiende la estructura del programa.

Despues ejecuta queries sobre esa representacion. Una query es una regla escrita en QL que pregunta por patrones del codigo. Por ejemplo:

- llamadas a funciones peligrosas
- datos que vienen del usuario y llegan a un sitio sensible
- comparaciones inseguras
- uso de APIs obsoletas o peligrosas

La idea mental correcta es esta: CodeQL trata el codigo como si fuera una base de datos y las queries son preguntas sobre esa base de datos.

## Como funciona este ejemplo

El flujo completo es este:

1. GitHub Actions arranca la workflow de CodeQL.
2. CodeQL se inicializa para JavaScript.
3. CodeQL lee la configuracion y ve que solo tiene que analizar `examples/codeql-demo`.
4. CodeQL carga sus queries standard y tambien la query local que has creado.
5. Analiza el archivo `src/app.js`.
6. Encuentra una llamada a `eval()`.
7. Publica el resultado como alerta de code scanning en GitHub.

## Que hace cada archivo

### `examples/codeql-demo/src/app.js`

Este archivo es el codigo que se analiza.

Contiene una inseguridad intencional:

- lee un parametro `code` de una URL
- lo pasa directamente a `eval()`

Eso es peligroso porque `eval()` ejecuta codigo dinamico. Si el valor viene de usuario, puede acabar ejecutandose algo no deseado.

En este ejemplo no importa que el programa sea util. Importa que haya un patron claro para que CodeQL lo detecte.

## `.github/codeql/queries/js/insecure-eval.ql`

Esta es la query personalizada.

Su trabajo es buscar cualquier llamada directa a `eval()`.

Explicada por partes:

- `import javascript`
  Le dice a CodeQL que use el modelo de analisis de JavaScript.

- `from CallExpr call, Identifier callee`
  Dice con que tipos de elementos quiere trabajar la query.
  `CallExpr` representa llamadas a funciones.
  `Identifier` representa nombres del codigo, como por ejemplo `eval`.

- `where`
  Empieza la condicion que deben cumplir esos elementos.

- `call.getCallee() = callee`
  Dice que el identificador que estamos mirando es la funcion que se esta llamando.

- `callee.getName() = "eval"`
  Filtra para quedarnos solo con llamadas cuyo nombre es `eval`.

- `select call, "This demo calls eval() directly. CodeQL reports it through a custom query."`
  Le dice a CodeQL que reporte ese punto del codigo como resultado y le asocie ese mensaje.

En resumen, esta query significa: "buscame cualquier llamada cuya funcion llamada sea `eval` y reportala".

## `.github/codeql/codeql-config.yml`

Este archivo le dice a CodeQL como debe analizar el repo.

Lo importante aqui es:

- `queries`
  Carga dos grupos de reglas:
  las standard de GitHub (`security-and-quality`) y las queries locales (`./.github/codeql/queries/js`).

- `paths`
  Limita el analisis a `examples/codeql-demo`.
  Esto es importante porque evita que CodeQL intente analizar otras partes del repo que no forman parte del ejemplo.

- `paths-ignore`
  Ignora `*.tf`.
  Aqui se deja claro que el objetivo de este ejemplo no es escanear Terraform.

## `.github/workflows/codeql-example.yml`

Esta es la automatizacion en GitHub Actions.

Hace esto:

- `on.pull_request.paths`
  Solo se ejecuta automaticamente si una PR toca archivos del ejemplo o de la configuracion de CodeQL.

- `workflow_dispatch`
  Permite lanzarla manualmente desde la interfaz de GitHub.

- `github/codeql-action/init@v3`
  Inicializa CodeQL, define que el lenguaje es `javascript-typescript` y carga `codeql-config.yml`.

- `github/codeql-action/autobuild@v3`
  Intenta preparar el proyecto para el analisis. En proyectos simples como este no hace gran cosa, pero forma parte del flujo habitual.

- `github/codeql-action/analyze@v3`
  Ejecuta el analisis y publica los resultados en GitHub.

## Que alerta deberia salir

Cuando la workflow se ejecute, CodeQL deberia detectar la llamada a `eval()` en `examples/codeql-demo/src/app.js`.

El resultado esperado es una alerta en Code Scanning parecida a esta idea:

- hay una llamada directa a `eval()`
- esa llamada coincide con la query personalizada
- por eso se reporta como `warning`

## Por que esto sirve para aprender

Este ejemplo te deja ver las cuatro capas reales de CodeQL:

1. Codigo vulnerable o sospechoso.
2. Query que define que patron buscar.
3. Configuracion que decide donde y con que reglas analizar.
4. Workflow que ejecuta todo y publica resultados.

Si entiendes esas cuatro piezas, ya entiendes la base de como se usa CodeQL en un repo.

## Limitaciones de este ejemplo

Este ejemplo esta hecho para aprender, no para cubrir casos reales complejos.

- La query busca un patron muy simple.
- No hace analisis de flujo de datos.
- No analiza Terraform.
- No intenta modelar una vulnerabilidad real compleja.

En proyectos reales, las queries pueden ser bastante mas avanzadas y seguir datos desde entrada de usuario hasta un sink peligroso.

## Apunte rapido para tus notas

Si quieres una version corta para apuntes:

CodeQL analiza codigo fuente sin ejecutarlo. Convierte el programa en una representacion consultable y lanza queries para encontrar patrones peligrosos. En este ejemplo, GitHub Actions ejecuta CodeQL sobre una carpeta JavaScript, carga una query propia que busca llamadas a `eval()`, encuentra ese patron en `app.js` y publica la alerta en Code Scanning.

## Para IaC real

Si quieres analizar Terraform de verdad, CodeQL no es la herramienta principal. Para eso suelen usarse herramientas como `tfsec`, `checkov` o `trivy config`. Este ejemplo esta pensado para que entiendas la mecanica de CodeQL, no para auditar IaC real.

## Gitleaks en este repo

Ademas del ejemplo de CodeQL, el repo ahora tiene una workflow de `gitleaks` en `.github/workflows/gitleaks.yml`.

La diferencia conceptual es esta:

- `CodeQL` busca patrones de codigo y problemas logicos o de seguridad en el source code.
- `gitleaks` busca secretos expuestos, por ejemplo tokens, passwords, claves privadas o credenciales metidas por error en el repo o en el historial git.

La workflow de `gitleaks` hace esto:

1. clona el repo con `fetch-depth: 0` para que pueda revisar tambien el historial
2. ejecuta `gitleaks/gitleaks-action@v2`
3. usa `.gitleaks.toml` como configuracion local

El archivo `.gitleaks.toml` extiende las reglas por defecto de gitleaks y ahora mismo ignora:

- `.git/`
- `examples/codeql-demo/`

Esa exclusion del ejemplo de CodeQL es solo para mantener separado lo didactico del escaneo de secretos.

## Como forzar una deteccion de gitleaks

He dejado un archivo de prueba en `examples/gitleaks-demo/fake-secrets.env`.

Ese archivo contiene un token falso con formato parecido a un token real de GitHub. No sirve para autenticarse, pero esta puesto para que `gitleaks` lo detecte como si fuera un secreto expuesto.

La idea es esta:

- `gitleaks` no entiende si el secreto funciona o no
- `gitleaks` busca patrones que parecen credenciales reales
- si encuentra uno, marca el hallazgo y hace fallar la workflow

Por tanto, mientras ese archivo exista y no este excluido en `.gitleaks.toml`, la workflow de `gitleaks` deberia disparar una alerta o fallar el job.

Si luego quieres dejar la action activa sin que falle siempre, tienes dos opciones:

- borrar `examples/gitleaks-demo/fake-secrets.env`
- excluir esa ruta en `.gitleaks.toml`
