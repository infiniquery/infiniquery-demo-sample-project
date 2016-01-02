/*
* Copyright (c) 2015, Daniel Doboga
* All rights reserved.
* 	
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
*   1. Redistributions of source code must retain the above copyright notice, this 
*   list of conditions and the following disclaimer.
*   
*   2. Redistributions in binary form must reproduce the above copyright notice, this 
*   list of conditions and the following disclaimer in the documentation and/or other 
*   materials provided with the distribution.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
* IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
* INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
* NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
* PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
* WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
* ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
* POSSIBILITY OF SUCH DAMAGE.
*/

package org.infiniquery.demoapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.hsqldb.Server;

/**
 * Run this to get the database set up before running the Infiniquery Demo application.
 * 
 * @author Daniel Doboga
 */
public class Database {
	public static final int PORT = 9032;
	public static final String USERNAME = "sa";
	public static final String PASSWORD = "";
	public static final String NAME = "infiniquerydemo";
	
	private Server hsqlServer;
	
	public static void main(String[] args) throws InterruptedException {
		
		Database database = new Database();
		database.setUpAndStartRunning();
	}
	
	private void setUpAndStartRunning() throws InterruptedException {
		Connection connection = null;
		
		hsqlServer = new Server();
		hsqlServer.setLogWriter(null);
		hsqlServer.setSilent(true);
		hsqlServer.setDatabaseName(0, "infiniquerydemo");
		hsqlServer.setDatabasePath(0, "file:infiniquerydemodb");
		hsqlServer.setPort(PORT);
		
		hsqlServer.start();
		
		try {
			Class.forName("org.hsqldb.jdbcDriver");
			connection = DriverManager.getConnection("jdbc:hsqldb:hsql://localhost:" + PORT + "/" + NAME, USERNAME, PASSWORD);
			execute(connection, "DROP TABLE IF EXISTS EMPLOYEE_EXPERTISE;");
			execute(connection, "DROP TABLE IF EXISTS EMPLOYEES;");
			execute(connection, "DROP TABLE IF EXISTS EXPERIENCE_AREAS;");
			execute(connection, "DROP TABLE IF EXISTS DEPARTMENTS;");
			
			execute(connection, "CREATE TABLE DEPARTMENTS(ID INTEGER PRIMARY KEY, DEPARTMENT_NAME VARCHAR(50));");
			execute(connection, "CREATE TABLE EXPERIENCE_AREAS(ID INTEGER PRIMARY KEY, AREA_NAME VARCHAR(50));");
			execute(connection, "CREATE TABLE EMPLOYEES(ID INTEGER PRIMARY KEY, FIRST_NAME VARCHAR(50), LAST_NAME VARCHAR(50), BIRTH_DATE DATE, CAREER_STARTED_DATE DATE, ROLE VARCHAR(50), ID_DEPARTMENT INTEGER REFERENCES DEPARTMENTS(ID));");
			execute(connection, "CREATE TABLE EMPLOYEE_EXPERTISE(ID INTEGER PRIMARY KEY, ID_EMPLOYEE INTEGER REFERENCES EMPLOYEES(ID), ID_EXPERIENCE_AREA INTEGER REFERENCES EXPERIENCE_AREAS(ID), EXPERTISE_LEVEL INTEGER);");

			execute(connection, "INSERT INTO DEPARTMENTS(ID, DEPARTMENT_NAME) VALUES (1, 'Development');");
			execute(connection, "INSERT INTO DEPARTMENTS(ID, DEPARTMENT_NAME) VALUES (2, 'Testing');");
			execute(connection, "INSERT INTO DEPARTMENTS(ID, DEPARTMENT_NAME) VALUES (3, 'Project Management');");
			
			execute(connection, "INSERT INTO EXPERIENCE_AREAS(ID, AREA_NAME) VALUES (1, 'Java');");
			execute(connection, "INSERT INTO EXPERIENCE_AREAS(ID, AREA_NAME) VALUES (2, 'MySQL');");
			execute(connection, "INSERT INTO EXPERIENCE_AREAS(ID, AREA_NAME) VALUES (3, 'CSS');");
			execute(connection, "INSERT INTO EXPERIENCE_AREAS(ID, AREA_NAME) VALUES (4, 'Selenium');");
			execute(connection, "INSERT INTO EXPERIENCE_AREAS(ID, AREA_NAME) VALUES (5, 'Agile Scrum');");

			execute(connection, "INSERT INTO EMPLOYEES(ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, CAREER_STARTED_DATE, ROLE, ID_DEPARTMENT) VALUES (1, 'John', 'Davis', TO_DATE('15-08-1980', 'DD-MM-YYYY'), TO_DATE('03-11-2002', 'DD-MM-YYYY'), 'Software Developer', 1);");
			execute(connection, "INSERT INTO EMPLOYEES(ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, CAREER_STARTED_DATE, ROLE, ID_DEPARTMENT) VALUES (2, 'Silvia', 'Rockwell', TO_DATE('02-10-1989', 'DD-MM-YYYY'), TO_DATE('21-05-2014', 'DD-MM-YYYY'), 'Software Developer', 1);");
			execute(connection, "INSERT INTO EMPLOYEES(ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, CAREER_STARTED_DATE, ROLE, ID_DEPARTMENT) VALUES (3, 'Raphael Roger', 'Smith', TO_DATE('03-04-1985', 'DD-MM-YYYY'), TO_DATE('12-09-2009', 'DD-MM-YYYY'), 'Web Designer', 1);");
			execute(connection, "INSERT INTO EMPLOYEES(ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, CAREER_STARTED_DATE, ROLE, ID_DEPARTMENT) VALUES (4, 'Jane', 'Davis', TO_DATE('01-07-1985', 'DD-MM-YYYY'), TO_DATE('02-05-2010', 'DD-MM-YYYY'), 'Test Engineer', 2);");
			execute(connection, "INSERT INTO EMPLOYEES(ID, FIRST_NAME, LAST_NAME, BIRTH_DATE, CAREER_STARTED_DATE, ROLE, ID_DEPARTMENT) VALUES (5, 'John Albert', 'Moore', TO_DATE('11-09-1983', 'DD-MM-YYYY'), TO_DATE('06-08-2007', 'DD-MM-YYYY'), 'Project Manager', 3);");

			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (1, 1, 1, 3);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (2, 1, 2, 3);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (3, 1, 3, 1);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (4, 1, 5, 2);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (5, 2, 1, 2);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (6, 2, 5, 1);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (7, 3, 3, 3);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (8, 4, 4, 3);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (9, 4, 1, 1);");
			execute(connection, "INSERT INTO EMPLOYEE_EXPERTISE(ID, ID_EMPLOYEE, ID_EXPERIENCE_AREA, EXPERTISE_LEVEL) VALUES (10, 5, 5, 3);");

			
		} catch (SQLException e2) {
			e2.printStackTrace();
		} catch (ClassNotFoundException e2) {
			e2.printStackTrace();
		} finally {
			if(connection!=null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		System.out.println("Database setup completed.");
		Thread.sleep(Long.MAX_VALUE); //Just wait until somebody stops this application by hand.
	}
	
	private static void execute(Connection connection, String sql) throws SQLException {
		connection.prepareStatement(sql).execute();
	}
	
}
