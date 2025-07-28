package com.loopcode.loopcode.domain.ban;

import com.loopcode.loopcode.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ban_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BanRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "banned_user_username", nullable = false)
    private User bannedUser;

    @ManyToOne
    @JoinColumn(name = "admin_username", nullable = false)
    private User adminUser;

    @Column(nullable = false, length = 500)
    private String banReason;

    @Column(nullable = false)
    private LocalDateTime banDate;

    @Column(nullable = true)
    private LocalDateTime unbanDate;

    @Column(nullable = false)
    private boolean active = true; // Essencial para indicar o banimento atual
}