package com.loopcode.loopcode.service.specifications;

import com.loopcode.loopcode.domain.exercise.Difficulty;
import com.loopcode.loopcode.domain.exercise.Exercise;
import org.springframework.data.jpa.domain.Specification;

/**
 * Classe utilitária (helper) que contém os métodos para criar
 * filtros (Specifications) dinâmicos para a entidade Exercise.
 */
public class ExerciseSpecifications {

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
                criteriaBuilder.equal(root.get("language").get("name"), languageName);
    }

    /**
     * Retorna uma Specification que filtra exercícios pela dificuldade.
     *
     * @param difficulty A dificuldade como String (ex: "EASY").
     * @return um objeto Specification para o filtro.
     */
    public static Specification<Exercise> hasDifficulty(String difficulty) {
        try {
            // Converte a string para o Enum correspondente, ignorando maiúsculas/minúsculas.
            Difficulty diffEnum = Difficulty.valueOf(difficulty.toUpperCase());
            return (root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("difficulty"), diffEnum);
        } catch (IllegalArgumentException e) {
            // Se a dificuldade fornecida for inválida (ex: "super hard"),
            // retorna uma especificação que não encontrará nenhum resultado.
            return (root, query, criteriaBuilder) -> criteriaBuilder.disjunction();
        }
    }
}
