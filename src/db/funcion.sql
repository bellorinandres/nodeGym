DELIMITER //
CREATE FUNCTION calcularFechaFinal(fechaInicial DATE, valor INT) RETURNS DATE
BEGIN
    DECLARE fechaFinal DATE;
    
    IF valor = 1 THEN
        SET fechaFinal = DATE_ADD(fechaInicial, INTERVAL 1 WEEK);
    ELSEIF valor = 2 THEN
        SET fechaFinal = DATE_ADD(fechaInicial, INTERVAL 1 MONTH);
    ELSEIF valor = 3 THEN
        SET fechaFinal = DATE_ADD(fechaInicial, INTERVAL 3 MONTH);
    ELSE
        SET fechaFinal = fechaInicial;
    END IF;

    RETURN fechaFinal;
END;
//
DELIMITER ;