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

package org.infiniquery.demoapp.entities;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/*
CREATE TABLE EMPLOYEES(ID INTEGER PRIMARY KEY, FIRST_NAME VARCHAR(50), LAST_NAME VARCHAR(50), BIRTH_DATE DATE, CAREER_STARTED_DATE DATE, ROLE VARCHAR(50), ID_DEPARTMENT INTEGER REFERENCES DEPARTMENTS(ID));
*/
@Entity
@Table(name = "EMPLOYEES")
public class Employee {
	
	public final static SimpleDateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat("MMM dd, yyyy");

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Column(name = "FIRST_NAME")
	private String firstName;

	@Column(name = "LAST_NAME")
	private String lastName;

	@Column(name = "BIRTH_DATE")
	private Date birthDate;

	@Column(name = "CAREER_STARTED_DATE")
	private Date careerStartedDate;

	@Column(name = "ROLE")
	private String role;

	@OneToMany(mappedBy = "employee", fetch = FetchType.EAGER)
	private List<EmployeeExpertise> expertise;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_department")
	private Department department;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Date getBirthDate() {
		return birthDate;
	}
	
	public String getBirthDateString() {
		return DEFAULT_DATE_FORMAT.format(birthDate);
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	public Date getCareerStartedDate() {
		return careerStartedDate;
	}
	
	public String getCareerStartedDateString() {
		return DEFAULT_DATE_FORMAT.format(careerStartedDate);
	}

	public void setCareerStartedDate(Date careerStartedDate) {
		this.careerStartedDate = careerStartedDate;
	}

	public List<EmployeeExpertise> getExpertise() {
		return expertise;
	}

	public void setExpertise(List<EmployeeExpertise> expertise) {
		this.expertise = expertise;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}
}
