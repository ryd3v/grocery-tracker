# Grocery Tracker

A simple web application to track grocery purchases, costs, quantities, and expiry, with functionalities to export and
import data as CSV files. Built with Next.js, Tailwind CSS, and TypeScript.

## Features

- Add, edit, and delete grocery items.
- Track monthly expenses and total stock.
- Export and import data as CSV files.
- Responsive design with auto dark mode support.
- Display monthly expenses in a chart.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Chart.js
- FileSaver.js
- PapaParse

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/grocery-tracker.git
   cd grocery-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Adding an Item

1. Fill in the item details in the form: Name, Cost, Quantity, and Expiry Date.
2. Click the "Add Item" button.

### Editing an Item

1. Click the "Edit" button next to the item you want to edit.
2. Modify the item details in the form.
3. Click the "Update Item" button.

### Deleting an Item

1. Click the "Delete" button next to the item you want to delete.
2. Confirm the deletion.

### Exporting Data

1. Click the "Export to CSV" button.
2. The data will be downloaded as a CSV file.

### Importing Data

1. Click the "Import from CSV" button.
2. Select a CSV file to upload.
3. The data from the file will be added to the current list.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like
to see.

## License

This project is licensed under the MIT License.
