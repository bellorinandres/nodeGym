DELIMITER //
CREATE TRIGGER actualizaStatusBoleta BEFORE INSERT ON boleta
FOR EACH ROW
BEGIN
  SET NEW.statusBoleta =
    CASE
      WHEN NEW.fechaStart > CURDATE() THEN 1
      WHEN NEW.fechaStart <= CURDATE() AND NEW.fechaEnd >= CURDATE() THEN 2
      WHEN NEW.fechaEnd < CURDATE() THEN 3
      WHEN NEW.fechaEnd >= DATE_ADD(CURDATE(), INTERVAL 1 MONTH) THEN 4
    END;
END;
//
DELIMITER ;
