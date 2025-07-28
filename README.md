# LoopCode
## Backend
### Rodar:
mvn clean install

mvn spring-boot:run

Para funcionar o exercise/{id}/solve:
1. Corpo do mainCode deve ter "{user_code}" como placeholder para o código do usuário.
2. Os inputs são passados como argv para a PistonAPI, então o código deve ser capaz de lidar com isso.
3. O código deve ter uma função de print no final para validar resultado pelo stdout.

### Documentação:
http://localhost:8080/swagger-ui/index.html

### Banco de dados:
http://localhost:8080/h2-console/

## Frontend
### Dependências:
npm install
### Rodar:
npm run dev