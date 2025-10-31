export const extractErrorMessage = (error) => {
    if (!error) return null;

    if (error.response?.data) {
       
        const data = error.response.data;

        // handle zod validation errors(array format)

        if (data.errors && Array.isArray(data.errors)) {

            return data.errors.map(err => err.message).join(', ');
        }

        // handle single error message

        if (data.message){
            return data.message;
        }

        // handle error field

        if (data.error) {
            return data.error;
        }
    }

    // handle network errors

    if(error.request && error.response) {
        return 'Network error, please check your connection';
    }

    // fallback to generic error message

    if (error.message) {
        return error.message;
    }

    // handle other type of error
    return 'Something went wrong please try again later';
}