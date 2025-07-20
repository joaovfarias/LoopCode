# LoopCode
<pre>
├── HELP.md
├── mvnw
├── mvnw.cmd
├── pom.xml
├── README.md
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── loopcode
    │   │           └── loopcode
    │   │               ├── config
    │   │               │   └── securityConfig.java
    │   │               ├── controller
    │   │               │   └── homeController.java
    │   │               ├── domain
    │   │               │   └── user
    │   │               │       └── User.java
    │   │               ├── dtos
    │   │               │   ├── LoginRequestDto.java
    │   │               │   └── RegisterRequestDto.java
    │   │               ├── exceptions
    │   │               │   └── UserAlreadyExistsException.java
    │   │               ├── LoopcodeApplication.java
    │   │               ├── model
    │   │               ├── repositories
    │   │               │   └── UserRepository.java
    │   │               ├── security
    │   │               │   └── Role.java
    │   │               └── service
    │   │                   └── UserService.java
    │   └── resources
    │       ├── application.properties
    │       ├── frontend
    │       │   ├── app
    │       │   │   ├── activies
    │       │   │   │   └── [id]
    │       │   │   │       └── page.js
    │       │   │   ├── favicon.ico
    │       │   │   ├── globals.css
    │       │   │   ├── layout.js
    │       │   │   ├── login
    │       │   │   │   └── page.js
    │       │   │   ├── page.js
    │       │   │   ├── register
    │       │   │   │   └── page.js
    │       │   │   ├── theme-provider.js
    │       │   │   └── usuarios
    │       │   │       └── [id]
    │       │   │           └── page.js
    │       │   ├── components
    │       │   │   ├── ExcluirExercicioDialog.js
    │       │   │   ├── ExcluirListaDialog.js
    │       │   │   ├── ExercicioItem.js
    │       │   │   ├── ListaItem.js
    │       │   │   ├── Nav.js
    │       │   │   └── NavWrapper.js
    │       │   ├── eslint.config.mjs
    │       │   ├── jsconfig.json
    │       │   ├── lib
    │       │   │   └── theme.js
    │       │   ├── middleware.js
    │       │   ├── next.config.mjs
    │       │   ├── package.json
    │       │   ├── package-lock.json
    │       │   ├── postcss.config.mjs
    │       │   ├── public
    │       │   │   └── images
    │       │   │       ├── gato.jpg
    │       │   │       └── logo.png
    │       │   └── README.md
    │       ├── static
    │       └── templates
    └── test
        └── java
            └── com
                └── loopcode
                    └── loopcode
                        └── LoopcodeApplicationTests.java
</pre>

mvn clean install
mvn spring-boot:run
