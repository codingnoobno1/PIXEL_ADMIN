-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email nvarchar(200) NOT NULL UNIQUE,
    Password nvarchar(510) NOT NULL,
    Name nvarchar(200) NOT NULL,
    Role nvarchar(40) DEFAULT 'admin',
    CreatedAt datetime2 DEFAULT GETUTCDATE(),
    UpdatedAt datetime2 DEFAULT GETUTCDATE()
);

-- Add Foreign Key Constraints if they don't exist
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Questions_Quizzes')
BEGIN
    ALTER TABLE Questions
    ADD CONSTRAINT FK_Questions_Quizzes FOREIGN KEY (QuizId) REFERENCES Quizzes(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Options_Questions')
BEGIN
    ALTER TABLE Options
    ADD CONSTRAINT FK_Options_Questions FOREIGN KEY (QuestionId) REFERENCES Questions(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Quizzes_Subjects')
BEGIN
    ALTER TABLE Quizzes
    ADD CONSTRAINT FK_Quizzes_Subjects FOREIGN KEY (SubjectId) REFERENCES Subjects(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Subjects_Semesters')
BEGIN
    ALTER TABLE Subjects
    ADD CONSTRAINT FK_Subjects_Semesters FOREIGN KEY (SemesterId) REFERENCES Semesters(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Subjects_Faculties')
BEGIN
    ALTER TABLE Subjects
    ADD CONSTRAINT FK_Subjects_Faculties FOREIGN KEY (FacultyId) REFERENCES Faculties(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Semesters_Courses')
BEGIN
    ALTER TABLE Semesters
    ADD CONSTRAINT FK_Semesters_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TeamMembers_Teams')
BEGIN
    ALTER TABLE TeamMembers
    ADD CONSTRAINT FK_TeamMembers_Teams FOREIGN KEY (TeamId) REFERENCES Teams(Id);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TeamMembers_Users')
BEGIN
    ALTER TABLE TeamMembers
    ADD CONSTRAINT FK_TeamMembers_Users FOREIGN KEY (UserId) REFERENCES Users(Id);
END

-- Add indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
BEGIN
    CREATE INDEX IX_Users_Email ON Users(Email);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_EnrollmentNumber')
BEGIN
    CREATE INDEX IX_Users_EnrollmentNumber ON Users(EnrollmentNumber);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_admin_users_email')
BEGIN
    CREATE INDEX IX_admin_users_email ON admin_users(Email);
END
