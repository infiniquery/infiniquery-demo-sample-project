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

import java.util.HashSet;
import java.util.Set;

import org.infiniquery.service.SecurityService;
import org.infiniquery.web.spring.controller.QueryModelController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@ComponentScan({"org.infiniquery.web.spring.controller"})
public class Application {

    public static void main(String[] args) {
    	
    	ConfigurableApplicationContext appContext = SpringApplication.run(Application.class, args);
    	
    	SecurityService securityService = new SecurityService() {
			@Override
			public Set<String> getCurrentUserRoles() {
				//This is a sample hardcoded implementation that says current user is ADMIN and MANAGER.
				//In a real production application, you should have an implementation that returns
				//the role(s) of the logged user, taken from the session or from wherever your application
				//keeps record of the logged user.
				return new HashSet<String>() {{
					add("ADMIN");
					add("MANAGER");
				}};
			}
    	};
    	
    	QueryModelController queryModelController = appContext.getBean(QueryModelController.class);
    	queryModelController.getQueryModelService().setSecurityService(securityService);

    }

}