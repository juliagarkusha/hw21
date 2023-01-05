class UseForm {
    static FORM_CLASS = 'form';
    static FORM_ERROR_CLASS = 'form__error';
    static FORM_FIELD_CLASS = 'form__field';

    fields = [];
    onSubmitHandler;
    constructor(props) {
        const { id, fields, onSubmit, formContainer } = props;
        this.id = id;
        this.onSubmitHandler = onSubmit;
        this.formContainerEl = formContainer;
        this.invalidFields = [];

        fields.forEach(field => this.fields.push(new Text(field)));
    }

    render() {
        const formHtml = this.generateFormHtml();
        this.formContainerEl.insertAdjacentHTML('beforeend', formHtml);
        this.generateFields();
    }

    remove() {
        this.formContainerEl.innerHTML = '';
    }

    generateFields() {
        const formContainer = this.formContainerEl.querySelector('form');

        this.fields.forEach(field => {
            const fieldHtml = field.render();
            formContainer.insertAdjacentHTML('beforeend', fieldHtml);
        })

        this.getFormFieldElements().forEach(formField => {
            formField.addEventListener('input', this.onFieldInput.bind(this));
        })

        formContainer.addEventListener('submit', this.onFormElementSubmit.bind(this));

        return formContainer;
    }

    onFormElementSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = [];
        this.invalidFields = [];

        formData.forEach((item, name) => {
            const formField = event.target.querySelector(`input[name=${name}]`);

            data.push({
                name,
                value: String(item),
                validationRule: formField.getAttribute('data-validation-rule'),
            })
        })

        const validator = new FormValidator(data);
        this.invalidFields = validator.validate();

        if(this.invalidFields.length) {
            this.invalidFields.forEach(field => {
                const invalidFormField = event.target.querySelector(`[data-name=${field.name}]`);
                const isError = invalidFormField.querySelector(`.${UseForm.FORM_ERROR_CLASS}`)
                if(!isError) {
                    this.renderFormFieldError(invalidFormField, field.errorMessage);
                }
            })

            return;
        }

        this.onSubmitHandler(data.reduce((acc, field) => ({...acc, [field.name]: field.value}), {}));
        event.target.reset();
    }

    onFieldInput(event) {
        const fieldErrorEl = event.target.nextElementSibling;
        const fieldName = event.target.getAttribute('name');

        if(fieldErrorEl) {
            fieldErrorEl.remove();
            this.invalidFields = this.invalidFields.filter(item => item.name !== fieldName);
        }
    }

    renderFormFieldError(fieldEl, message) {
        fieldEl.insertAdjacentHTML('beforeend', this.generateFieldErrorHtml(message));
    }

    getFormFieldElements() {
        return Array.from(this.formContainerEl.querySelectorAll(`.${UseForm.FORM_FIELD_CLASS}`));
    }

    generateFormHtml() {
        return `<form class="${UseForm.FORM_CLASS}" id="${this.id}"></form>`
    }

    generateFieldErrorHtml(message) {
        return `<p class="${UseForm.FORM_ERROR_CLASS}">${message}</p>`
    }
}
