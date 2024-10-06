# Puppeteer Product Parser

This project is a Puppeteer-based Node.js script that parses product data from [vprok.ru](https://www.vprok.ru), makes a screenshot of the product page, and saves both the screenshot and the data to your local hard drive.

## Requirements

- **Node.js**: v18+ 

## Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/RagingHydra/puppeteer-test-parser.git
    ```
2. Install the necessary dependencies:
    ```bash
    npm install
    ```

## Usage
The script accepts two optional parameters:
* `--url` The URL of the product page you want to scrape (defaults to a sample product if not provided)
* `--region` The region for the product availability (defaults to "Санкт-Петербург и область")

## Running the Script
Run the script using Node.js:
    
    node index.js --url=<product-url> --region=<region-name>

### Example:
    
    node index.js --url=https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202 --region="Москва и область"

## Outputs
1. **Screenshot:** The script will take a full-page screenshot of the product and save it as `screenshot.jpg` in the project's root directory.
2. **Product Data:** The product's title, price and number of reviews will be extracted and saved as `product.txt` in the project's root directory.

## Project Structure
* `index.js`: The main entry point of the project.
* `package.json`: Includes project metadata and dependencies.

## Dependencies
* [Puppeteer](https://pptr.dev/): Headless browser for web scraping and automation.
* [minimist](https://www.npmjs.com/package/minimist): Parse command-line arguments.


