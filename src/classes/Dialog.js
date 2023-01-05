class Dialog {
    constructor(props) {
        const { contentElId } = props;
        this.contentElId = contentElId;
    }

    getModal(text, id, title) {
        return $(`#${this.contentElId}`).dialog({
            title,
            autoOpen: false,
            minHeight: 'auto',
            width: 350,
            modal: true,
            buttons: [
                {
                    text,
                    type: 'submit',
                    form: id,
                },
                {
                    text: 'Cancel',
                    click: this.close.bind(this),
                }
            ],
            classes: {
                "ui-dialog": "modal"
            },
        });
    }

    open(text, id, title) {
        this.getModal(text, id, title).dialog("open");
    }

    close() {
        this.getModal().dialog("close");
    }
}
