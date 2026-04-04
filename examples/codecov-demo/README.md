# Codecov demo

Este ejemplo ensena como usar `Codecov` para subir cobertura de tests desde GitHub Actions.

## Que hace Codecov

`Codecov` no ejecuta tests por si solo. Lo que hace es recibir un informe de cobertura generado por tu proyecto y mostrarlo de forma centralizada.

La idea general es esta:

1. tu proyecto ejecuta tests
2. esos tests generan un fichero de coverage
3. la action de `Codecov` sube ese fichero
4. Codecov muestra porcentajes, diffs de cobertura y estado de la PR

## Archivos del ejemplo

- `examples/codecov-demo/src/math.js`
  Codigo pequeno para tener algo que probar.
- `examples/codecov-demo/test/math.test.js`
  Tests de ejemplo.
- `examples/codecov-demo/package.json`
  Configura `jest` para generar cobertura en formato `cobertura`.
- `.github/workflows/codecov-example.yml`
  Workflow que instala dependencias, ejecuta tests y sube cobertura.

## Como funciona el flujo

La workflow hace esto:

1. clona el repo
2. instala Node.js
3. ejecuta `npm ci` dentro de `examples/codecov-demo`
4. ejecuta `npm test`
5. `jest` genera `coverage/cobertura-coverage.xml`
6. `codecov/codecov-action@v5` sube ese fichero a Codecov

## Que parte genera la cobertura

La cobertura no la genera Codecov. La genera `jest`.

En `package.json` se ha configurado:

- `collectCoverageFrom`
  para decir que mida `src/**/*.js`
- `coverageReporters`
  para que saque un informe en formato `cobertura`

Ese formato es el que luego se sube con la action.

## Que hace la workflow de Codecov

En `.github/workflows/codecov-example.yml` la parte clave es esta:

- se ejecutan tests con coverage
- se sube `./examples/codecov-demo/coverage/cobertura-coverage.xml`
- se usa un flag `codecov-demo` para identificar este reporte

## Que necesitas en GitHub

Normalmente tendras que configurar `CODECOV_TOKEN` en los secrets del repo, salvo en ciertos escenarios soportados por Codecov para repos publicos.

## Idea clave para apuntes

`Codecov` no analiza codigo ni busca vulnerabilidades. Recoge el reporte de cobertura que genera tu suite de tests y lo publica para que puedas ver cuanto codigo queda cubierto y como cambia esa cobertura en cada PR.
