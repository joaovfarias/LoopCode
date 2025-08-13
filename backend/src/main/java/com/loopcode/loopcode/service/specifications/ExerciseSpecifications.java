package com.loopcode.loopcode.service.specifications;

import com.loopcode.loopcode.domain.exercise.Difficulty;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.solved_exercise.SolvedExercise;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Subquery;

/**
 * Classe utilitária (helper) que contém os métodos para criar
 * filtros (Specifications) dinâmicos para a entidade Exercise.
 */
public class ExerciseSpecifications {

    /**
     * Retorna uma Specification que filtra exercícios NÃO resolvidos por um usuário específico.
     *
     * @param username O nome do usuário para filtrar exercícios não resolvidos.
     * @return um objeto Specification para o filtro.
     */
    public static Specification<Exercise> notSolvedByUser(String username) {
        return (root, query, criteriaBuilder) -> {
            // Subquery para verificar se NÃO existe um SolvedExercise
            Subquery<Long> subquery = query.subquery(Long.class);
            var solvedExerciseRoot = subquery.from(SolvedExercise.class);
            subquery.select(criteriaBuilder.literal(1L))
                   .where(
                       criteriaBuilder.and(
                           criteriaBuilder.equal(solvedExerciseRoot.get("exercise").get("id"), root.get("id")),
                           criteriaBuilder.equal(solvedExerciseRoot.get("user").get("username"), username)
                       )
                   );
            return criteriaBuilder.not(criteriaBuilder.exists(subquery));
        };
    }

    /**
     * Retorna uma Specification que filtra exercícios pelo nome da linguagem.
     *
     * @param languageName O nome da linguagem a ser filtrada (ex: "Java").
     * @return um objeto Specification para o filtro.
     */
    public static Specification<Exercise> hasLanguage(String languageName) {
        return (root, query, criteriaBuilder) ->
        // Acessa o atributo "language" da entidade Exercise,
        // e então o atributo "name" da entidade ProgrammingLanguage.
        criteriaBuilder.equal(root.get("programmingLanguage").get("name"), languageName);
    }

    /**
     * Retorna uma Specification que filtra exercícios pela dificuldade.
     *
     * @param difficulty A dificuldade como String (ex: "EASY").
     * @return um objeto Specification para o filtro.
     */
    public static Specification<Exercise> hasDifficulty(String difficulty) {
        try {
            // Converte a string para o Enum correspondente, ignorando
            // maiúsculas/minúsculas.
            Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());
            return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("difficulty"), diffEnum);
        } catch (IllegalArgumentException e) {
            // Se a dificuldade fornecida for inválida (ex: "super hard"),
            // retorna uma especificação que não encontrará nenhum resultado.
            return (root, query, criteriaBuilder) -> criteriaBuilder.disjunction();
        }
    }

    public static Specification<Exercise> containsTerm(String term) {
        return (root, query, cb) -> {
            String like = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("createdBy")), like));
        };
    }

    /**
     * Retorna uma Specification que filtra exercícios que foram resolvidos por um usuário específico.
     *
     * @param username O nome do usuário para filtrar exercícios resolvidos.
     * @return um objeto Specification para o filtro.
     */
    public static Specification<Exercise> solvedByUser(String username) {
        return (root, query, criteriaBuilder) -> {
            // Criar uma subquery para verificar se existe um SolvedExercise
            Subquery<Long> subquery = query.subquery(Long.class);
            var solvedExerciseRoot = subquery.from(SolvedExercise.class);
            
            subquery.select(criteriaBuilder.literal(1L))
                   .where(
                       criteriaBuilder.and(
                           criteriaBuilder.equal(solvedExerciseRoot.get("exercise").get("id"), root.get("id")),
                           criteriaBuilder.equal(solvedExerciseRoot.get("user").get("username"), username)
                       )
                   );
            
            return criteriaBuilder.exists(subquery);
        };
    }

}
