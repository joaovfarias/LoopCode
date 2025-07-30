package com.loopcode.loopcode.dtos;

import java.util.Set;
import java.util.UUID;

public record UserListDto(
        Long id,
        String name,
        String ownerUsername,
        Set<UUID> exerciseIds) {
}
