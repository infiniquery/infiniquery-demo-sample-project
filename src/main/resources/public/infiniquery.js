/*!
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
* 
* 
* Includes a dependency to Tigra Calendar:
* http://www.softcomplex.com/products/tigra_calendar/
* 
*/

var infiniquery = {

    queryDiv : null,
    autocompleteTextDiv : null,
    autocompleteReferenceDataDiv : null,
    resultsDiv : null,
    contextMenuDiv : null,
    openBracketsLevel : 0,  //means no bracket is open
    lastEntityName : null,
    findKeywordEndpoint : "/queryModel/findKeyword",
    entitiesEndpoint : "/queryModel/entities",
    entityAttributesEndpoint : "/queryModel/entityAttributes/",
    entityAttributeOperatorsEndpoint : "/queryModel/entityAttributeOperators/",
    entityAttributeOperatorValueEndpoint : "/queryModel/entityAttributeOperatorValue/",
    conditionSeparatorValuesEndpoint: "/queryModel/conditionSeparatorValues",
    compileQueryEndpoint : "/queryModel/compileQuery",
    executeQueryEndpoint : "/queryModel/executeQuery",
    NOT_IMPLEMENTED_MESSAGE : "This feature will be supported in future versions of infiniquery.",

    startQueryCreation: function () {
    	infiniquery.initialize();
        infiniquery.startQueryBuilder();
    },
    initialize: function() {
    	infiniquery.queryDiv = document.getElementById("dynamicQueryDiv");
    	var documentBody = document.getElementsByTagName("BODY")[0];
    	
    	var autocompleteTextDiv = document.createElement("div");
    	autocompleteTextDiv.id = "autocompleteTextDiv";
    	var autocompleteTextTable = document.createElement("table");
    	autocompleteTextTable.id = "autocompleteTextTable";
    	autocompleteTextDiv.appendChild(autocompleteTextTable);
    	documentBody.appendChild(autocompleteTextDiv);
    	infiniquery.autocompleteTextDiv = autocompleteTextDiv;
    	
    	var autocompleteReferenceDataDiv = document.createElement("div");
    	autocompleteReferenceDataDiv.id = "autocompleteReferenceDataDiv";
    	var autocompleteReferenceDataSelect = document.createElement("select");
    	autocompleteReferenceDataSelect.id = "autocompleteReferenceDataSelect";
    	autocompleteReferenceDataSelect.multiple = "multiple";
    	var autocompleteReferenceDataButton = document.createElement("input");
    	autocompleteReferenceDataButton.type = "button";
    	autocompleteReferenceDataButton.id = "autocompleteReferenceDataButton";
    	autocompleteReferenceDataButton.value = "OK";
    	autocompleteReferenceDataDiv.appendChild(autocompleteReferenceDataSelect);
    	autocompleteReferenceDataDiv.appendChild(autocompleteReferenceDataButton);
    	documentBody.appendChild(autocompleteReferenceDataDiv);
    	infiniquery.autocompleteReferenceDataDiv = autocompleteReferenceDataDiv;

    	var contextMenuDiv = document.createElement("div");
    	contextMenuDiv.id = "contextMenuDiv";
    	var contextMenuTable = document.createElement("table");
    	contextMenuTable.id = "contextMenuTable";
    	contextMenuDiv.appendChild(contextMenuTable);
    	documentBody.appendChild(contextMenuDiv);
    	infiniquery.contextMenuDiv = contextMenuDiv;
    	
    	var resultsDiv = document.createElement("div");
    	resultsDiv.id = "infiniqueryResultsDiv";
    	var resultsLabelDiv = document.createElement("div");
    	resultsLabelDiv.id = "resultsLabelDiv";
    	resultsDiv.appendChild(resultsLabelDiv);
    	var resultsTable = document.createElement("table");
    	resultsTable.id = "infiniqueryResultsTable";
    	resultsTable.className = "infiniqueryResultsTable";
    	resultsDiv.appendChild(resultsTable);
    	documentBody.appendChild(resultsDiv);
    	var resultsDivCloseButton = document.createElement("input");
    	resultsDivCloseButton.type = "button";
    	resultsDivCloseButton.id = "infiniqueryResultsDivCloseButton";
    	resultsDivCloseButton.value = "Close";
    	resultsDiv.appendChild(resultsDivCloseButton);
    	resultsDivCloseButton.onclick = function() {
    		document.getElementById("infiniqueryResultsDiv").style.visibility = "hidden";
    	}
    	infiniquery.resultsDiv = resultsDiv;
    },
    preventEnterSubmit: function (e) {
        var key;
        if(window.event)
            key = window.event.keyCode; //IE
        else
            key = e.which; //firefox & others
        if(key == 13)
            return false;
        else
            return true;
    },
    ajaxRequestCallback: function(queryResult) {
        //alert(queryResult);

        queryResult = JSON.parse(queryResult);
        var items = queryResult.items;
        var table = document.getElementById("infiniqueryResultsTable");
        infiniquery.clearAllTableRows(table);
        if(items && items.length) {
        	infiniquery.addResultsTableHeader(table, items[0]);
        	for(var i=0; i<items.length; i++) {
        		infiniquery.addResultsTableRow(table, i + 1, items[i]);
        	}
        	document.getElementById("resultsLabelDiv").innerHTML = "" + items.length + " results found.";
        } else {
        	document.getElementById("resultsLabelDiv").innerHTML = "No results found.";
        }
        var queryDiv = infiniquery.queryDiv;
        var resultsDiv = infiniquery.resultsDiv;
        resultsDiv.style.left = "" + queryDiv.offsetLeft + "px";
        resultsDiv.style.top = "" + queryDiv.offsetTop + "px";
        resultsDiv.style.visibility = "visible";
    },
    addResultsTableHeader: function(table, object) {
        var row = table.insertRow(0);
        object = object["attributesMap"];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                var cell = row.insertCell(0);
                cell.innerHTML = property;
            }
        }
    },
    addResultsTableRow: function(table, rowIndex, object) {
        var row = table.insertRow(rowIndex);
        object = object["attributesMap"];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                var cell = row.insertCell(0);
                cell.innerHTML = object[property];
            }
        }
    },
    ajaxRequest: function (relativeUrl, method, callbackFunction, stringBody) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var responseText = xmlhttp.responseText;
                callbackFunction(responseText);
            } else if(xmlhttp.status != 200) {
                if(xmlhttp.status && xmlhttp.responseText) {
                    alert("Error.\nStatus code: " + xmlhttp.status + "\n" + xmlhttp.responseText);
                }
            }
        }
        xmlhttp.open(method,relativeUrl,true);
        if(stringBody) {
            xmlhttp.setRequestHeader("Content-type","application/json;charset=UTF-8");
            xmlhttp.send(stringBody);
        } else {
            xmlhttp.send();
        }
    },
    startQueryBuilder: function () {
    	infiniquery.autocompleteFindKeyword();
    },
    getFindKeywordDiv: function (findKeywordValue) {
        return "<div class=\"findKeyword\" oncontextmenu=\"javascript:return false;\">" + findKeywordValue + "</div>";
    },
    getEntityNameDiv: function (entityName) {
        return "<div class=\"entityName\" oncontextmenu=\"javascript:infiniquery.displayEntityContextMenu(this);return false;\">" + entityName + "</div>";
    },
    getHavingKeywordDiv: function () {
        return "<div class=\"havingKeyword\" oncontextmenu=\"javascript:return false;\">having</div>";
    },
    getEntityAttributeDiv: function (attributeName) {
        return "<div class=\"entityAttributeName\" oncontextmenu=\"javascript:infiniquery.displayAttributeContextMenu(this);return false;\">" + attributeName + "</div>";
    },
    getEntityAttributeOperatorDiv: function (operatorName) {
        return "<div class=\"operatorKeyword\" oncontextmenu=\"javascript:infiniquery.displayAttributeOperatorContextMenu(this);return false;\">" + operatorName + "</div>";
    },
    getEntityAttributeValueDiv: function (attributeValue) {
        return "<div class=\"entityAttributeValue\" oncontextmenu=\"javascript:infiniquery.displayAttributeValueContextMenu(this);return false;\">" + attributeValue + "</div>";
    },
    getConditionSeparatorKeywordDiv: function (conditionSeparatorName) {
        return "<div class=\"conditionSeparatorKeyword\" oncontextmenu=\"javascript:infiniquery.displayConditionSeparatorContextMenu(this);return false;\">" + conditionSeparatorName + "</div>";
    },
    getOpenBracketDiv: function () {
        return "<div class=\"openBracket\" oncontextmenu=\"javascript:infiniquery.displayBracketContextMenu(this);return false;\">(</div>";
    },
    getCloseBracketDiv: function () {
        return "<div class=\"closeBracket\" oncontextmenu=\"javascript:infiniquery.displayBracketContextMenu(this);return false;\">)</div>";
    },
    getInputField: function () {
        return "<input id=\"input\" type=\"text\" style=\"width:100px;\" onkeyup=\"infiniquery.defaultInputKeyTyped(this, event)\"/>";
    },
    getDateInputField: function () {
        return "<input id=\"dateInput\" type=\"text\" style=\"width:90px;\" placeholder=\"dd-MM-yyyy\" onclick=\"javascript:NewCssCal('dateInput','dd-MMM-yyyy','dropdown',false,'24',true)\" />";
    },
    getDateTimeInputField: function () {
        return "<input id=\"dateTimeInput\" type=\"text\" style=\"width:130px;\" placeholder=\"dd-MM-yyyy HH:mm:ss\" onclick=\"javascript:NewCssCal('dateTimeInput','dd-MM-yyyy HH:mm:ss','dropdown',true,'24',true)\" />";
    },
    /**
     * Default behavior when key is typed inside the cursor input box
     */
    defaultInputKeyTyped: function (input, event) {
        if(event.keyCode == 13) { //pressed ENTER
            alert("not implemented");
        } else {
            alert("not implemented");
        }
    },

    autocompleteFindKeyword: function () {
        
        var callbackFunction = function(findKeyword) {
        	infiniquery.queryDiv.innerHTML = infiniquery.getFindKeywordDiv(findKeyword) + infiniquery.getInputField();
            infiniquery.autocompleteEntity();
            infiniquery.input().focus();
        };
        infiniquery.ajaxRequest(infiniquery.findKeywordEndpoint, "GET", callbackFunction);
    },

    autocompleteEntity: function () {
        var theInput = infiniquery.input();
        var entityToken = theInput.value;

        var callbackFunction = function(entityNames) {
            entityNames = JSON.parse(entityNames);
            var suggestions = null;
            if(entityToken) {
                entityToken = entityToken.toLowerCase();
                suggestions = new Array();
                for(var i=0; i<entityNames.length; i++) {
                    if(entityNames[i].toLowerCase().indexOf(entityToken) >= 0) {
                        suggestions.push(entityNames[i]);
                    }
                }
            } else {
                suggestions = entityNames;
            }

            var table = document.getElementById("autocompleteTextTable");
            infiniquery.clearAllTableRows(table);
            var input = document.getElementById("input");
            for(var i=0; i<suggestions.length; i++) {
                infiniquery.addAutocompleteTextTableRow(table, i, suggestions[i], function() {
                    infiniquery.applyEntitySuggestion(this.childNodes[0].innerHTML);
                });
            }
            infiniquery.positionAutocompleteDiv(autocompleteTextDiv, document.getElementById("input"));
            autocompleteTextDiv.style.visibility = "visible";
            theInput.onkeyup = function(event) {
                if(event.keyCode == 13) {
                    if(suggestions.length == 1) {
                        infiniquery.applyEntitySuggestion(suggestions[0]);
                    }
                } else {
                    infiniquery.autocompleteEntity();
                }
            }
        };
        infiniquery.ajaxRequest(infiniquery.entitiesEndpoint, "GET", callbackFunction);
        theInput.focus();
    },

    applyEntitySuggestion: function (entityName) {
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityNameDiv(entityName) + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        autocompleteTextDiv.style.visibility = "hidden";
        infiniquery.autocompleteHavingKeyword(entityName);
    },
    autocompleteHavingKeyword: function (entityName) {
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getHavingKeywordDiv() + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        infiniquery.autocompleteAttribute(entityName);
        infiniquery.input().focus();
    },
    autocompleteAttribute: function (entityName) {
        var theInput = infiniquery.input();
        var attributeToken = theInput.value;

        var callbackFunction = function(attributeNames) {
            attributeNames = JSON.parse(attributeNames);
            attributeNames.push("(");
            var suggestions = null;
            if(attributeToken) {
                attributeToken = attributeToken.toLowerCase();
                suggestions = new Array();
                for(var i=0; i<attributeNames.length; i++) {
                    if(attributeNames[i].toLowerCase().indexOf(attributeToken) >= 0) {
                        suggestions.push(attributeNames[i]);
                    }
                }
            } else {
                suggestions = attributeNames;
            }

            var table = document.getElementById("autocompleteTextTable");
            infiniquery.clearAllTableRows(table);
            var input = document.getElementById("input");
            for(var i=0; i<suggestions.length; i++) {
                infiniquery.addAutocompleteTextTableRow(table, i, suggestions[i], function() {
                    infiniquery.applyAttributeSuggestion(entityName, this.childNodes[0].innerHTML);
                });
            }
            infiniquery.positionAutocompleteDiv(autocompleteTextDiv, document.getElementById("input"));
            autocompleteTextDiv.style.visibility = "visible";
            theInput.onkeyup = function(event) {
                if(event.keyCode == 13) {
                    if(suggestions.length == 1) {
                        infiniquery.applyAttributeSuggestion(entityName, suggestions[0]);
                    }
                } else {
                    infiniquery.autocompleteAttribute(entityName);
                }
            }
        };
        infiniquery.ajaxRequest(infiniquery.entityAttributesEndpoint + entityName, "GET", callbackFunction);
    },
    applyAttributeSuggestion: function (entityName, attributeName) {
        if(attributeName === "(") {
            infiniquery.applyOpenBracket(entityName);
            return;
        }
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeDiv(attributeName) + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        autocompleteTextDiv.style.visibility = "hidden";
        infiniquery.autocompleteEntityAttributeOperator(entityName, attributeName);
        infiniquery.input().focus();
    },
    applyOpenBracket: function (entityName) {
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getOpenBracketDiv() + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        infiniquery.autocompleteAttribute(entityName);
        infiniquery.input().focus();
        infiniquery.openBracketsLevel ++;
    },
    autocompleteEntityAttributeOperator: function (entityName, attributeName) {
        var theInput = infiniquery.input();
        var operatorToken = theInput.value;

        var callbackFunction = function(operatorNames) {
            operatorNames = JSON.parse(operatorNames);
            var suggestions = null;
            if(operatorToken) {
                operatorToken = operatorToken.toLowerCase();
                suggestions = new Array();
                for(var i=0; i<operatorNames.length; i++) {
                    if(operatorNames[i].toLowerCase().indexOf(operatorToken) >= 0) {
                        suggestions.push(operatorNames[i]);
                    }
                }
            } else {
                suggestions = operatorNames;
            }

            var table = document.getElementById("autocompleteTextTable");
            infiniquery.clearAllTableRows(table);
            var input = document.getElementById("input");
            for(var i=0; i<suggestions.length; i++) {
                infiniquery.addAutocompleteTextTableRow(table, i, suggestions[i], function() {
                    infiniquery.applyAttributeOperatorSuggestion(entityName, attributeName, this.childNodes[0].innerHTML);
                });
            }
            infiniquery.positionAutocompleteDiv(autocompleteTextDiv, document.getElementById("input"));
            autocompleteTextDiv.style.visibility = "visible";
            theInput.onkeyup = function(event) {
                if(event.keyCode == 13) {
                    if(suggestions.length == 1) {
                        infiniquery.applyAttributeOperatorSuggestion(entityName, attributeName, suggestions[0]);
                    }
                } else {
                    infiniquery.autocompleteEntityAttributeOperator(entityName, attributeName);
                }
            }
        };
        infiniquery.ajaxRequest(infiniquery.entityAttributeOperatorsEndpoint + entityName + "/" + attributeName, "GET", callbackFunction);
    },
    applyAttributeOperatorSuggestion: function (entityName, attributeName, operatorName) {
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeOperatorDiv(operatorName) + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        autocompleteTextDiv.style.visibility = "hidden";
        infiniquery.autocompleteEntityAttributeValue(entityName, attributeName, operatorName);
        infiniquery.input().focus();
    },
    autocompleteEntityAttributeValue: function (entityName, attributeName, operatorName) {

        var callbackFunction = function(possibleValuesView) {

            possibleValuesView = JSON.parse(possibleValuesView);
            switch(possibleValuesView.inputControlType) {
                case "NUMBER_INPUT" :
                    infiniquery.displayNumberInput(entityName, attributeName, operatorName);
                    break;
                case "FREE_TEXT_INPUT_SINGLE_VALUE" :
                    infiniquery.displayTextInputSingleValue(entityName, attributeName, operatorName);
                    break;
                case "FREE_TEXT_INPUT_MULTIPLE_VALUES" :
                    infiniquery.displayTextInputMultipleValues(entityName, attributeName, operatorName);
                    break;
                case "DATE_INPUT" :
                    infiniquery.displayDateInput(entityName, attributeName, operatorName);
                    break;
                case "DATE_TIME_INPUT" :
                    infiniquery.displayDateTimeInput(entityName, attributeName, operatorName);
                    break;
                case "REFERENCE_DATA_INPUT_SINGLE_VALUE" :
                    infiniquery.displayReferenceDataInputSingleValue(entityName, attributeName, operatorName, possibleValuesView.possibleValues);
                    break;
                case "REFERENCE_DATA_INPUT_MULTIPLE_VALUES" :
                    infiniquery.displayReferenceDataInputMultipleValues(entityName, attributeName, operatorName, possibleValuesView.possibleValues);
                    break;
                default:
                    alert("ERROR: Not supported user input control type: " + possibleValuesView.inputControlType);
            }

        };
        infiniquery.ajaxRequest(infiniquery.entityAttributeOperatorValueEndpoint + entityName + "/" + attributeName + "/" + operatorName, "GET", callbackFunction);
        infiniquery.input().focus();
    },

    displayNumberInput: function (entityName, attributeName, operatorName) {
        infiniquery.input().onkeyup = function(event) {
            if (event.keyCode == 13) { //pressed ENTER
                var theValue = this.value;
                if(infiniquery.isValidNumber(theValue)) {
                	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeValueDiv(theValue) + infiniquery.getInputField();
                    infiniquery.autocompleteConditionSeparatorKeyword(entityName);
                } else {
                    alert("Please enter a valid number.");
                }
            }
        }
    },

    getCurrentQueryHtmlWithoutCursor: function () {
        var query = infiniquery.queryDiv.innerHTML;
        return query.substring(0, query.lastIndexOf("<"));
    },

    displayTextInputSingleValue: function (entityName, attributeName, operatorName) {
        infiniquery.input().onkeyup = function(event) {
            if (event.keyCode == 13) { //pressed ENTER
                var theValue = this.value;
                if(theValue.trim()) {
                	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeValueDiv(theValue) + infiniquery.getInputField();
                    infiniquery.autocompleteConditionSeparatorKeyword(entityName);
                } else {
                    alert("Please enter a valid text.");
                }
            }
        }
    },

    displayTextInputMultipleValues: function (entityName, attributeName, operatorName) {
        alert("Not implemented yet");
    },

    displayDateInput: function (entityName, attributeName, operatorName) {
    	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getDateInputField();
        var theInput = document.getElementById("dateInput");
        lastEntityName = entityName;
        theInput.click();
        theInput.onkeyup = function(event) {
            if (event.keyCode == 13) {
                infiniquery.datePickedCallback();
            }
        }
        dateTimePickerCallback = infiniquery.datePickedCallback;
    },

    datePickedCallback: function () {
        var theInput = document.getElementById("dateInput");
        if(infiniquery.isValidDate(theInput.value)) {
        	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeValueDiv(theInput.value) + infiniquery.getInputField();
            infiniquery.autocompleteConditionSeparatorKeyword(lastEntityName);
        } else {
            theInput.style.backgroundColor = "red";
        }
    },

    displayDateTimeInput: function (entityName, attributeName, operatorName) {
    	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getDateTimeInputField();
        var theInput = document.getElementById("dateTimeInput");
        lastEntityName = entityName;
        theInput.click();
        theInput.onkeyup = function(event) {
            if (event.keyCode == 13) {
                infiniquery.dateTimePickedCallback();
            }
        }
        dateTimePickerCallback = infiniquery.dateTimePickedCallback;
    },

    dateTimePickedCallback: function () {
        var theInput = document.getElementById("dateTimeInput");
        if(infiniquery.isValidDateTime(theInput.value)) {
        	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getEntityAttributeValueDiv(theInput.value) + infiniquery.getInputField();
            infiniquery.autocompleteConditionSeparatorKeyword(lastEntityName);
        } else {
            theInput.style.backgroundColor = "red";
        }
    },

    displayReferenceDataInputSingleValue: function (entityName, attributeName, operatorName, possibleValues) {
        alert("Not implemented yet");
    },

    displayReferenceDataInputMultipleValues: function (entityName, attributeName, operatorName, possibleValues) {
    	var input = infiniquery.input();
        var select = document.getElementById("autocompleteReferenceDataSelect");
        infiniquery.clearSelect(select);
        for(var i=0; i<possibleValues.length; i++) {
            var option = document.createElement("option");
            option.text = possibleValues[i];
            select.add(option);
        }
        var autocompleteReferenceDataDiv = infiniquery.autocompleteReferenceDataDiv;
        infiniquery.positionAutocompleteDiv(autocompleteReferenceDataDiv, input);
        document.getElementById("autocompleteReferenceDataButton").onclick = function() {
        	var theValue = infiniquery.getSelectComaSeparatedSelection(select);
        	if(theValue) {
	        	infiniquery.queryDiv.innerHTML = infiniquery.getCurrentQueryHtmlWithoutCursor() + 
	        		infiniquery.getEntityAttributeValueDiv(theValue) + infiniquery.getInputField();
	        	autocompleteReferenceDataDiv.style.visibility="hidden";
	        	infiniquery.autocompleteConditionSeparatorKeyword(entityName);
	        } else {
	        	alert("You need to select at least one value.");
	        }
        };
        input.onkeyup = function(event) {
            infiniquery.clearSelect(select);
            var typedValue = this.value;
            for(var i=0; i<possibleValues.length; i++) {
            	if(possibleValues[i].toLowerCase().indexOf(typedValue.toLowerCase()) >= 0) {
	                var option = document.createElement("option");
	                option.text = possibleValues[i];
	                select.add(option);
            	}
            }
        };
        autocompleteReferenceDataDiv.style.visibility = "visible";
    },

    applyCloseBracket: function (entityName) {
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getCloseBracketDiv() + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        infiniquery.autocompleteConditionSeparatorKeyword(entityName);
        infiniquery.input().focus();
        infiniquery.openBracketsLevel --;
    },

    autocompleteConditionSeparatorKeyword: function (entityName) {
        var theInput = infiniquery.input();
        var separatorToken = theInput.value;

        var callbackFunction = function(conditionSeparatorNames) {
            conditionSeparatorNames = JSON.parse(conditionSeparatorNames);
            if(infiniquery.openBracketsLevel != 0) {
                conditionSeparatorNames.push(")");
            }
            var suggestions = null;
            if(separatorToken) {
                separatorToken = separatorToken.toLowerCase();
                suggestions = new Array();
                for(var i=0; i<conditionSeparatorNames.length; i++) {
                    if(conditionSeparatorNames[i].toLowerCase().indexOf(separatorToken) >= 0) {
                        suggestions.push(conditionSeparatorNames[i]);
                    }
                }
            } else {
                suggestions = conditionSeparatorNames;
            }

            var table = document.getElementById("autocompleteTextTable");
            infiniquery.clearAllTableRows(table);
            var input = document.getElementById("input");
            for(var i=0; i<suggestions.length; i++) {
                infiniquery.addAutocompleteTextTableRow(table, i, suggestions[i], function() {
                    infiniquery.applyConditionSeparatorKeywordSuggestion(entityName, this.childNodes[0].innerHTML);
                });
            }
            infiniquery.positionAutocompleteDiv(autocompleteTextDiv, document.getElementById("input"));
            autocompleteTextDiv.style.visibility = "visible";
            theInput.onkeyup = function(event) {
                if(event.keyCode == 13) {
                    if(suggestions.length == 1) {
                        infiniquery.applyConditionSeparatorKeywordSuggestion(entityName, suggestions[0]);
                    }
                } else {
                    infiniquery.autocompleteConditionSeparatorKeyword(entityName);
                }
            }
        };
        infiniquery.ajaxRequest(infiniquery.conditionSeparatorValuesEndpoint, "GET", callbackFunction);
        theInput.focus();
    },

    applyConditionSeparatorKeywordSuggestion: function (entityName, conditionSeparatorName) {
        if(conditionSeparatorName === ")") {
            infiniquery.applyCloseBracket(entityName);
            return;
        }
        var oldQuery = infiniquery.queryDiv.innerHTML;
        var newQuery = infiniquery.getCurrentQueryHtmlWithoutCursor() + infiniquery.getConditionSeparatorKeywordDiv(conditionSeparatorName) + infiniquery.getInputField();
        infiniquery.queryDiv.innerHTML = newQuery;
        autocompleteTextDiv.style.visibility = "hidden";
        infiniquery.autocompleteAttribute(entityName);
        infiniquery.input().focus();
    },

    isValidNumber: function (value) {
        return (value - parseFloat( value ) + 1) >= 0;
    },

    isValidDateTime: function(value) {
        var fragments = value.split(" ");
        if(fragments.length != 2) {
            return false;
        } else {
            return infiniquery.isValidDate(fragments[0]) && infiniquery.isValidTime(fragments[1]);
        }
    },

    isValidDate: function(value) {
        var validformat=/^\d{1,2}\-\d{1,2}\-\d{4}$/; //Basic check for format validity
        var returnval=false
        if (!validformat.test(value))
            returnval=false;
        else{ //Detailed check for valid date ranges
            var fragments = value.split("-");
            var dayfield=fragments[0];
            var monthfield=fragments[1];
            var yearfield=fragments[2];
            var dayobj = new Date(yearfield, monthfield-1, dayfield);
            if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
                returnval=false;
            else
                returnval=true;
        }
        return returnval;
    },

    isValidTime: function(value) {
        var fragments = value.split(":");
        if(fragments.length != 3) {
            return false;
        }
        var hour = parseInt(fragments[0], 10);
        var minute = parseInt(fragments[1], 10);
        var second = parseInt(fragments[2], 10);
        if(fragments[0] == hour && fragments[1] == minute && fragments[2] == second
            && hour >= 0 && hour <= 23 && minute >= 0 && minute <=59 && second >=0 && second <= 59) {
            return true;
        } else {
            return false;
        }
    },

    input: function () {
        return document.getElementById("input");
    },

    simulateEvent: function (element, eventType){
        if (element.fireEvent) {
            element.fireEvent('on' + eventType);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(eventType, true, false);
            element.dispatchEvent(evObj);
        }
    },

    displayEntityContextMenu: function (entityDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Select another entity instead", function() {
            document.getElementById("autocompleteTextDiv").style.visibility = "hidden";
            document.getElementById("autocompleteReferenceDataDiv").style.visibility = "hidden";
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
            infiniquery.startQueryBuilder();
        });
        infiniquery.addContextualTableRow(table, 1, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, entityDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivEntity";
    },

    displayAttributeContextMenu: function (attributeDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Select another attribute instead", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 1, "Remove entire condition", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 2, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, attributeDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivAttribute";
    },

    displayAttributeOperatorContextMenu: function (operatorDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Change operator", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 1, "Edit entire condition", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 2, "Remove entire condition", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 3, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, operatorDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivOperator";
    },

    displayAttributeValueContextMenu: function (valueDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Change value", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 1, "Edit entire condition", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 2, "Remove entire condition", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 3, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, valueDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivValue";
    },

    displayConditionSeparatorContextMenu: function (conditionSeparatorDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Change logical operator", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 1, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, conditionSeparatorDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivConditionSeparator";
    },

    displayBracketContextMenu: function (bracketDiv) {
        var contextMenuDiv = document.getElementById("contextMenuDiv");
        var table = document.getElementById("contextMenuTable");
        infiniquery.clearAllTableRows(table);
        infiniquery.addContextualTableRow(table, 0, "Change content between parenthesis", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 1, "Remove this parenthesis and contents", function() {
            alert(infiniquery.NOT_IMPLEMENTED_MESSAGE);
        });
        infiniquery.addContextualTableRow(table, 2, "Cancel (X)", function() {
            document.getElementById("contextMenuDiv").style.visibility = "hidden";
        });
        infiniquery.positionAutocompleteDiv(contextMenuDiv, bracketDiv);
        contextMenuDiv.style.visibility = "visible";
        contextMenuDiv.className = "contextMenuDivBracket";
    },

    addAutocompleteTextTableRow: function(table, rowIndex, text, onClickHandler) {
        var row = table.insertRow(rowIndex);
        var cell = row.insertCell(0);
        cell.innerHTML = text;
        cell.style.cursor="pointer";
        if(rowIndex%2 == 0) {
            cell.className = "autocompleteTextTableOddCell";
        } else {
            cell.className = "autocompleteTextTableEvenCell";
        }
        row.onclick = onClickHandler;
    },

    addContextualTableRow: function(table, rowIndex, text, onClickHandler) {
        var row = table.insertRow(rowIndex);
        var cell = row.insertCell(0);
        cell.innerHTML = text;
        cell.style.cursor="pointer";
        if(rowIndex%2 == 0) {
            cell.className = "contextTableOddCell";
        } else {
            cell.className = "contextTableEvenCell";
        }
        row.onclick = onClickHandler;
    },

    clearAllTableRows: function(table) {
        while(table.hasChildNodes()) {
            table.removeChild(table.firstChild);
        }
    },

    /**
     * Get the plain text dimension of the query displayed in the #dynamicQueryDiv div.
     * @returns {string}
     */
    getQueryPlainTextDimension: function () {
    	infiniquery.queryDiv = document.getElementById("dynamicQueryDiv");
        var divs = infiniquery.queryDiv.getElementsByTagName("div");
        var text = "";
        for(var i=0; i<divs.length; i++) {
            if(text.length != 0) {
                text += " ";
            }
            text += divs[i].innerHTML;
        }
        return text;
    },

    getQueryLogicalDimension: function () {
    	infiniquery.queryDiv = document.getElementById("dynamicQueryDiv");
        var divs = infiniquery.queryDiv.getElementsByTagName("div");
        var logicalDimension = new Array();
        for(var i=0; i<divs.length; i++) {
            logicalDimension.push(new infiniquery.LogicalQueryItem(divs[i].className, divs[i].innerHTML));
        }
        return logicalDimension;
    },

    LogicalQueryItem: function (type, displayValue) {
        this.type=type;
        this.displayValue=displayValue;
    },

    getQueryHtmlDimension: function () {
    	infiniquery.queryDiv = document.getElementById("dynamicQueryDiv");
        var queryHtmlDimension = infiniquery.queryDiv.innerHTML;
        return queryHtmlDimension;
    },

    displayQueryHtmlDimension: function () {
    	infiniquery.queryDiv = document.getElementById("dynamicQueryDiv");
        var queryHtmlDimension = infiniquery.queryDiv.innerHTML;
        alert(infiniquery.getQueryHtmlDimension());
    },

    displayQueryPlainTextDimension: function () {
        var queryPlainTextDimension = infiniquery.getQueryPlainTextDimension();
        alert (queryPlainTextDimension);
    },

    displayQueryJpqlDimension: function () {
    	//alert("This functionality is not implemented by default. If you want it, please implemented in your application code.");
    	if(infiniquery.isQueryValid()) {
	        var executableQuery = new infiniquery.ExecutableQuery(infiniquery.getQueryHtmlDimension(), infiniquery.getQueryPlainTextDimension(), infiniquery.getQueryLogicalDimension());
	        var executableQueryString = JSON.stringify(executableQuery);
	        var callback = function(jpqlDimension) {
	        	alert(jpqlDimension);
	        }
	        infiniquery.ajaxRequest(infiniquery.compileQueryEndpoint, "POST", callback, executableQueryString);
    	} else {
    		alert("Query not valid. Please ensure the sentence is complete and all brackets properly closed.");
    	}
    },

    displayQueryLogicalDimension: function () {
        var logicalDimension = infiniquery.getQueryLogicalDimension();
        alert(JSON.stringify(logicalDimension));
    },

    positionAutocompleteDiv: function (divObj, reperObj) {
        var topAdd = 20;
        if(document.selection) { // for IE
            topAdd = 35;
        }
        divObj.style.left = "" + reperObj.offsetLeft + "px";
        divObj.style.top = "" + (reperObj.offsetTop + topAdd) + "px";
    },

    isQueryValid: function() {
        /* Three steps:
        1) check validQueryItemSequence
        2) check that the query starts with findKeyword and ends with either closeBracket or entityAttributeValue
        3) check that the number of openBracket occurences is equal to the number of closeBracket occurences.
         */
        var queryDiv = document.getElementById("dynamicQueryDiv");
        var elementDivs = queryDiv.childNodes;
        elementDivs = infiniquery.filterDivs(elementDivs);
        var minimumPossibleValidQueryLength = 6;
        if(elementDivs.length < minimumPossibleValidQueryLength) {
            alert("Invalid query. Please complete your query and try again.");
            return false;
        }
        if(elementDivs[0].className != "findKeyword") {
            alert("Invalid query. A query should start with the \"Find\" keyword.");
            return false;
        }
        if(elementDivs[elementDivs.length - 1].className != "entityAttributeValue" && elementDivs[elementDivs.length - 1].className != "closeBracket") {
            alert("Invalid query. A query should end with either an attribute's value or by closing a bracket.");
            return false;
        }
        var openBracketCount = 0;
        var closeBracketCount = 0;
        for(var i=0; i<elementDivs.length; i++) {
            var currentDivClassName = elementDivs[i].className;
            if(i != elementDivs.length - 1) {
                var legalNextValues = infiniquery.validQueryItemSequence[currentDivClassName];
                if(! infiniquery.contains(legalNextValues, elementDivs[i+1].className)) {
                    alert("Invalid query. Illegal sequence : \"" + elementDivs[i].innerHTML + " " + elementDivs[i+1].innerHTML + "\", at element number " + (i+1) + " in the query.");
                    return false;
                }
            }
            if(currentDivClassName === "openBracket") {
                openBracketCount ++;
            } else if(currentDivClassName === "closeBracket") {
                closeBracketCount ++;
            }
        }
        if(openBracketCount > closeBracketCount) {
            alert("Invalid query. " + (openBracketCount - closeBracketCount) + " bracket(s) are not closed.");
            return false;
        } else if(closeBracketCount > openBracketCount) {
            alert("Invalid query. " + (closeBracketCount - openBracketCount) + " bracket(s) are closed but not open.");
            return false;
        }
        return true;
    },

    validQueryItemSequence : {
        "findKeyword" : new Array("entityName"),
        "entityName" : new Array("havingKeyword"),
        "havingKeyword" : new Array("entityAttributeName", "openBracket"),
        "openBracket" : new Array("entityAttributeName", "openBracket"),
        "closeBracket" : new Array("conditionSeparatorKeyword"),
        "entityAttributeName" : new Array("operatorKeyword"),
        "operatorKeyword" : new Array("entityAttributeValue"),
        "entityAttributeValue" : new Array("closeBracket", "conditionSeparatorKeyword"),
        "conditionSeparatorKeyword" : new Array("openBracket", "entityAttributeName")
    },

    contains : function (a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    },

    filterDivs: function(nodes) {
        var newArray = new Array();
        for(var i=0; i<nodes.length; i++) {
            if(nodes[i].tagName.toLowerCase() === "div") {
                newArray.push(nodes[i]);
            }
        }
        return newArray;
    },
    
    clearSelect: function(selectObj) {
    	selectObj.options.length = 0;
    },
    
    getSelectComaSeparatedSelection: function(selectObj) {
    	var options = selectObj.options;
    	var length = options.length;
    	if(length) {
        	var value = "";
	    	for(var i=0; i<length; i++) {
	    		if(options[i].selected) {
	    			if(value.length) {
	    				value += ",";
	    			}
	    			value += options[i].value || options[i].text;
	    		}
	    	}
	    	return value;
	    } else {
	    	return null;
	    }
    },
    
    executeQuery: function() {
    	if(infiniquery.isQueryValid()) {
	        var executableQuery = new infiniquery.ExecutableQuery(infiniquery.getQueryHtmlDimension(), infiniquery.getQueryPlainTextDimension(), infiniquery.getQueryLogicalDimension());
	        var executableQueryString = JSON.stringify(executableQuery);
	        infiniquery.ajaxRequest(infiniquery.executeQueryEndpoint, "POST", infiniquery.ajaxRequestCallback, executableQueryString);
    	} else {
    		alert("Query not valid. Please ensure the sentence is complete and all brackets properly closed.");
    	}
    },

    ExecutableQuery: function(htmlDimension, plainTextDimension, logicalDimension) {
        this.htmlDimension = htmlDimension;
        this.plainTextDimension = plainTextDimension;
        this.logicalDimension = logicalDimension;
    }

}