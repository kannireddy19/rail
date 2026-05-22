package com.example.traininfo.repository;

import com.example.traininfo.entity.TrainInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainInfoRepository extends JpaRepository<TrainInfo, Long> {
    Optional<TrainInfo> findByTrainName(String trainName);

    List<TrainInfo> findBySourceAndDestination(String source, String destination);

}


