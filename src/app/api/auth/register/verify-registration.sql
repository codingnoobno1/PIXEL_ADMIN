SELECT 
    Id,
    Name,
    Email,
    [Role],
    [Position],
    [AmiId],
    CASE 
        WHEN Password IS NOT NULL THEN 'Set'
        ELSE 'Not Set'
    END as PasswordStatus
FROM Faculties
WHERE Email = 'test.faculty@amity.edu';
