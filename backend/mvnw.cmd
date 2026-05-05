@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM ----------------------------------------------------------------------------
@REM Begin all REM://...
@echo off
@REM Set the current directory to the location of this script
set "MAVEN_PROJECTBASEDIR=%~dp0"
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

@REM Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome
set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe
if exist "%JAVA_EXE%" goto execute
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
goto fail

:execute
"%JAVA_EXE%" %JVM_CONFIG_MAVEN_PROPS% %MAVEN_OPTS% -jar %WRAPPER_JAR% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:fail
exit /B %ERROR_CODE%

:end
