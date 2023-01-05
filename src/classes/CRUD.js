class CRUD {
    constructor(apiUrl = 'https://62054479161670001741b708.mockapi.io/api/contacts') {
        this.apiUrl = apiUrl;
    }

    async get(id) {
        const response = await fetch(id ? `${this.apiUrl}/${id}`: this.apiUrl);

        if(response.ok) {
            return response.json();
        }

        console.log('debug exception: ', 'Network error');
    }

    async create(contact) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-type': 'application/json',
            }
        });

        if(response.ok) {
            return response.json();
        }

        console.log('debug exception: ', 'Network error');
    }

    async update(id, contact) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contact),
            headers: {
                'Content-type': 'application/json',
            }
        });

        if(response.ok) {
            return response.json();
        }

        console.log('debug exception: ', 'Network error');
    }

    async delete(id) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if(response.ok) {
            return response.json();
        }

        console.log('debug exception: ', 'Network error');
    }
}
