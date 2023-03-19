# Prueba de estrés

## Configuración

Los archivos necesarios para realizar el experimento se encuentran en la carpeta `gatling`, en la raíz del proyecto. En su interior se encuentran dos archivos junto a este reporte: el [experimento simple](./TwoScenarios.scala), donde se realiza una prueba con un usuario concurrente para los dos escenarios, y el [experimento final](./TwoScenariosDiagnosis.scala), que es el utilizado para el diagnóstico. Los datos utilizados se encuentran en el directorio `resources` y las capturas con los resultados, en `experiments`.

## Escenarios

Para realizar los siguientes experimentos se han escogidos dos escenarios:

- Creación de un usuario con rol "Manager", edición de alguno de sus campos, lectura del perfil y creación, edición, lectura y publicación de una *trip* por parte de ese mismo usuario.
- Generación de dos cuentas de usuarios de tipo "Explorer" que crean una aplicación en la *trip* creada en el otro escenario. Luego una de esas *trip*s se rechaza y la otra se acepta.

## Resultados

Se va a someter a la API a una serie de pruebas de carga para obtener dos resultados:

### El número mínimo de usuarios que no puede ser soportado por los escenarios

Tras varios intentos, comenzando desde 1000 usuarios concurrentes, no se ha obtenido el número mínimo. El último intento se ha realizado con 60000 usuarios durante 4 segundos y ni aún así se ha terminado el proceso de *gatling*.

Se ha decidido parar el experimento en este punto debido a la gran cantidad de tiempo que requiere terminarlo con tal número de usuarios (más de 20 minutos por prueba). Sin embargo, como se puede observar en la [captura de pantalla](./experiments/stress-test-KO.png), el equipo estaba en su límite de CPU durante un tiempo continuado, por lo que podríamos considerar que ese es el cuello de botella.

Por ello, se toma como **60000** valor.

### El máximo número de usuarios concurrentes que los escenarios pueden superar teniendo un rendimiento correcto

Para hacer esta parte del estudio se ha comenzado con 1000 usuarios concurrentes durante 4 segundos. El número se ha ido reduciendo hasta dar con los **390** usuarios concurrentes que suponen el número máximo que la API puede soportar con un rendimiento adecuado, como se puede ver en esta [captura de pantalla](./experiments/stress-test-OK.png).