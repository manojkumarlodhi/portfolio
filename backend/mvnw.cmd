@REM Maven Wrapper for Windows
@REM Generated for portfolio-backend

@echo off
setlocal

set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0
set JAVA_HOME_OPTS=

if exist "%MAVEN_HOME%\bin\mvn.cmd" (
    "%MAVEN_HOME%\bin\mvn.cmd" %*
) else (
    echo [ERROR] Maven not found at: %MAVEN_HOME%
    echo [INFO]  Please install Maven or update MAVEN_HOME in this script.
    exit /b 1
)

endlocal
