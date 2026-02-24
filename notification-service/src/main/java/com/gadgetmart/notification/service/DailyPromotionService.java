package com.gadgetmart.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class DailyPromotionService {

    // Runs every 24 hours (86400000 ms)
    @Scheduled(fixedRate = 86400000)
    public void pushDailyDeals() {
        log.info("📢 [DAILY NOTIFICATION] System pushing exciting new deals for {}", LocalDateTime.now());
        // In a real system, this would iterate through users or broadcast to a
        // notification topic
        log.info("🔥 Today's Extreme Deal: 15% OFF on all Apple Watch Ultra 3 products!");
    }
}
