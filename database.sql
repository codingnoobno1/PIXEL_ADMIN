-- Drop tables if they exist
IF OBJECT_ID('FacultyRoles', 'U') IS NOT NULL
  DROP TABLE FacultyRoles;
IF OBJECT_ID('FacultyAssignments', 'U') IS NOT NULL
    DROP TABLE FacultyAssignments;
IF OBJECT_ID('Subjects', 'U') IS NOT NULL
    DROP TABLE Subjects;
IF OBJECT_ID('Batches', 'U') IS NOT NULL
    DROP TABLE Batches;
IF OBJECT_ID('Semesters', 'U') IS NOT NULL
    DROP TABLE Semesters;
IF OBJECT_ID('Faculties', 'U') IS NOT NULL
  DROP TABLE Faculties;

-- Create Faculties table
CREATE TABLE Faculties (
  Id INT PRIMARY KEY IDENTITY(1,1),
  UUID NVARCHAR(255) NOT NULL UNIQUE,
  Name NVARCHAR(255) NOT NULL,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  Password NVARCHAR(255) NOT NULL,
  Position NVARCHAR(255) NOT NULL,
  Department NVARCHAR(255) NOT NULL,
  AmiId NVARCHAR(255) NOT NULL
);

-- Create FacultyRoles table
CREATE TABLE FacultyRoles (
  FacultyId INT NOT NULL,
  Role NVARCHAR(255) NOT NULL,
  PRIMARY KEY (FacultyId, Role),
  FOREIGN KEY (FacultyId) REFERENCES Faculties(Id)
);

-- Create Semesters table
CREATE TABLE Semesters (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Number INT NOT NULL UNIQUE
);

-- Create Batches table
CREATE TABLE Batches (
    Id INT PRIMARY KEY IDENTITY(1,1),
    BatchLabel NVARCHAR(255) NOT NULL UNIQUE,
    SemesterNumber INT NOT NULL
);

-- Create Subjects table
CREATE TABLE Subjects (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL,
    FacultyId INT NOT NULL,
    SemesterId INT NOT NULL,
    FOREIGN KEY (FacultyId) REFERENCES Faculties(Id),
    FOREIGN KEY (SemesterId) REFERENCES Semesters(Id)
);

-- Create FacultyAssignments table
CREATE TABLE FacultyAssignments (
    FacultyId INT NOT NULL,
    SubjectId INT NOT NULL,
    BatchId INT NOT NULL,
    PRIMARY KEY (FacultyId, SubjectId, BatchId),
    FOREIGN KEY (FacultyId) REFERENCES Faculties(Id),
    FOREIGN KEY (SubjectId) REFERENCES Subjects(Id),
    FOREIGN KEY (BatchId) REFERENCES Batches(Id)
);
