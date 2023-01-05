class ContactList {
    static CONTACTS_ITEM_CLASS = 'contacts__item';
    static formFields = [
        {
            type: 'text',
            name: 'firstName',
            label: 'Name',
            placeholder: 'Enter name',
            validationRule: 'required',
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Surname',
            placeholder: 'Enter surname',
            validationRule: 'required',
        },
        {
            type: 'text',
            name: 'phone',
            label: 'Phone',
            placeholder: 'Enter phone',
            validationRule: 'phone',
        }
    ];

    constructor(props) {
        const { rootEl, formRootEl } = props;

        this.rootEl = rootEl;
        this.formRootEl = formRootEl;
        this.list = [];
        this.modal = new Dialog({ contentElId: this.formRootEl.id });
        this.contactsAPI = new CRUD();
        this.createForm = new UseForm({
            id: 'createForm',
            fields: ContactList.formFields,
            onSubmit: (validData) => this.onCreateFormSubmit(validData),
            formContainer: this.formRootEl,
        });

        this.bindEvents();
    }

    bindEvents() {
        this.rootEl.addEventListener('click', this.onRootElClick.bind(this));
    }

    onRootElClick(event) {
        const contactEl = event.target.closest(`.${ContactList.CONTACTS_ITEM_CLASS}`);
        const contactId = contactEl.dataset.id;
        const action = event.target.dataset.action;
        
        if(!contactEl) {
            return;
        }
        
        if(action === 'edit') {
            const editedContact = this.getContactById(contactId);
            const editForm = new UseForm({
                id: 'updateForm',
                fields: ContactList.formFields.map(field => ({...field, defaultValue: editedContact[field.name]})),
                onSubmit: this.onEditFormSubmit(contactId),
                formContainer: this.formRootEl,
            })

            editForm.remove();
            editForm.render(this.rootEl);
            this.modal.open('Edit', editForm.id, 'Edit contact');
        }
        
        if(action === 'delete') {
            this.deleteContact(contactId).then(contacts => this.render());
        }
    }

    render() {
        this.rootEl.innerHTML = '';

        this.getAllContacts()
            .then(contacts => contacts.forEach(contact => contact.render(this.rootEl)));
    }

    renderCreateForm() {
        this.createForm.remove();
        this.createForm.render(this.rootEl);
        this.modal.open('Create', this.createForm.id, 'Create contact');
    }

    async getAllContacts() {
        const allRawContacts = await this.contactsAPI.get();
        this.list = allRawContacts.map((item) => new Contact(item));

        return this.list;
    }

    getContactById(contactId) {
        return this.list.find(contact => contact.id === contactId);
    }

    async createContact(firstName, lastName, phone) {
        const newContact = await this.contactsAPI.create({firstName, lastName, phone});

        if (!newContact) {
            return this.list;
        }

        this.list.push(new Contact(newContact));

        return this.list;
    }

    async editContact(id, firstName, lastName, phone) {
        const editedContact = await this.contactsAPI.update(id, {firstName, lastName, phone});

        if (!editedContact) {
            return this.list;
        }

        this.list = this.list.map(contact => {
            if (contact.id === id) {
                return new Contact(editedContact);
            }
            return contact;
        });

        return this.list;
    }

    async deleteContact(id) {
        await this.contactsAPI.delete(id);

        return this.list.filter(contact => String(contact.id) !== id);
    }

    onCreateFormSubmit(validData) {
        const { firstName, lastName, phone } = validData;
        this
            .createContact(firstName, lastName, phone)
            .then(() => {
                this.render();
                this.modal.close();
            });
    }

    onEditFormSubmit(id) {
        return (validData) => {
            const { firstName, lastName, phone } = validData;
            this
                .editContact(id, firstName, lastName, phone)
                .then(() => {
                    this.render();
                    this.modal.close();
                });
        }
    }
}
