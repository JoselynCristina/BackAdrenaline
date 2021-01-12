-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-09-2020 a las 01:20:41
-- Versión del servidor: 10.4.13-MariaDB
-- Versión de PHP: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_seguimiento_bd`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`practica`@`localhost` PROCEDURE `buscarPaciente` (`dni` CHAR(8))  BEGIN
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
		WHERE pe.dni = dni;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `cantidadConsultas` (`idPaciente` INT)  BEGIN
		SELECT 
			pa.numeroConsulta,
			p.duracionPlan
        FROM Paciente pa
        JOIN Plan p
			ON pa.Plan_idPlan = p.idPlan
        WHERE pa.idPaciente = idPaciente;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `cantidadPacientes` (`idPlan` INT)  BEGIN
    DECLARE cantidadPacientes INT;
    SELECT COUNT(pa.idPaciente) INTO cantidadPacientes
    FROM Paciente pa
    WHERE pa.Plan_idPlan = idPlan;

		SELECT IFNULL(cantidadPacientes,0) AS cantidadPacientes, idPlan;

    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `completarDatosAdmin` (`idMaestro` INT(11), `dni` VARCHAR(8), `nombre` VARCHAR(30), `apellidoPaterno` VARCHAR(30), `apellidoMaterno` VARCHAR(30), `celular` VARCHAR(9))  BEGIN
		UPDATE Maestro m
		SET 
			m.dni = dni,
			m.nombre = nombre,
			m.apellidoPaterno = apellidoPaterno,
			m.apellidoMaterno = apellidoMaterno,
			m.celular = celular
		WHERE m.idMaestro = idMaestro;	
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `consultarDatosUsuario` (`email` VARCHAR(45), `contrasenha` VARCHAR(200))  BEGIN
		DECLARE vidEmpresa INT;
		DECLARE vidMaestro INT;

		SELECT  c.idMaestro INTO vidMaestro FROM Maestro c WHERE c.email = email;
		SELECT  d.idEmpresa INTO vidEmpresa FROM Empresa d WHERE d.Maestro_idMaestro = vidMaestro;

		IF(SELECT count(m.email) FROM Maestro m WHERE m.email = email >0) THEN
			SELECT m.*, vidEmpresa, email FROM Maestro m WHERE m.email = email;

		ELSEIF (SELECT count(e.email) FROM Empleado e WHERE e.email = email >0) THEN
			SELECT p.*, e.*, vidEmpresa, email FROM Empleado e JOIN Persona p ON e.idEmpleado = p.idPersona WHERE e.email = email;

		ELSEIF (SELECT count(sa.email) FROM SuperAdmin sa WHERE sa.email = email >0) THEN
			SELECT sa.* FROM SuperAdmin sa WHERE sa.email = email;
		ELSE
			SELECT NULL;
		END IF;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `consultarEmpresa` (`idPaciente` INT, `idEmpleado` INT)  BEGIN
		DECLARE emailEE VARCHAR(45);
        
        SELECT emailEmpresa 
        INTO emailEE 
        FROM Empleado em
        JOIN Empresa e
			ON em.Empresa_idEmpresa = e.idEmpresa
		WHERE em.idEmpleado = idEmpleado;
    
		SELECT
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pa.email,
            emailEE
        FROM Consulta c
        JOIN Paciente pa
			ON c.Paciente_idPaciente = pa.idPaciente
		JOIN Persona pe
			ON pa.idPaciente = pe.idPersona
		WHERE pa.idPaciente = idPaciente;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `datosCalculoIteracion` (`idEmpresa` INT, `idPlan` INT)  BEGIN
		DECLARE intervaloConsulta INT(2);
        DECLARE duracionPlan INT(2);
        DECLARE citasAlDia INT(1);
        DECLARE cantidadEmpleados INT;
        DECLARE cantidadPacientes INT;
        
        SELECT p.intervaloConsulta, p.duracionPlan 
        INTO intervaloConsulta, duracionPlan 
        FROM Plan p
		    WHERE p.idPlan = idPlan;
        
		SELECT e.citasAlDia
		INTO citasAlDia
		FROM Empresa e
		WHERE e.idEmpresa = idEmpresa;
       
		SELECT COUNT(em.idEmpleado)
    INTO cantidadEmpleados
		FROM Empleado em;
       
		SELECT COUNT(pa.idPaciente)
    INTO cantidadPacientes
		FROM Paciente pa
		JOIN Plan p
			ON pa.Plan_idPlan = p.idPlan
        WHERE p.idPlan = idPlan;

		SELECT intervaloConsulta, duracionPlan, citasAlDia, cantidadEmpleados, cantidadPacientes;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `datosEncuesta` (`idEmpresa` INT)  BEGIN
		SELECT *
        FROM Formulario f
        WHERE f.Empresa_idEmpresa = idEmpresa;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `detallePacientes` (`idEmpresa` INT, `idPaciente` INT)  BEGIN
		SELECT
			pe.nombre,
            pe.apellidoPat,
            pe.apellidoMat,
            pe.celular,
            pe.genero,
            pe.dni,
            pe.nacimiento,
            pe.direccion,
            pa.email,
            pa.estadoCivil,
            pa.grupoSanguineo,
            pa.ocupacion,
            pa.numeroConsulta,
            pa.estadoConsultaCompletado
        FROM Persona pe
        JOIN Paciente pa
			ON pe.idPersona = pa.idPaciente
		WHERE pa.Empresa_idEmpresa = idEmpresa AND pa.idPaciente = idPaciente;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `detallePersonal` (`idEmpresa` INT, `idEmpleado` INT)  BEGIN
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
		WHERE em.Empresa_idEmpresa = idEmpresa AND em.idEmpleado = idEmpleado;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `devolverCronograma` (IN `idPlan` INT)  BEGIN
		SELECT 
			p.nombrePlan,
            p.idPlan,
			p.descripcion, 
			p.intervaloConsulta, 
			p.duracionPlan 
		FROM Plan p 
		WHERE p.idPlan = idPlan;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `editarCronograma` (IN `idPlan` INT, IN `nombrePlan` VARCHAR(45), IN `descripcion` TEXT, IN `duracionPlan` INT(2), IN `intervaloConsulta` INT(2))  BEGIN
		UPDATE Plan p
			SET
                p.nombrePlan = nombrePlan,
                p.descripcion = descripcion,
                p.duracionPlan = duracionPlan,
                p.intervaloConsulta = intervaloConsulta
			WHERE p.idPlan = idPlan;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `editarEmpresa` (`idEmpresa` INT, `ruc` VARCHAR(45), `acronimo` VARCHAR(45), `nombreEmpresa` VARCHAR(45), `rubro` VARCHAR(45), `direccion` VARCHAR(45), `distrito` VARCHAR(45), `provincia` VARCHAR(45), `departamento` VARCHAR(45), `telefono` CHAR(9), `email` VARCHAR(45), `citasAlDia` INT(1))  BEGIN
		UPDATE Empresa e
			SET 
				e.ruc = ruc, 
                e.acronimo = acronimo, 
                e.nombreEmpresa = nombreEmpresa, 
                e.rubro = rubro, 
                e.direccion = direccion, 
                e.distrito = distrito, 
                e.provincia = provincia, 
                e.departamento = departamento, 
                e.telefono = telefono, 
                e.emailEmpresa = email, 
                e.citasAlDia = citasAlDia
			WHERE e.idEmpresa = idEmpresa;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `editarPaciente` (IN `nombre` VARCHAR(30), IN `apellidoPat` VARCHAR(30), IN `apellidoMat` VARCHAR(30), IN `dni` CHAR(8), IN `nacimiento` DATE, IN `celular` CHAR(9), IN `direccion` VARCHAR(100), IN `ocupacion` VARCHAR(20), IN `email` VARCHAR(45), IN `genero` CHAR(1), IN `grupoSanguineo` VARCHAR(3), IN `estadoCivil` CHAR(1), IN `idPaciente` INT)  BEGIN
		UPDATE Persona pe
			SET 
				pe.nombre = nombre, 
                pe.apellidoPat = apellidoPat, 
                pe.apellidoMat = apellidoMat, 
                pe.dni = dni, 
                pe.nacimiento = nacimiento, 
                pe.celular = celular, 
                pe.direccion = direccion, 
                pe.genero = genero
			WHERE pe.idPersona = idPaciente;
        
        UPDATE Paciente pa
			SET pa.estadoCivil = estadoCivil, 
				pa.grupoSanguineo =grupoSanguineo, 
                pa.ocupacion = ocupacion,
                pa.email = email,
                pa.celular = celular
                /*pa.genero = genero*/
			WHERE pa.idPaciente = idPaciente;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `editarPersonal` (`nombre` VARCHAR(30), `apellidoPat` VARCHAR(30), `apellidoMat` VARCHAR(30), `dni` CHAR(8), `nacimiento` DATE, `celular` CHAR(9), `direccion` VARCHAR(100), `cargo` VARCHAR(45), `email` VARCHAR(45), `encriptPassword` VARCHAR(45), `genero` CHAR(1), `idEmpleado` INT)  BEGIN
		UPDATE Persona pe
			SET 
				pe.nombre = nombre, 
                pe.apellidoPat = apellidoPat, 
                pe.apellidoMat = apellidoMat, 
                pe.dni = dni, 
                pe.nacimiento = nacimiento, 
                pe.celular = celular, 
                pe.direccion = direccion, 
                pe.genero = genero
			WHERE pe.idPersona = idEmpleado;
        
        UPDATE Empleado em
			SET 
				em.cargo = cargo, 
				em.email =email, 
                em.contrasenha = encriptPassword
			WHERE em.idEmpleado = idEmpleado;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `guardarEmpresa` (`ruc` VARCHAR(45), `acronimo` VARCHAR(45), `nombreEmpresa` VARCHAR(45), `rubro` VARCHAR(45), `direccion` VARCHAR(45), `distrito` VARCHAR(45), `provincia` VARCHAR(45), `departamento` VARCHAR(45), `telefono` CHAR(9), `email` VARCHAR(45), `citasAlDia` INT(1), `Maestro_idMaestro` INT)  BEGIN
		INSERT INTO Empresa (ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, emailEmpresa, citasAlDia, Maestro_idMaestro)
			VALUES (ruc, acronimo, nombreEmpresa, rubro, direccion, distrito, provincia, departamento, telefono, email, citasAlDia, Maestro_idMaestro);
		UPDATE Maestro SET configuracion = 'V' WHERE idMaestro = Maestro_idMaestro; 
		SELECT Max(idEmpresa) idEmpresa FROM Empresa;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `guardarPlan` (`nombrePlan` VARCHAR(45), `descripcion` TEXT(200), `duracionPlan` INT(2), `intervaloConsulta` INT(2))  BEGIN
		INSERT INTO Plan (nombrePlan, descripcion, duracionPlan, intervaloConsulta)
			VALUES (nombrePlan, descripcion, duracionPlan, intervaloConsulta);
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `listarConsultasEmpleado` (`idEmpleado` INT)  BEGIN
		SELECT c.*, pa.*
        FROM Consulta c JOIN Paciente pa ON c.Paciente_idPaciente = pa.idPaciente JOIN Persona p ON pa.idPaciente = p.idPersona
        WHERE c.Empleado_idEmpleado = idEmpleado;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `listarConsultasPaciente` (`idPaciente` INT)  BEGIN
		SELECT c.*, pa.*
        FROM consulta c JOIN empleado e ON c.Empleado_idEmpleado = e.idEmpleado JOIN persona pa ON e.idEmpleado = pa.idPersona
        WHERE c.Paciente_idPaciente = idPaciente;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `listarPacientes` (`idEmpresa` INT)  BEGIN
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
			pa.ocupacion,
      pa.estadoConsultaCompletado
		FROM Persona pe
		JOIN Paciente pa
			ON pe.idPersona = pa.idPaciente
		WHERE pa.Empresa_idEmpresa = idEmpresa;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `listarPersonal` (`idEmpresa` INT)  BEGIN
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

CREATE DEFINER=`practica`@`localhost` PROCEDURE `mostrarConsulta` (`idConsulta` INT)  BEGIN 
		SELECT
			pe.nombre nombrePaciente,
            pe.apellidoPat apellidoPatPaciente,
            pe.apellidoMat apellidoMatPaciente,
            p.nombre nombreEmpleado,
            p.apellidoPat apellidoPatEmpleado,
            p.apellidoMat apellidoMatEmpleado,
            c.comentarios,
            c.recomendaciones,
            c.estado
        FROM Consulta c
        JOIN Paciente pa
			ON c.Paciente_idPaciente = pa.idPaciente
		JOIN Empleado em
			ON c.Empleado_idEmpleado = em.idEmpleado
		JOIN Persona pe
			ON pe.idPersona = pa.idPaciente
		JOIN Persona p
			ON p.idPersona = em.idEmpleado
        WHERE c.idConsulta = idConsulta;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `mostrarCronogramasDisponibles` ()  BEGIN
		SELECT 
			idPlan,
			nombrePlan, 
			descripcion, 
      duracionPlan,
			intervaloConsulta
        FROM Plan;
	END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `mostrarEmpresa` (`idEmpresa` INT)  BEGIN
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

CREATE DEFINER=`practica`@`localhost` PROCEDURE `registrarConsulta` (`comentarios` TEXT(300), `recomendaciones` TEXT(300), `estado` CHAR(1), `idPaciente` INT, `idEmpleado` INT)  BEGIN
		-- Extrayendo el numero de consultas
		-- DECLARE nConsultas INT;
		-- SELECT  COUNT(idConsulta) + 1 INTO nConsultas FROM Consulta c WHERE c.Paciente_idPaciente = idPaciente;
        
        INSERT INTO Consulta (comentarios, recomendaciones, estado, Empleado_idEmpleado, Paciente_idPaciente) 
			VALUES (comentarios, recomendaciones, estado, idEmpleado, idPaciente);
            
		UPDATE Paciente p
        SET numeroConsulta = numeroConsulta + 1
        WHERE p.idPaciente = idPaciente;

        SELECT LAST_INSERT_ID() AS idConsulta;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `registrarEncuesta` (`puntajePregunta1` INT(1), `puntajePregunta2` INT(1), `puntajePregunta3` INT(1), `puntajePregunta4` INT(1), `puntajePregunta5` INT(1), `observacion` TEXT, `idEmpresa` INT, `idPaciente` INT)  BEGIN
		INSERT INTO Formulario (puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, Empresa_idEmpresa, Paciente_idPaciente)
			VALUES (puntajePregunta1, puntajePregunta2, puntajePregunta3, puntajePregunta4, puntajePregunta5, observacion, idEmpresa, idPaciente);
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `registrarPaciente` (`nombre` VARCHAR(30), `apellidoPat` VARCHAR(30), `apellidoMat` VARCHAR(30), `dni` CHAR(8), `nacimiento` DATE, `celular` CHAR(9), `direccion` VARCHAR(100), `ocupacion` VARCHAR(20), `email` VARCHAR(45), `genero` CHAR(1), `grupoSanguineo` VARCHAR(3), `estadoCivil` CHAR(1), `empresa` INT, `idplan` INT)  BEGIN
		INSERT INTO Persona (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero)
			VALUES (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero);
        
        INSERT INTO  Paciente(idPaciente, estadoCivil, grupoSanguineo, ocupacion, email, celular, Empresa_idEmpresa, Plan_idPlan)
			VALUES (LAST_INSERT_ID(), estadoCivil, grupoSanguineo, ocupacion, email, celular, empresa, idplan);
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `registrarPersonal` (`nombre` VARCHAR(30), `apellidoPat` VARCHAR(30), `apellidoMat` VARCHAR(30), `dni` CHAR(8), `nacimiento` DATE, `celular` CHAR(9), `direccion` VARCHAR(100), `cargo` VARCHAR(45), `email` VARCHAR(45), `contrasenha` VARCHAR(100), `genero` CHAR(1), `empresa` INT)  BEGIN
		INSERT INTO Persona (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero)
			VALUES (nombre, apellidoPat, apellidoMat, dni, nacimiento, celular, direccion, genero);
        
        INSERT INTO  Empleado(idEmpleado, email, contrasenha, cargo, Empresa_idEmpresa)
			VALUES (LAST_INSERT_ID(), email, contrasenha, cargo, empresa);
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `solicitarPassword` (`email` VARCHAR(45))  BEGIN
		IF(SELECT count(sp.email) FROM SuperAdmin sp WHERE sp.email = email >0) THEN
			SELECT sp.contrasenha FROM SuperAdmin sp WHERE sp.email = email;
        ELSEIF (SELECT count(m.email) FROM Maestro m WHERE m.email = email >0) THEN
			SELECT m.contrasenha FROM Maestro m WHERE m.email = email;
        ELSEIF (SELECT count(e.email) FROM Empleado e WHERE e.email = email >0) THEN
			SELECT e.contrasenha FROM Empleado e WHERE e.email = email;
        ELSE
        	SELECT NULL;
        END IF;
    END$$

CREATE DEFINER=`practica`@`localhost` PROCEDURE `verificarPaciente` (`dni` CHAR(8), `idEmpresa` INT)  BEGIN
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

CREATE DEFINER=`practica`@`localhost` PROCEDURE `verificarPersonal` (`idEmpresa` INT, `dni` CHAR(8))  BEGIN
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consulta`
--

CREATE TABLE `consulta` (
  `idConsulta` int(11) NOT NULL,
  `comentarios` text NOT NULL,
  `recomendaciones` text NOT NULL,
  `estado` char(1) NOT NULL,
  `fechaConsulta` datetime DEFAULT current_timestamp(),
  `Empleado_idEmpleado` int(11) NOT NULL,
  `Paciente_idPaciente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `idEmpleado` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contrasenha` varchar(100) NOT NULL,
  `cargo` varchar(45) NOT NULL,
  `rol` char(1) DEFAULT '3',
  `asignado` char(1) DEFAULT 'F',
  `Empresa_idEmpresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`idEmpleado`, `email`, `contrasenha`, `cargo`, `rol`, `asignado`, `Empresa_idEmpresa`) VALUES
(2, 'homeroStark@empresa.com', '$2b$10$ZouYcr95TFWOWWrFXbIyWeN5sMXqfC5cOzbD99', 'Doctor', '3', 'F', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `idEmpresa` int(11) NOT NULL,
  `nombreEmpresa` varchar(45) NOT NULL,
  `direccion` varchar(45) NOT NULL,
  `ruc` varchar(45) NOT NULL,
  `rubro` varchar(45) NOT NULL,
  `acronimo` varchar(45) NOT NULL,
  `distrito` varchar(45) NOT NULL,
  `provincia` varchar(45) NOT NULL,
  `departamento` varchar(45) NOT NULL,
  `telefono` char(9) NOT NULL,
  `emailEmpresa` varchar(45) NOT NULL,
  `diasLaborales` int(1) DEFAULT NULL,
  `citasAlDia` int(1) DEFAULT NULL,
  `Maestro_idMaestro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`idEmpresa`, `nombreEmpresa`, `direccion`, `ruc`, `rubro`, `acronimo`, `distrito`, `provincia`, `departamento`, `telefono`, `emailEmpresa`, `diasLaborales`, `citasAlDia`, `Maestro_idMaestro`) VALUES
(1, 'EJM-Test5 - cambio', 'calle 323', '2012554222', 'Marketing', 'EJM5', 'Cercado', 'Lima', 'Lima', '42354687', 'empresa1_cambio@test.com', NULL, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formulario`
--

CREATE TABLE `formulario` (
  `idFormulario` int(11) NOT NULL,
  `puntajePregunta1` int(1) NOT NULL,
  `puntajePregunta2` int(1) NOT NULL,
  `puntajePregunta3` int(1) NOT NULL,
  `puntajePregunta4` int(1) NOT NULL,
  `puntajePregunta5` int(1) NOT NULL,
  `observacion` text DEFAULT '',
  `Paciente_idPaciente` int(11) NOT NULL,
  `Empresa_idEmpresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `formulario`
--

INSERT INTO `formulario` (`idFormulario`, `puntajePregunta1`, `puntajePregunta2`, `puntajePregunta3`, `puntajePregunta4`, `puntajePregunta5`, `observacion`, `Paciente_idPaciente`, `Empresa_idEmpresa`) VALUES
(2, 1, 2, 3, 4, 2, 'ejm-observacion', 3, 1),
(3, 3, 1, 4, 2, 4, '', 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `maestro`
--

CREATE TABLE `maestro` (
  `idMaestro` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contrasenha` varchar(100) NOT NULL,
  `configuracion` char(1) DEFAULT 'F',
  `dni` varchar(8) DEFAULT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `apellidoPaterno` varchar(30) DEFAULT NULL,
  `apellidoMaterno` varchar(30) DEFAULT NULL,
  `celular` varchar(9) DEFAULT NULL,
  `rol` char(2) DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `maestro`
--

INSERT INTO `maestro` (`idMaestro`, `email`, `contrasenha`, `configuracion`, `dni`, `nombre`, `apellidoPaterno`, `apellidoMaterno`, `celular`, `rol`) VALUES
(1, 'maestro1@empresa.com', '$2b$10$fcNR5L1wWYmr4ckhVXMkKuBSwVEB/ZzxCrO8n6Gac.bg68Pn4ebZC', 'V', NULL, NULL, NULL, NULL, NULL, '2'),
(2, 'maestro2@empresa.com', '$2b$10$fcNR5L1wWYmr4ckhVXMkKuBSwVEB/ZzxCrO8n6Gac.bg68Pn4ebZC', 'F', NULL, NULL, NULL, NULL, NULL, '2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `idPaciente` int(11) NOT NULL,
  `estadoCivil` char(1) NOT NULL,
  `grupoSanguineo` varchar(3) NOT NULL,
  `ocupacion` varchar(20) NOT NULL,
  `atendiendo` char(1) DEFAULT 'F',
  `email` varchar(45) DEFAULT NULL,
  `celular` char(9) DEFAULT NULL,
  `numeroConsulta` int(2) DEFAULT 0,
  `Empresa_idEmpresa` int(11) NOT NULL,
  `estadoConsultaCompletado` INT(1) NULL DEFAULT 0,
  `Plan_idPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`idPaciente`, `estadoCivil`, `grupoSanguineo`, `ocupacion`, `atendiendo`, `email`, `celular`, `numeroConsulta`, `Empresa_idEmpresa`, `Plan_idPlan`) VALUES
(3, 's', 'A+', 'ingeniero', 'F', 'elon@musk.com', '96589652', 0, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `idPersona` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellidoPat` varchar(30) NOT NULL,
  `apellidoMat` varchar(30) NOT NULL,
  `celular` char(9) NOT NULL,
  `genero` char(1) NOT NULL,
  `dni` char(8) NOT NULL,
  `nacimiento` date NOT NULL,
  `direccion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`idPersona`, `nombre`, `apellidoPat`, `apellidoMat`, `celular`, `genero`, `dni`, `nacimiento`, `direccion`) VALUES
(1, 'Piter', 'Demente', 'Parker', '957654321', 'M', '52645678', '1985-10-12', 'calle 1230'),
(2, 'Flash', 'Demente', 'Allen', '957654321', 'M', '12645678', '1985-10-12', 'calle 1230'),
(3, 'Fredycambio', 'Mercury', 'cruguer', '96589652', 'M', '85674959', '1985-10-18', 'calle ejemplo2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan`
--

CREATE TABLE `plan` (
  `idPlan` int(11) NOT NULL,
  `nombrePlan` varchar(45) NOT NULL,
  `descripcion` text NOT NULL,
  `duracionPlan` int(2) NOT NULL,
  `intervaloConsulta` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `plan`
--

INSERT INTO `plan` (`idPlan`, `nombrePlan`, `descripcion`, `duracionPlan`, `intervaloConsulta`) VALUES
(1, 'virus T', "el virus a mutado, no hay tratamiento, solo esperar a lo peor :\'v", 8, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_has_empresa`
--

CREATE TABLE `plan_has_empresa` (
  `Plan_idPlan` int(11) NOT NULL,
  `Empresa_idEmpresa` int(11) NOT NULL,
  `fechaInicio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `superadmin`
--

CREATE TABLE `superadmin` (
  `idSuperAdmin` int(11) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contrasenha` varchar(100) NOT NULL,
  `rol` char(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `superadmin`
--

INSERT INTO `superadmin` (`idSuperAdmin`, `email`, `contrasenha`, `rol`) VALUES
(1, 'superadmin@empresa.com', '$2b$10$fcNR5L1wWYmr4ckhVXMkKuBSwVEB/ZzxCrO8n6Gac.bg68Pn4ebZC', '1');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `consulta`
--
ALTER TABLE `consulta`
  ADD PRIMARY KEY (`idConsulta`),
  ADD KEY `fk_Consulta_Empleado1_idx` (`Empleado_idEmpleado`),
  ADD KEY `fk_Consulta_Paciente1_idx` (`Paciente_idPaciente`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`idEmpleado`),
  ADD KEY `fk_Empleado_Empresa1_idx` (`Empresa_idEmpresa`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`idEmpresa`),
  ADD KEY `fk_Empresa_Maestro1_idx` (`Maestro_idMaestro`);

--
-- Indices de la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD PRIMARY KEY (`idFormulario`),
  ADD KEY `fk_Formulario_Paciente1_idx` (`Paciente_idPaciente`),
  ADD KEY `fk_Formulario_Empresa1_idx` (`Empresa_idEmpresa`);

--
-- Indices de la tabla `maestro`
--
ALTER TABLE `maestro`
  ADD PRIMARY KEY (`idMaestro`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`idPaciente`),
  ADD KEY `fk_Paciente_Empresa1_idx` (`Empresa_idEmpresa`),
  ADD KEY `fk_Paciente_Plan1_idx` (`Plan_idPlan`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`idPersona`);

--
-- Indices de la tabla `plan`
--
ALTER TABLE `plan`
  ADD PRIMARY KEY (`idPlan`);

--
-- Indices de la tabla `plan_has_empresa`
--
ALTER TABLE `plan_has_empresa`
  ADD PRIMARY KEY (`Plan_idPlan`,`Empresa_idEmpresa`),
  ADD KEY `fk_Plan_has_Empresa_Empresa1_idx` (`Empresa_idEmpresa`),
  ADD KEY `fk_Plan_has_Empresa_Plan1_idx` (`Plan_idPlan`);

--
-- Indices de la tabla `superadmin`
--
ALTER TABLE `superadmin`
  ADD PRIMARY KEY (`idSuperAdmin`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `consulta`
--
ALTER TABLE `consulta`
  MODIFY `idConsulta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `idEmpresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `formulario`
--
ALTER TABLE `formulario`
  MODIFY `idFormulario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `maestro`
--
ALTER TABLE `maestro`
  MODIFY `idMaestro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `idPersona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `plan`
--
ALTER TABLE `plan`
  MODIFY `idPlan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `superadmin`
--
ALTER TABLE `superadmin`
  MODIFY `idSuperAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `consulta`
--
ALTER TABLE `consulta`
  ADD CONSTRAINT `fk_Consulta_Empleado1` FOREIGN KEY (`Empleado_idEmpleado`) REFERENCES `empleado` (`idEmpleado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Consulta_Paciente1` FOREIGN KEY (`Paciente_idPaciente`) REFERENCES `paciente` (`idPaciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `fk_Empleado_Empresa1` FOREIGN KEY (`Empresa_idEmpresa`) REFERENCES `empresa` (`idEmpresa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Empleado_Persona1` FOREIGN KEY (`idEmpleado`) REFERENCES `persona` (`idPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `fk_Empresa_Maestro1` FOREIGN KEY (`Maestro_idMaestro`) REFERENCES `maestro` (`idMaestro`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `formulario`
--
ALTER TABLE `formulario`
  ADD CONSTRAINT `fk_Formulario_Empresa1` FOREIGN KEY (`Empresa_idEmpresa`) REFERENCES `empresa` (`idEmpresa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Formulario_Paciente1` FOREIGN KEY (`Paciente_idPaciente`) REFERENCES `paciente` (`idPaciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `fk_Paciente_Empresa1` FOREIGN KEY (`Empresa_idEmpresa`) REFERENCES `empresa` (`idEmpresa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Paciente_Persona` FOREIGN KEY (`idPaciente`) REFERENCES `persona` (`idPersona`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Paciente_Plan1` FOREIGN KEY (`Plan_idPlan`) REFERENCES `plan` (`idPlan`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `plan_has_empresa`
--
ALTER TABLE `plan_has_empresa`
  ADD CONSTRAINT `fk_Plan_has_Empresa_Empresa1` FOREIGN KEY (`Empresa_idEmpresa`) REFERENCES `empresa` (`idEmpresa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Plan_has_Empresa_Plan1` FOREIGN KEY (`Plan_idPlan`) REFERENCES `plan` (`idPlan`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DELIMITER $$
  CREATE TRIGGER consultas_after_insert
    AFTER INSERT ON Consulta
    FOR EACH ROW
  BEGIN
    DECLARE cantidadMaximaConsulta INT(2);
    DECLARE numConsulta INT(2);

    SELECT duracionPlan 
      INTO cantidadMaximaConsulta 
      FROM Plan 
      WHERE idPlan = (SELECT Plan_idPlan FROM Paciente WHERE idPaciente = NEW.Paciente_idPaciente);

    SELECT numConsulta INTO numConsulta FROM Paciente WHERE Paciente_idPaciente = NEW.Paciente_idPaciente;

    IF numConsulta = cantidadMaximaConsulta THEN
      UPDATE Paciente pa
        SET pa.estadoConsultaCompletado = 1
        WHERE pa.idPaciente = NEW.Paciente_idPaciente;

    END IF;
  END$$
DELIMITER;
