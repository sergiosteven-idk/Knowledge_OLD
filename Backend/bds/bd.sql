CREATE DATABASE IF NOT EXISTS knowledge_sql
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE knowledge_sql;

-- =====================================
-- 1️⃣ Usuarios / miembros
-- =====================================
CREATE TABLE Miembro (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('user','admin') DEFAULT 'user',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- 2️⃣ Roles y permisos
-- =====================================
CREATE TABLE Rol (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(100) NOT NULL,
  descripcion TEXT
);

CREATE TABLE Permiso (
  id_permiso INT AUTO_INCREMENT PRIMARY KEY,
  accion VARCHAR(100) NOT NULL,
  recurso VARCHAR(100) NOT NULL
);

CREATE TABLE Rol_Permiso (
  id_rol INT,
  id_permiso INT,
  PRIMARY KEY (id_rol, id_permiso),
  FOREIGN KEY (id_rol) REFERENCES Rol(id_rol) ON DELETE CASCADE,
  FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso) ON DELETE CASCADE
);

CREATE TABLE Usuario_Rol (
  id_usuario INT,
  id_rol INT,
  PRIMARY KEY (id_usuario, id_rol),
  FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_rol) REFERENCES Rol(id_rol) ON DELETE CASCADE
);

-- =====================================
-- 3️⃣ Cursos, módulos, contenidos
-- (contenidos detallados están en Mongo)
-- =====================================
CREATE TABLE Curso (
  id_curso INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  nivel VARCHAR(50),
  fecha_inicio DATE,
  fecha_fin DATE
);

CREATE TABLE Modulo (
  id_modulo INT AUTO_INCREMENT PRIMARY KEY,
  nombre_modulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  id_curso INT,
  FOREIGN KEY (id_curso) REFERENCES Curso(id_curso) ON DELETE CASCADE
);

-- Relación con Mongo (contenido se guarda allá)
CREATE TABLE Modulo_Contenido (
  id_modulo INT,
  id_contenido_mongo VARCHAR(24), -- ID ObjectId de Mongo
  PRIMARY KEY (id_modulo, id_contenido_mongo),
  FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo) ON DELETE CASCADE
);

-- =====================================
-- 4️⃣ Evaluaciones y preguntas
-- =====================================
CREATE TABLE Evaluacion (
  id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50),
  id_modulo INT,
  FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo) ON DELETE CASCADE
);

CREATE TABLE Pregunta (
  id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
  texto TEXT NOT NULL,
  tipo VARCHAR(50),
  opciones TEXT,
  respuesta_correcta TEXT,
  id_evaluacion INT,
  FOREIGN KEY (id_evaluacion) REFERENCES Evaluacion(id_evaluacion) ON DELETE CASCADE
);

CREATE TABLE Resultado (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_evaluacion INT,
  calificacion DECIMAL(5,2),
  fecha_realizacion DATE,
  FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_evaluacion) REFERENCES Evaluacion(id_evaluacion) ON DELETE CASCADE
);

-- =====================================
-- 5️⃣ Progreso
-- =====================================
CREATE TABLE Progreso (
  id_progreso INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  id_contenido_mongo VARCHAR(24), -- ID del contenido en Mongo
  estado VARCHAR(50),
  ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario) ON DELETE CASCADE
);

-- =====================================
-- 6️⃣ Donaciones
-- =====================================
CREATE TABLE Donaciones (
  id_donacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  monto DECIMAL(10,2),
  fecha_donacion DATE,
  metodo_pago VARCHAR(50),
  FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario) ON DELETE CASCADE
);
