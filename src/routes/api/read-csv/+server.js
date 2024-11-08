import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  const filePath = path.join(process.cwd(), 'data', '/transporte.csv'); // Update with your CSV file path
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(json(results)); // Send the data as JSON
      })
      .on('error', (err) => {
        reject(new Error(`Error reading CSV file: ${err.message}`));
      });
  });
}