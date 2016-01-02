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

import javax.persistence.*;

/*
CREATE TABLE EMPLOYEE_EXPERTISE(ID INTEGER PRIMARY KEY, ID_EMPLOYEE INTEGER REFERENCES EMPLOYEES(ID), ID_EXPERIENCE_AREA INTEGER REFERENCES EXPERIENCE_AREAS(ID), EXPERTISE_LEVEL INTEGER);
*/
@Entity
@Table(name = "EMPLOYEE_EXPERTISE")
public class EmployeeExpertise {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_employee")
	private Employee employee;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "id_experience_area")
	private ExperienceArea experienceArea;

	@Column(name="EXPERTISE_LEVEL")
	private int expertiseLevel;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getExpertiseLevel() {
		return expertiseLevel;
	}

	public void setExpertiseLevel(int expertiseLevel) {
		this.expertiseLevel = expertiseLevel;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public ExperienceArea getExperienceArea() {
		return experienceArea;
	}

	public void setExperienceArea(ExperienceArea experienceArea) {
		this.experienceArea = experienceArea;
	}

}
