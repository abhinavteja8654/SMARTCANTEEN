package com.smartcanteen.api.repository;

import com.smartcanteen.api.entity.WasteLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface WasteLogRepository extends JpaRepository<WasteLog, Long> {
    List<WasteLog> findByWasteDate(LocalDate wasteDate);
    List<WasteLog> findByWasteDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(w.wastedPortions), 0) FROM WasteLog w WHERE w.wasteDate >= :startDate")
    Integer sumTotalWastedPortions(@Param("startDate") LocalDate startDate);

    @Query("SELECT COALESCE(SUM(w.estimatedCostLost), 0) FROM WasteLog w WHERE w.wasteDate >= :startDate")
    BigDecimal sumTotalCostLost(@Param("startDate") LocalDate startDate);
}
