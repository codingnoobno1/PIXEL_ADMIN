--wap that take input of 3 numbers from user and find the greatest one
 
--wap to check whether the given number is odd or even 
 
--wap to allocate the grade to the student based on marks entered by the user 
 
--wap to find whether the given alphabet or character is vowel or a consonant 
 
--wap to find whether the given number is divisible by 5 or 7 or both 








-- WAP to take input of 3 numbers and find the greatest one

DECLARE
    a NUMBER;
    b NUMBER;
    c NUMBER;
BEGIN
    a := &a;   -- user input
    b := &b;
    c := &c;

    IF a > b AND a > c THEN
        DBMS_OUTPUT.PUT_LINE('The greatest number is: ' || a);
    ELSIF b > a AND b > c THEN
        DBMS_OUTPUT.PUT_LINE('The greatest number is: ' || b);
    ELSIF c > a AND c > b THEN
        DBMS_OUTPUT.PUT_LINE('The greatest number is: ' || c);
    ELSE
        DBMS_OUTPUT.PUT_LINE('All numbers are equal or two numbers are same and greatest.');
    END IF;
END;
/









-- WAP to check whether a number is odd or even

DECLARE
    n NUMBER;
BEGIN
    n := &n;

    IF MOD(n, 2) = 0 THEN
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is EVEN.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is ODD.');
    END IF;
END;
/








-- WAP to allocate grade based on marks entered by user

DECLARE
    marks NUMBER;
BEGIN
    marks := &marks;

    IF marks >= 90 THEN
        DBMS_OUTPUT.PUT_LINE('Grade: A+');
    ELSIF marks >= 75 AND marks < 90 THEN
        DBMS_OUTPUT.PUT_LINE('Grade: A');
    ELSIF marks >= 60 AND marks < 75 THEN
        DBMS_OUTPUT.PUT_LINE('Grade: B');
    ELSIF marks >= 50 AND marks < 60 THEN
        DBMS_OUTPUT.PUT_LINE('Grade: C');
    ELSIF marks >= 35 AND marks < 50 THEN
        DBMS_OUTPUT.PUT_LINE('Grade: D');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Grade: F (Fail)');
    END IF;
END;
/






-- WAP to find whether the given number is divisible by 5 or 7 or both

DECLARE
    n NUMBER;
BEGIN
    n := &n;

    IF MOD(n, 5) = 0 AND MOD(n, 7) = 0 THEN
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is divisible by BOTH 5 and 7.');
    ELSIF MOD(n, 5) = 0 THEN
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is divisible by 5 only.');
    ELSIF MOD(n, 7) = 0 THEN
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is divisible by 7 only.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('The number ' || n || ' is NOT divisible by 5 or 7.');
    END IF;
END;
/





-- WAP to find whether the given alphabet is a vowel or consonant

DECLARE
    ch CHAR(1);
BEGIN
    ch := '&ch';  -- input single character

    IF LOWER(ch) IN ('a', 'e', 'i', 'o', 'u') THEN
        DBMS_OUTPUT.PUT_LINE('The character ' || ch || ' is a VOWEL.');
    ELSIF ch BETWEEN 'a' AND 'z' OR ch BETWEEN 'A' AND 'Z' THEN
        DBMS_OUTPUT.PUT_LINE('The character ' || ch || ' is a CONSONANT.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('The character ' || ch || ' is NOT an alphabet.');
    END IF;
END;
/
