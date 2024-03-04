class ImageValidator {
    constructor() {
        // Define supported image file extensions
        this.supportedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    }

    validateImageExtension(fileName) {
        // Get the file extension
        const fileExtension = fileName.split('.').pop().toLowerCase();

        // Check if the file extension is in the supported extensions list
        if (this.supportedExtensions.includes(fileExtension)) {
            return true; // Extension is valid
        } else {
            throw new Error('Invalid file extension. Supported extensions are: ' + this.supportedExtensions.join(', '));
        }
    }
}

module.exports = ImageValidator;