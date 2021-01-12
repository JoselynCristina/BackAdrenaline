CREATE SCHEMA IF NOT EXISTS `sistema_seguimiento_bd`;

USE `sistema_seguimiento_bd` ;

CREATE TABLE IF NOT EXISTS `Persona` (
  `idPersona` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellidoPat` VARCHAR(30) NOT NULL,
  `apellidoMat` VARCHAR(30) NOT NULL,
  `celular` CHAR(9) NOT NULL,
  `genero` CHAR(1) NOT NULL,
  `dni` CHAR(8) NOT NULL,
  `nacimiento` DATE NOT NULL,
  `direccion` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idPersona`))
;

CREATE TABLE IF NOT EXISTS `Maestro` (
  `idMaestro` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `contrasenha` VARCHAR(200) NOT NULL,
  `configuracion` CHAR(1) NULL DEFAULT 'F',
  `dni` VARCHAR(8) NULL,
  `nombre` VARCHAR(30) NULL,
  `apellidoPaterno` VARCHAR(30) NULL,
  `apellidoMaterno` VARCHAR(30) NULL,
  `celular` VARCHAR(9) NULL,
  `rol` CHAR(2) NULL DEFAULT '2',
  PRIMARY KEY (`idMaestro`))
;

CREATE TABLE IF NOT EXISTS `Empresa` (
  `idEmpresa` INT NOT NULL AUTO_INCREMENT,
  `nombreEmpresa` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `ruc` VARCHAR(45) NOT NULL,
  `rubro` VARCHAR(45) NOT NULL,
  `acronimo` VARCHAR(45) NOT NULL,
  `distrito` VARCHAR(45) NOT NULL,
  `provincia` VARCHAR(45) NOT NULL,
  `departamento` VARCHAR(45) NOT NULL,
  `telefono` CHAR(9) NOT NULL,
  `emailEmpresa` VARCHAR(45) NOT NULL,
  `Maestro_idMaestro` INT NOT NULL,
  PRIMARY KEY (`idEmpresa`),
  INDEX `fk_Empresa_Maestro1_idx` (`Maestro_idMaestro`),
  CONSTRAINT `fk_Empresa_Maestro1`
    FOREIGN KEY (`Maestro_idMaestro`)
    REFERENCES `sistema_seguimiento_bd`.`Maestro` (`idMaestro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `Paciente` (
  `idPaciente` INT NOT NULL,
  `estadoCivil` CHAR(1) NOT NULL,
  `grupoSanguineo` VARCHAR(3) NOT NULL,
  `ocupacion` VARCHAR(20) NOT NULL,
  `Empresa_idEmpresa` INT NOT NULL,
  PRIMARY KEY (`idPaciente`),
  INDEX `fk_Paciente_Empresa1_idx` (`Empresa_idEmpresa`),
  CONSTRAINT `fk_Paciente_Persona`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `sistema_seguimiento_bd`.`Persona` (`idPersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Paciente_Empresa1`
    FOREIGN KEY (`Empresa_idEmpresa`)
    REFERENCES `sistema_seguimiento_bd`.`Empresa` (`idEmpresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `Empleado` (
  `idEmpleado` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `contrasenha` VARCHAR(200) NOT NULL,
  `cargo` VARCHAR(45) NOT NULL,
  `rol` CHAR(1) NULL DEFAULT '3',
  `Empresa_idEmpresa` INT NOT NULL,
  PRIMARY KEY (`idEmpleado`),
  INDEX `fk_Empleado_Empresa1_idx` (`Empresa_idEmpresa`),
  CONSTRAINT `fk_Empleado_Persona1`
    FOREIGN KEY (`idEmpleado`)
    REFERENCES `sistema_seguimiento_bd`.`Persona` (`idPersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Empleado_Empresa1`
    FOREIGN KEY (`Empresa_idEmpresa`)
    REFERENCES `sistema_seguimiento_bd`.`Empresa` (`idEmpresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

CREATE TABLE IF NOT EXISTS `Plan` (
  `idPlan` INT NOT NULL AUTO_INCREMENT,
  `nombrePlan` VARCHAR(45) NOT NULL,
  `descripcion` TEXT(200) NOT NULL,
  `intervaloCitas` INT(2) NOT NULL,
  `duracionConsulta` INT(3) NOT NULL,
  `duracionPlan` INT(2) NOT NULL,
  PRIMARY KEY (`idPlan`))
;

CREATE TABLE IF NOT EXISTS `Plan_has_Empresa` (
  `Plan_idPlan` INT NOT NULL,
  `Empresa_idEmpresa` INT NOT NULL,
  `fechaInicio` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Plan_idPlan`, `Empresa_idEmpresa`),
  INDEX `fk_Plan_has_Empresa_Empresa1_idx` (`Empresa_idEmpresa`),
  INDEX `fk_Plan_has_Empresa_Plan1_idx` (`Plan_idPlan`) ,
  CONSTRAINT `fk_Plan_has_Empresa_Plan1`
    FOREIGN KEY (`Plan_idPlan`)
    REFERENCES `sistema_seguimiento_bd`.`Plan` (`idPlan`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Plan_has_Empresa_Empresa1`
    FOREIGN KEY (`Empresa_idEmpresa`)
    REFERENCES `sistema_seguimiento_bd`.`Empresa` (`idEmpresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
;

#SP DE ERICK (10)

CREATE TABLE IF NOT EXISTS `SuperAdmin` (
  `idSuperAdmin` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `contrasenha` VARCHAR(200) NOT NULL,
  `rol` CHAR(1) NULL DEFAULT '1',
  PRIMARY KEY (`idSuperAdmin`))
;

DROP PROCEDURE IF EXISTS `listarPacientes`;

DELIMITER $$
	CREATE PROCEDURE listarPacientes(idEmpresa INT)
    BEGIN
		SELECT
			pa.idPaciente,
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            pa.estadoCivil,
            pa.grupoSanguineo,
            pa.ocupacion
        FROM Persona pe
        JOIN Paciente pa
			ON pe.idPersona = pa.idPaciente
		WHERE pa.Empresa_idEmpresa = idEmpresa;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `listarPersonal`;

DELIMITER $$
	CREATE PROCEDURE listarPersonal(idEmpresa INT)
    BEGIN
		SELECT
			empl.idEmpleado,
			pe.nombre,
			pe.apellidoPat,
			pe.apellidoMat,
			pe.celular,
			pe.genero,
			pe.dni,
			pe.nacimiento,
			pe.direccion,
			empl.email,
			empl.cargo,
			empl.rol,
			empl.Empresa_idEmpresa
        FROM Persona pe
        JOIN Empleado empl
			ON pe.idPersona = empl.idEmpleado
		WHERE pa.Empresa_idEmpresa = idEmpresa;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `detallePacientes`;

DELIMITER $$
	CREATE PROCEDURE detallePacientes(idEmpresa INT, idPaciente INT)
    BEGIN
		SELECT
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            pa.estadoCivil,
            pa.grupoSanguineo,
            pa.ocupacion
        FROM Persona pe
        JOIN Paciente pa
			ON pe.idPersona = pa.idPaciente
		WHERE pa.Empresa_idEmpresa = idEmpresa AND pa.idPaciente = idPaciente;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `detallePersonal`;

DELIMITER $$
	CREATE PROCEDURE detallePersonal(idEmpresa INT, idEmpleado INT)
    BEGIN
		SELECT
			em.idEmpleado,
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            em.email,
            em.contrasenha,
            em.cargo,
            em.rol,
            em.Empresa_idEmpresa
        FROM Persona pe
        JOIN Empleado em
			ON pe.idPersona = em.idEmpleado
		WHERE em.Empresa_idEmpresa = idEmpresa AND em.idEmpleado = idPersona;
    END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS `verificarPersonal`;

DELIMITER $$
	CREATE PROCEDURE verificarPersonal(idEmpresa INT, dni CHAR(8))
    BEGIN
		SELECT
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            em.email,
            em.contrasenha,
            em.cargo
        FROM Persona pe
        JOIN Empleado em
			ON pe.idPersona = em.idEmpleado
		WHERE em.Empresa_idEmpresa = idEmpresa AND pe.dni = dni;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `registrarPersonal`;

DELIMITER $$
	CREATE PROCEDURE registrarPersonal(
		nombre VARCHAR(30),
		apellidoPat VARCHAR(30),
		apellidoMat VARCHAR(30),
		dni CHAR(8),
		nacimiento DATE,
		celular CHAR(9),
		direccion VARCHAR(100),
		cargo VARCHAR(45),
		email VARCHAR(45),
		genero CHAR(1),
		empresa INT
        )
    BEGIN
		INSERT INTO Persona (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero)
			VALUES (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero);
        
        INSERT INTO  Empleado(idEmpleado, email, contrasenha, cargo, Empresa_idEmpresa)
			VALUES (LAST_INSERT_ID(), email, dni, cargo, empresa);
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `registrarPaciente`;

DELIMITER $$
	CREATE PROCEDURE registrarPaciente(
		nombre VARCHAR(30),
		apellidoPat VARCHAR(30),
		apellidoMat VARCHAR(30),
		dni CHAR(8),
		nacimiento DATE,
		celular CHAR(9),
		direccion VARCHAR(100),
		ocupacion VARCHAR(20),
		email VARCHAR(45),
		genero CHAR(1),
        grupoSanguineo VARCHAR(3),
        estadoCivil CHAR(1),
		empresa INT
        )
    BEGIN
		INSERT INTO Persona (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero)
			VALUES (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero);
        
        INSERT INTO  Paciente(idPaciente, estadoCivil, grupoSanguineo, ocupacion, Empresa_idEmpresa)
			VALUES (LAST_INSERT_ID(), estadoCivil, grupoSanguineo, ocupacion, empresa);
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `verificarPaciente`;

DELIMITER $$
	CREATE PROCEDURE verificarPaciente(dni CHAR(8), idEmpresa INT)
    BEGIN
		SELECT
			pa.idPaciente,
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            pa.estadoCivil,
            pa.grupoSanguineo,
            pa.ocupacion
        FROM Persona pe
        JOIN Paciente pa
			ON pe.idPersona = pa.idPaciente
		WHERE pa.Empresa_idEmpresa = idEmpresa AND pe.dni = dni;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `consultarDatosUsuario`;

DELIMITER $$
	CREATE PROCEDURE consultarDatosUsuario(email VARCHAR(45), contrasenha VARCHAR(200))
    BEGIN
		CASE
			WHEN email IN (SELECT email FROM Empleado) AND contrasenha IN (SELECT contrasenha FROM Empleado) THEN
				SELECT * FROM Empleado e WHERE e.email = email AND e.contrasenha = contrasenha;
			WHEN email IN (SELECT email FROM Maestro) AND contrasenha IN (SELECT contrasenha FROM Maestro) THEN
				SELECT * FROM Maestro m WHERE m.email = email AND m.contrasenha = contrasenha;
			WHEN email IN (SELECT email FROM SuperAdmin) AND contrasenha IN (SELECT contrasenha FROM SuperAdmin) THEN
				select * from SuperAdmin sa WHERE sa.email = email AND sa.contrasenha = contrasenha;
			ELSE
				SELECT NULL;
		END CASE;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `solicitarPassword`;

DELIMITER $$
	CREATE PROCEDURE solicitarPassword(email VARCHAR(45))
    BEGIN
		CASE
			WHEN email IN (SELECT email FROM Empleado) THEN
				SELECT e.contrasenha FROM Empleado e WHERE e.email = email;
			WHEN email IN (SELECT email FROM Maestro) THEN
				SELECT m.contrasenha FROM Maestro m WHERE m.email = email;
			WHEN email IN (SELECT email FROM SuperAdmin) THEN
				SELECT sa.contrasenha FROM SuperAdmin sa WHERE sa.email = email;
			ELSE
				SELECT NULL;
		END CASE;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `guardarEmpresa`;

DELIMITER $$
	CREATE PROCEDURE guardarEmpresa(
		ruc VARCHAR(45),
        acronimo VARCHAR(45),
		nombreEmpresa VARCHAR(45),
        rubro VARCHAR(45),
        direccion VARCHAR(45),
        distrito VARCHAR(45),
        provincia VARCHAR(45),
		departamento VARCHAR(45),
		telefono CHAR(9),
		email VARCHAR(45),
		Maestro_idMaestro INT
        )
    BEGIN
		INSERT INTO Empresa (ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, emailEmpresa, Maestro_idMaestro)
			VALUES (ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, Maestro_idMaestro);
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `mostrarEmpresa`;

DELIMITER $$
	CREATE PROCEDURE mostrarEmpresa(idEmpresa INT)
    BEGIN
		SELECT
			e.ruc,
			e.acronimo,
			e.nombreEmpresa,
			e.rubro,
			e.direccion,
			e.distrito,
			e.provincia,
			e.departamento,
			e.telefono,
			e.emailEmpresa
		FROM Empresa e
        WHERE e.idEmpresa = idEmpresa;
    END$$
DELIMITER ;

# SP DE JULIO (3)

DROP PROCEDURE IF EXISTS `guardarPlan`;

DELIMITER $$
	CREATE PROCEDURE `guardarPlan`(
		nombrePlan varchar(45),
		descripcion text(200),
		intervaloCitas int(2),
		duracionConsulta int(3),
		duracionPlan int(2)
	)
	BEGIN
		INSERT INTO Plan (nombrePlan, descripcion, intervaloCitas, duracionConsulta, duracionPlan)
		VALUES (nombrePlan, descripcion, intervaloCitas, duracionConsulta, duracionPlan);
		
	END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `devolverCronograma`;

DELIMITER $$
	CREATE PROCEDURE `devolverCronograma`(
		idPlan INT
	)
	BEGIN
		SELECT 
			p.nombrePlan, 
			p.descripcion, 
			p.intervaloCitas, 
			p.duracionConsulta,
			p.duracionPlan 
		FROM Plan p 
		WHERE p.idPlan = idPlan;
	END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `mostrarCronogramasDisponibles`;

DELIMITER $$
	CREATE PROCEDURE `mostrarCronogramasDisponibles`()
	BEGIN
		SELECT 
			idPlan,
			nombrePlan, 
			descripcion, 
			intervaloCitas, 
			duracionConsulta, 
			duracionPlan 
        FROM Plan;
	END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS `listarPersonal`;

DELIMITER $$
	CREATE PROCEDURE listarPersonal(idEmpresa INT)
    BEGIN
		SELECT
			empl.idEmpleado,
			pe.nombre,
			pe.apellidoPat,
			pe.apellidoMat,
			pe.celular,
			pe.genero,
			pe.dni,
			pe.nacimiento,
			pe.direccion,
			empl.email,
			empl.cargo,
			empl.rol,
			empl.Empresa_idEmpresa
        FROM Persona pe
        JOIN Empleado empl
			ON pe.idPersona = empl.idEmpleado
		WHERE empl.Empresa_idEmpresa = idEmpresa;
    END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `completarDatosAdmin`;
DELIMITER $$
CREATE PROCEDURE `completarDatosAdmin`(
	idMaestro INT(11), 
	dni VARCHAR(8),
    nombre VARCHAR(30),
    apellidoPaterno VARCHAR(30),
    apellidoMaterno VARCHAR(30),
    celular VARCHAR(9)
)
BEGIN
	UPDATE Maestro M
    SET M.dni = dni,
    M.nombre = nombre,
    M.apellidoPaterno = apellidoPaterno,
    M.apellidoMaterno = apellidoMaterno,
    M.celular = celular
    WHERE M.idMaestro = idMaestro;
	
END$$
DELIMITER ;

-- Insercion de datos para usuarios SuperAdmin y Maestro(administrador de un empresa)
INSERT INTO `SuperAdmin` (`email`, `contrasenha`, `rol`) VALUES (`superadmin@empresa.com`, '$2b$10$fcNR5L1wWYmr4ckhVXMkKuBSwVEB/ZzxCrO8n6Gac.bg68Pn4ebZC', '1');

INSERT INTO `Maestro` (`email`, `contrasenha`, `dni` , `nombre`, `apellidoPaterno`, `apellidoMaterno`, `celular`) VALUES (`maestro@empresa.com`, '$2b$10$fcNR5L1wWYmr4ckhVXMkKuBSwVEB/ZzxCrO8n6Gac.bg68Pn4ebZC', '45678985', 'Anthony', 'Perez'. 'Matos', '987456789')