const SHOW_CREATE_FORM_BTN = '#showCreateFormBtn';
const CONTACTS_CONTAINER = '.contacts__list';
const FORM_CONTAINER = '.form__container';

const contactList = new ContactList({
    rootEl: $(CONTACTS_CONTAINER)[0],
    formRootEl: $(FORM_CONTAINER)[0],
});

contactList.render();

$(SHOW_CREATE_FORM_BTN).on('click', onShowCreateFormBtnClick);

function onShowCreateFormBtnClick() {
    contactList.renderCreateForm();
}
