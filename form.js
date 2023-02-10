class errorNodesGroup {

    constructor(errMessNode, relatedInput) 
    {
        this.node = document.querySelector(errMessNode)
        if (relatedInput !== undefined) this.input = document.querySelector(relatedInput)
    }

    show() 
    { 
        this.node.style.display = "block"
        if (this.input !== undefined) this.input.style.borderColor = "red";
    }

    hide() 
    { 
        this.node.style.display="none"
        if (this.input !== undefined) this.input.style.borderColor = "#595364";
    }

}

// class Form
class Form {
    #nameRegex
    #zeroNinetyNineRegex
    #dateRegex
    #isOneValidationFalse

    constructor()
    {
        this.#nameRegex = new RegExp ("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$")
        this.#zeroNinetyNineRegex = new RegExp ("^[0-9]{1,2}$")
        this.#dateRegex = new RegExp("^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$") // ([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])) // ^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$
        this.#isOneValidationFalse = (element) => element === false

        // object grouping error message nodes / !! get it out of all functions
        this.errorNodes = {
            'firstname' : new errorNodesGroup('#firstnameError', '#firstname'), // associer input pr pouvoir l'highlighter : errorNodesHandler(errorelement, input) / const errorHandlers = {}
            'lastname' : new errorNodesGroup('#lastnameError', '#lastname'),
            'birthdate' : new errorNodesGroup('#birthdateError', '#birthdate'),
            'games' : new errorNodesGroup('#gamesownedError', '#gamesowned'),
            'studios' : new errorNodesGroup('#studiosError'),
            'conditions' : new errorNodesGroup('#conditionsError', '#tos-checkbox')
        }
    }

    #checkName(fieldId)
    {
        const fieldValue = document.querySelector(fieldId).value.trim()
        return this.#nameRegex.test(fieldValue)
    }

    #checkDate(fieldId)
    {
        const fieldValue = document.querySelector(fieldId).value.trim()
        // check day < 32 / month < 13 / < todays date / > 1850 / date < today // format y d m
        return this.#dateRegex.test(fieldValue)
    }

    #checkNumber(fieldId)
    {
        const fieldValue = document.querySelector(fieldId).value.trim()
        return this.#zeroNinetyNineRegex.test(fieldValue)
    }

    #checkStudios(fieldsName)
    {
        const fieldsStatus = document.getElementsByName(fieldsName)

        for (const field of fieldsStatus) {
            if (field.checked === true) {
                return true
            }
        }

        return false
    }

    liveValidate(input)
    {      
        // transform validation result into function executed on demand
        const getValidationResult = {
            'firstname' : () => this.#checkName('#firstname'),
            'lastname' : () => this.#checkName('#lastname'),
            'birthdate' : () => this.#checkDate('#birthdate'),
            'games' : () => this.#checkNumber('#gamesowned'), // min max quantity ?
            'studios' : () => this.#checkStudios('studios'),
            'conditions' : () => document.querySelector('#tos-checkbox').checked
        }

        getValidationResult[input]() === false ? this.errorNodes[input].show() : this.errorNodes[input].hide()
    }

    validate()
    {
        console.log("validating...")
        
        // try validating all the inputs and save the object
        const validationResults = {
            'firstname' : this.#checkName('#firstname'),
            'lastname' : this.#checkName('#lastname'),
            'birthdate' : this.#checkDate('#birthdate'),
            'games' : this.#checkNumber('#gamesowned'), // min max quantity ?
            'studios' : this.#checkStudios('studios'),
            'conditions' : document.querySelector('#tos-checkbox').checked
        }

        // list inputs validation results into an array
        const validationResultsArray = Object.values(validationResults)

        // show error messages when input values are wrong
        for (const key in validationResults) {
            ((validationResults[key] === false) || (validationResults[key] === undefined)) ? this.errorNodes[key].show() : this.errorNodes[key].hide()
        }

        // test if one element of validationResults = false, if so then returns false which blocks form submit
        return !validationResultsArray.some(this.#isOneValidationFalse)
    }

}

const myForm = new Form()