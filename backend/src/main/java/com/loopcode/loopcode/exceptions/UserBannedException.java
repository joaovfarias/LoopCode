package com.loopcode.loopcode.exceptions;

public class UserBannedException extends RuntimeException {
    private final String banReason;

    public UserBannedException(String banReason) {
        super("User is permanently banned: " + banReason);
        this.banReason = banReason;
    }

    public String getBanReason() {
        return banReason;
    }
}
