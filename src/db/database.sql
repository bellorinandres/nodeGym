-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema gym
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gym
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gym` DEFAULT CHARACTER SET utf8 ;
USE `gym` ;

-- -----------------------------------------------------
-- Table `gym`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`cliente` (
  `idCliente` INT(11) NOT NULL AUTO_INCREMENT,
  `dniCliente` VARCHAR(64) NULL DEFAULT NULL,
  `nombreCliente` VARCHAR(64) NULL DEFAULT NULL,
  `apellidoCliente` VARCHAR(64) NULL DEFAULT NULL,
  `generoCliente` VARCHAR(10) NULL DEFAULT NULL,
  `fechaNacimiento` DATE NULL DEFAULT NULL,
  `passCliente` VARCHAR(64) NULL DEFAULT NULL,
  `emailCliente` VARCHAR(100) NULL DEFAULT NULL,
  `telefono` VARCHAR(15) NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE INDEX `dniCliente_UNIQUE` (`dniCliente` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `gym`.`Estatus`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`Estatus` (
  `idstatus` INT NOT NULL AUTO_INCREMENT,
  `nombreEstatus` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idstatus`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8
COMMENT = 'Aqui mostramos el Estatus de la boleta, si esta Vigente, o Vencida, Suspendidad o Por Cobrar';


-- -----------------------------------------------------
-- Table `gym`.`metodoPago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`metodoPago` (
  `idmetodoPago` INT NOT NULL AUTO_INCREMENT,
  `tipoPago` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idmetodoPago`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `gym`.`menbresia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`menbresia` (
  `idmenbresia` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NULL,
  `monto` INT NULL,
  PRIMARY KEY (`idmenbresia`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gym`.`local`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`local` (
  `idlocal` INT NOT NULL AUTO_INCREMENT,
  `nameLocal` VARCHAR(45) NULL,
  PRIMARY KEY (`idlocal`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gym`.`boleta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gym`.`boleta` (
  `idboleta` INT(6) NOT NULL AUTO_INCREMENT,
  `idCliente` INT(11) NULL DEFAULT NULL,
  `fechaBoleta` TIMESTAMP NULL DEFAULT NULL,
  `fechaStart` DATE NULL DEFAULT NULL,
  `fechaEnd` DATE NULL DEFAULT NULL,
  `totalBoleta` INT(11) NULL DEFAULT NULL,
  `saldoBoleta` INT(11) NULL DEFAULT NULL,
  `statusBoleta` INT NULL DEFAULT NULL,
  `metodoPago` INT NULL DEFAULT NULL,
  `idMenbresiaBoleta` INT NULL,
  `idGymBoleta` INT NULL,
  PRIMARY KEY (`idboleta`),
  INDEX `Cliente_idx` (`idCliente` ASC) ,
  INDEX `Estatus_idx` (`statusBoleta` ASC) ,
  INDEX `MetodoPago_idx` (`metodoPago` ASC) ,
  INDEX `menbresia_idx` (`idMenbresiaBoleta` ASC) ,
  INDEX `local_idx` (`idGymBoleta` ASC) ,
  CONSTRAINT `Cliente`
    FOREIGN KEY (`idCliente`)
    REFERENCES `gym`.`cliente` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Estatus`
    FOREIGN KEY (`statusBoleta`)
    REFERENCES `gym`.`Estatus` (`idstatus`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `MetodoPago`
    FOREIGN KEY (`metodoPago`)
    REFERENCES `gym`.`metodoPago` (`idmetodoPago`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `menbresia`
    FOREIGN KEY (`idMenbresiaBoleta`)
    REFERENCES `gym`.`menbresia` (`idmenbresia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `local`
    FOREIGN KEY (`idGymBoleta`)
    REFERENCES `gym`.`local` (`idlocal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
